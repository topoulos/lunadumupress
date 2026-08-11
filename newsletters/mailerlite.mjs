import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderNewsletter } from "./template.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error("Missing newsletters/.env");
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator);
    const value = line.slice(separator + 1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnv();

const token = process.env.MAILERLITE_API_TOKEN;
if (!token) throw new Error("MAILERLITE_API_TOKEN is not configured");

async function api(endpoint, options = {}) {
  const response = await fetch(`https://connect.mailerlite.com/api${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`MailerLite ${response.status}: ${body.message || "request failed"}`);
  }
  return body;
}

async function inspectAccount() {
  const [groupsResponse, campaignsResponse] = await Promise.all([
    api("/groups?limit=100&sort=name"),
    api("/campaigns?limit=10&filter[status]=sent")
  ]);

  const groups = (groupsResponse.data || []).map((group) => ({
    id: group.id,
    name: group.name,
    activeCount: group.active_count ?? null
  }));

  const recentSenders = [];
  const seen = new Set();
  for (const campaign of campaignsResponse.data || []) {
    for (const email of campaign.emails || []) {
      const key = `${email.from_name || ""}|${email.from || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      recentSenders.push({
        fromName: email.from_name || null,
        from: email.from || null
      });
    }
  }

  console.log(JSON.stringify({ groups, recentSenders }, null, 2));
}

async function fetchCursorPages(endpoint) {
  const items = [];
  let cursor = null;
  do {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await api(`${endpoint}${cursor ? `${separator}cursor=${encodeURIComponent(cursor)}` : ""}`);
    items.push(...(response.data || []));
    cursor = response.meta?.next_cursor || null;
  } while (cursor);
  return items;
}

async function inspectSignupAttribution(date) {
  if (!date) throw new Error("Provide a date in YYYY-MM-DD format");

  const subscribers = await fetchCursorPages("/groups/180902431699240237/subscribers?limit=100&filter[status]=active");
  const todaysSubscribers = subscribers.filter((subscriber) =>
    String(subscriber.created_at || subscriber.subscribed_at || "").startsWith(date)
  );
  const ids = new Set(todaysSubscribers.map((subscriber) => subscriber.id));

  const sources = {};
  const countries = {};
  for (const subscriber of todaysSubscribers) {
    const source = subscriber.source || "unknown";
    sources[source] = (sources[source] || 0) + 1;
    const country = subscriber.fields?.country || "unknown";
    countries[country] = (countries[country] || 0) + 1;
  }

  const formSummaries = [];
  for (const type of ["embedded", "popup", "promotion"]) {
    const formsResponse = await api(`/forms/${type}?limit=100&sort=-last_registration_at`);
    for (const form of formsResponse.data || []) {
      if (!form.last_registration_at || !String(form.last_registration_at).startsWith(date)) continue;
      const formSubscribers = await fetchCursorPages(`/forms/${form.id}/subscribers?limit=100&filter[status]=active`);
      const matches = formSubscribers.filter((subscriber) => ids.has(subscriber.id)).length;
      if (matches > 0) {
        formSummaries.push({
          id: form.id,
          name: form.name,
          type,
          matches,
          lastRegistrationAt: form.last_registration_at
        });
      }
    }
  }

  console.log(JSON.stringify({
    date,
    mainListActiveCount: subscribers.length,
    signupsFound: todaysSubscribers.length,
    sources,
    countries,
    forms: formSummaries,
    signupTimes: todaysSubscribers.map((subscriber) => subscriber.created_at || subscriber.subscribed_at).sort()
  }, null, 2));
}

async function inspectDraft(campaignId) {
  if (!campaignId) throw new Error("Provide a campaign ID");
  const result = await api(`/campaigns/${campaignId}`);
  const campaign = result.data || {};
  const content = campaign.emails?.[0]?.content || "";
  const imageUrls = [...content.matchAll(/https:\/\/lunadumupress\.com\/[^\s"')]+/g)]
    .map((match) => match[0]);

  console.log(JSON.stringify({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    recipients: campaign.filter_for_humans,
    scheduledFor: campaign.scheduled_for,
    deliverySchedule: campaign.delivery_schedule,
    updatedAt: campaign.updated_at,
    hasBrandedHero: content.includes("hero-west-comm-tower-branded.jpg"),
    hasNewPreheader: content.includes("footwear-compliance failure"),
    preheaderHasInlineHide: content.includes("display:none!important;visibility:hidden"),
    heroUsesImageTag: /<img[^>]+hero-west-comm-tower-branded\.jpg/i.test(content),
    hasInlineDarkTheme: content.includes('bgcolor="#050608"') && content.includes("background:#0a0c0f"),
    hasInlineAccentStyles: content.includes("color:#df5b3f") && content.includes("background:#df5b3f"),
    contentLength: content.length,
    imageUrls: [...new Set(imageUrls)]
  }, null, 2));
}

function productionAssets(value) {
  if (Array.isArray(value)) return value.map(productionAssets);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, productionAssets(child)]));
  }
  if (typeof value === "string" && value.startsWith("../../images/")) {
    return `https://lunadumupress.com/${value.slice(6)}`;
  }
  return value;
}

async function createTestDraft(issueFile) {
  if (!issueFile) throw new Error("Provide an issue JSON file");

  const issuePath = path.resolve(root, issueFile);
  const issue = productionAssets(JSON.parse(fs.readFileSync(issuePath, "utf8")));
  const content = renderNewsletter(issue);

  if (content.includes("../../images/") || content.includes("src=\"../")) {
    throw new Error("Draft contains local image paths");
  }
  if (!content.includes("{$unsubscribe}")) {
    throw new Error("Draft is missing the MailerLite unsubscribe variable");
  }

  const result = await api("/campaigns", {
    method: "POST",
    body: JSON.stringify({
      name: `Pod #${issue.number} — API TEST DRAFT`,
      type: "regular",
      groups: ["180782031675851955"],
      emails: [{
        subject: issue.subject,
        from_name: "Tony Angel",
        from: "hello@lunadumupress.com",
        reply_to: "hello@lunadumupress.com",
        content
      }]
    })
  });

  console.log(JSON.stringify({
    id: result.data?.id,
    name: result.data?.name,
    status: result.data?.status,
    recipients: result.data?.filter_for_humans,
    missingData: result.data?.missing_data,
    warnings: result.data?.warnings
  }, null, 2));
}

async function createProductionDraft(issueFile) {
  if (!issueFile) throw new Error("Provide an issue JSON file");

  const issuePath = path.resolve(root, issueFile);
  const issue = productionAssets(JSON.parse(fs.readFileSync(issuePath, "utf8")));
  const content = renderNewsletter(issue);

  if (content.includes("../../images/") || content.includes("src=\"../")) {
    throw new Error("Draft contains local image paths");
  }
  if (!content.includes("{$unsubscribe}")) {
    throw new Error("Draft is missing the MailerLite unsubscribe variable");
  }

  const result = await api("/campaigns", {
    method: "POST",
    body: JSON.stringify({
      name: `Pod #${issue.number} — ${issue.heading}`,
      type: "regular",
      groups: ["180902431699240237"],
      emails: [{
        subject: issue.subject,
        from_name: "Tony Angel",
        from: "hello@lunadumupress.com",
        reply_to: "hello@lunadumupress.com",
        content
      }]
    })
  });

  console.log(JSON.stringify({
    id: result.data?.id,
    name: result.data?.name,
    status: result.data?.status,
    recipients: result.data?.filter_for_humans,
    missingData: result.data?.missing_data,
    warnings: result.data?.warnings
  }, null, 2));
}

async function scheduleDraft(campaignId, date, hours, minutes, timezoneName = "America/Chicago") {
  if (!campaignId || !date || !hours || !minutes) {
    throw new Error("Provide campaign ID, date, hours, and minutes");
  }

  const timezones = await api("/timezones");
  const timezone = (timezones.data || []).find((item) => item.name === timezoneName);
  if (!timezone) throw new Error(`MailerLite timezone not found: ${timezoneName}`);

  const result = await api(`/campaigns/${campaignId}/schedule`, {
    method: "POST",
    body: JSON.stringify({
      delivery: "scheduled",
      schedule: {
        date,
        hours,
        minutes,
        timezone_id: Number(timezone.id)
      }
    })
  });

  console.log(JSON.stringify({
    id: result.data?.id,
    name: result.data?.name,
    status: result.data?.status,
    recipients: result.data?.filter_for_humans,
    scheduledFor: result.data?.scheduled_for,
    deliverySchedule: result.data?.delivery_schedule,
    timezone: timezone.name,
    warnings: result.data?.warnings
  }, null, 2));
}

async function updateTestDraft(campaignId, issueFile) {
  if (!campaignId || !issueFile) {
    throw new Error("Provide a campaign ID and an issue JSON file");
  }

  const issuePath = path.resolve(root, issueFile);
  const issue = productionAssets(JSON.parse(fs.readFileSync(issuePath, "utf8")));
  const content = renderNewsletter(issue);

  if (content.includes("../../images/") || content.includes("src=\"../")) {
    throw new Error("Draft contains local image paths");
  }
  if (!content.includes("{$unsubscribe}")) {
    throw new Error("Draft is missing the MailerLite unsubscribe variable");
  }

  const result = await api(`/campaigns/${campaignId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: `Pod #${issue.number} — API TEST DRAFT`,
      groups: ["180782031675851955"],
      emails: [{
        subject: issue.subject,
        from_name: "Tony Angel",
        from: "hello@lunadumupress.com",
        reply_to: "hello@lunadumupress.com",
        content
      }]
    })
  });

  console.log(JSON.stringify({
    id: result.data?.id,
    name: result.data?.name,
    status: result.data?.status,
    recipients: result.data?.filter_for_humans,
    missingData: result.data?.missing_data,
    warnings: result.data?.warnings
  }, null, 2));
}

const command = process.argv[2];

if (command === "inspect") {
  await inspectAccount();
} else if (command === "inspect-signups") {
  await inspectSignupAttribution(process.argv[3]);
} else if (command === "inspect-draft") {
  await inspectDraft(process.argv[3]);
} else if (command === "create-test-draft") {
  await createTestDraft(process.argv[3]);
} else if (command === "create-production-draft") {
  await createProductionDraft(process.argv[3]);
} else if (command === "update-test-draft") {
  await updateTestDraft(process.argv[3], process.argv[4]);
} else if (command === "schedule-draft") {
  await scheduleDraft(process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7]);
} else {
  console.error("Usage: node mailerlite.mjs inspect | inspect-signups YYYY-MM-DD | inspect-draft CAMPAIGN_ID | create-test-draft ISSUE | create-production-draft ISSUE | update-test-draft CAMPAIGN_ID ISSUE | schedule-draft CAMPAIGN_ID YYYY-MM-DD HH MM [TIMEZONE]");
  process.exit(1);
}
