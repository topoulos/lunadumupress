const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const font = "font-family:Arial,Helvetica,sans-serif;";
const sectionStyle = `${font}padding:42px 44px;border-bottom:1px solid #252b33;background:#0a0c0f;color:#e8ebef;`;
const headingStyle = `${font}margin:18px 0 14px;color:#ffffff;font-size:23px;line-height:1.25;`;
const copyStyle = `${font}margin:0 0 16px;color:#d7dce2;font-size:15px;line-height:1.72;`;

const paragraphs = (items = [], className = "copy") => items
  .map((text) => `<p class="${className}" style="${copyStyle}">${esc(text)}</p>`)
  .join("\n");

const card = (item, accent) => `
  <tr>
    <td class="section card-section" style="${sectionStyle}background:#0b0e12;">
      <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">CARD TRANSMISSION ${esc(item.code)}</p>
      <img class="card-image" src="${esc(item.image)}" alt="${esc(item.alt)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:1px solid #344455;">
      <h2 style="${headingStyle}">${esc(item.code)} — ${esc(item.title)}</h2>
      ${paragraphs(item.copy)}
    </td>
  </tr>`;

const dossiers = (items = [], accent) => items.length ? `<tr><td class="section dossier" style="${sectionStyle}background:#0d1116;border-left:4px solid ${esc(accent)};">
  <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">DECLASSIFIED WEAPONS FILES</p>
  <h2 style="${headingStyle}">Take the armory with you.</h2>
  <p class="copy" style="${copyStyle}">Two technical dossiers from the Moon Gun Sam universe, cleared for Pod download.</p>
  ${items.map((item) => `<div style="${font}margin:22px 0;padding:22px;background:#121820;border:1px solid #2a3440;">
    <h3 style="${font}margin:0 0 10px;color:#ffffff;font-size:17px;line-height:1.35;">${esc(item.title)}</h3>
    <p class="copy" style="${copyStyle}">${esc(item.copy)}</p>
    <div class="button-wrap" style="padding:4px 0 0;text-align:left;"><a class="button" href="${esc(item.url)}" style="${font}display:inline-block;padding:13px 22px;background:${esc(accent)};color:#08090b;font-size:14px;font-weight:bold;text-decoration:none;border-radius:3px;">${esc(item.button || "Download PDF")}</a></div>
  </div>`).join("\n")}
</td></tr>` : "";

const armory = (item, accent) => item ? `<tr><td class="section dossier" style="${sectionStyle}background:#0d1116;border-left:4px solid ${esc(accent)};">
  <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">DECLASSIFIED ARMORY // T-MACH SYSTEM</p>
  <h2 style="${headingStyle}">${esc(item.title)}</h2>
  ${paragraphs(item.copy)}
  <table role="presentation" width="100%" style="width:100%;margin:22px 0;border-collapse:collapse;">
    ${item.modes.map((mode) => `<tr>
      <td width="74" style="${font}padding:13px 10px;background:${esc(mode.color)};color:${esc(mode.textColor || "#ffffff")};font-size:12px;font-weight:bold;text-align:center;vertical-align:top;">${esc(mode.name)}</td>
      <td style="${font}padding:13px 14px;background:#121820;border-bottom:1px solid #2a3440;color:#d7dce2;font-size:13px;line-height:1.55;"><strong style="color:#ffffff;">Causes:</strong> ${esc(mode.causes)}<br><strong style="color:#ffffff;">Counters:</strong> ${esc(mode.counters)}</td>
    </tr>`).join("\n")}
  </table>
  <p class="copy" style="${copyStyle}"><strong style="color:#ffffff;">THE WHEEL:</strong> ${esc(item.sequence)}</p>
  <p class="copy" style="${copyStyle}">${esc(item.advanced)}</p>
  <div style="${font}margin:22px 0;padding:16px 18px;background:#121820;border:1px solid #2a3440;color:#b9c2cc;font-size:13px;line-height:1.65;"><strong style="color:${esc(accent)};">LD-12 SAFETY NOTICE:</strong> ${esc(item.safety)}</div>
  <div class="button-wrap" style="padding:8px 0 6px;text-align:center;"><a class="button" href="${esc(item.url)}" style="${font}display:inline-block;padding:13px 22px;background:${esc(accent)};color:#08090b;font-size:14px;font-weight:bold;text-decoration:none;border-radius:3px;">${esc(item.button)}</a></div>
</td></tr>` : "";

const weaponPlatform = (item, accent) => item ? `<tr><td class="section dossier" style="${sectionStyle}background:#0d1116;border-left:4px solid ${esc(accent)};">
  <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">DECLASSIFIED ARMORY // VXG-76 PLATFORM</p>
  <h2 style="${headingStyle}">${esc(item.title)}</h2>
  ${paragraphs(item.copy)}
  <div style="${font}margin:22px 0;padding:16px 18px;background:#121820;border:1px solid #2a3440;color:#d7dce2;font-size:13px;line-height:1.7;">
    <strong style="color:#ffffff;">HARNESS:</strong> ${esc(item.harness)}<br>
    <strong style="color:#ffffff;">CHAMBER:</strong> ${esc(item.chamber)}<br>
    <strong style="color:#ffffff;">CONTROL:</strong> ${esc(item.control)}
  </div>
  <table role="presentation" width="100%" style="width:100%;margin:22px 0;border-collapse:collapse;">
    ${item.modes.map((mode) => `<tr>
      <td width="104" style="${font}padding:13px 10px;background:${esc(mode.color)};color:#ffffff;font-size:11px;font-weight:bold;text-align:center;vertical-align:top;">${esc(mode.name)}</td>
      <td style="${font}padding:13px 14px;background:#121820;border-bottom:1px solid #2a3440;color:#d7dce2;font-size:13px;line-height:1.55;">${esc(mode.copy)}</td>
    </tr>`).join("\n")}
  </table>
  <p class="copy" style="${copyStyle}"><strong style="color:#ffffff;">PSALM BOLTS:</strong> ${esc(item.psalmBolts)}</p>
  <div style="${font}margin:22px 0;padding:16px 18px;background:#121820;border:1px solid #2a3440;color:#b9c2cc;font-size:13px;line-height:1.65;"><strong style="color:${esc(accent)};">LD-12 SAFETY NOTICE:</strong> ${esc(item.safety)}</div>
  <div class="button-wrap" style="padding:8px 0 6px;text-align:center;"><a class="button" href="${esc(item.url)}" style="${font}display:inline-block;padding:13px 22px;background:${esc(accent)};color:#08090b;font-size:14px;font-weight:bold;text-decoration:none;border-radius:3px;">${esc(item.button)}</a></div>
</td></tr>` : "";

const cardSequence = (issue) => issue.cards.map((item) => `${card(item, issue.accent)}${issue.weaponPlatform?.afterCard === item.code ? weaponPlatform(issue.weaponPlatform, issue.accent) : ""}${issue.armory?.afterCard === item.code ? armory(issue.armory, issue.accent) : ""}`).join("\n");

export function renderNewsletter(issue) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${esc(issue.subject)}</title>
  <style>
    body, table, td, p, a { font-family: Arial, Helvetica, sans-serif; }
    body { margin:0 !important; padding:0 !important; background:#050608; color:#e8ebef; }
    table { border-collapse:collapse; border-spacing:0; }
    img { border:0; display:block; height:auto; max-width:100%; }
    .shell { width:100%; background:#050608; }
    .frame { width:100%; max-width:680px; background:#0a0c0f; }
    .preheader { display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; }
    .section { padding:42px 44px; border-bottom:1px solid #252b33; }
    .hero { padding:0; background:#07090d; }
    .hero-image { display:block; width:100%; max-width:680px; height:auto; }
    .hero-logo { width:82%; max-width:540px; margin:0 auto; opacity:.84; }
    .hero-copy { padding:36px 44px 42px; text-align:center; background:#090b0e; }
    .brand { margin:0 0 8px; color:#96a7bf; font-size:12px; font-weight:bold; letter-spacing:6px; }
    .issue { margin:0 0 12px; color:#ffffff; font-size:32px; line-height:1.15; }
    .deck { margin:0; color:#b9c2cc; font-size:15px; line-height:1.65; }
    .eyebrow { margin:0 0 12px; color:${esc(issue.accent)}; font-size:11px; font-weight:bold; letter-spacing:2.5px; text-transform:uppercase; }
    h2 { margin:18px 0 14px; color:#ffffff; font-size:23px; line-height:1.25; }
    h3 { margin:24px 0 10px; color:#ffffff; font-size:17px; line-height:1.35; }
    .copy { margin:0 0 16px; color:#d7dce2; font-size:15px; line-height:1.72; }
    .card-section { background:#0b0e12; }
    .card-image { width:100%; border:1px solid #344455; box-shadow:0 0 20px rgba(71,150,207,.16); }
    .question { background:#10151b; text-align:center; }
    .question h2 { color:${esc(issue.accent)}; }
    .dossier { background:#0d1116; border-left:4px solid ${esc(issue.accent)}; }
    .dialogue { margin:0 0 14px; color:#d7dce2; font-size:14px; line-height:1.7; }
    .speaker { color:#ffffff; font-weight:bold; letter-spacing:.5px; }
    .promo-image, .report-image { width:100%; margin:20px 0; }
    .button { display:inline-block; padding:13px 22px; background:${esc(issue.accent)}; color:#08090b !important; font-size:14px; font-weight:bold; text-decoration:none; border-radius:3px; }
    .button-wrap { padding:8px 0 16px; text-align:center; }
    .report { background:#090b0e; border-top:3px solid #3b4653; }
    .report-meta { padding:14px 16px; background:#121820; color:#aeb9c5; font-size:12px; line-height:1.7; }
    .books { background:#0a0d11; }
    .book-table { width:100%; }
    .book-cover { width:115px; }
    .book-copy { padding-left:22px; vertical-align:top; }
    .footer { padding:34px 44px 48px; color:#87919c; font-size:11px; line-height:1.7; }
    .footer a { color:#9db9d6; }
    @media only screen and (max-width:620px) {
      .section, .hero-copy { padding:30px 22px !important; }
      .hero-logo { width:88% !important; }
      .issue { font-size:27px !important; }
      .book-cover { width:92px !important; }
      .book-copy { padding-left:16px !important; }
    }
  </style>
</head>
<body style="margin:0!important;padding:0!important;background:#050608;color:#e8ebef;">
  <div class="preheader" style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">${esc(issue.previewText)}</div>
  <table role="presentation" class="shell" width="100%" bgcolor="#050608" style="width:100%;background:#050608;border-collapse:collapse;"><tr><td align="center" bgcolor="#050608" style="background:#050608;">
    <table role="presentation" class="frame" width="680" bgcolor="#0a0c0f" style="width:100%;max-width:680px;background:#0a0c0f;border-collapse:collapse;">
      <tr><td class="hero" bgcolor="#07090d" style="padding:0;background:#07090d;">
        <img class="hero-image" src="${esc(issue.hero.image)}" alt="${esc(issue.hero.alt || "Moon Gun Sam")}" width="680" style="display:block;width:100%;max-width:680px;height:auto;border:0;">
        <div class="hero-copy" style="${font}padding:36px 44px 42px;text-align:center;background:#090b0e;">
          <h1 class="issue" style="${font}margin:0 0 12px;color:#ffffff;font-size:32px;line-height:1.15;">${esc(issue.heading)}</h1>
          <p class="deck" style="${font}margin:0;color:#b9c2cc;font-size:15px;line-height:1.65;">${esc(issue.deck)}</p>
        </div>
      </td></tr>
      <tr><td class="section" style="${sectionStyle}">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">POD TRANSMISSION // ISSUE ${esc(issue.number)}</p>
        <h2 style="${headingStyle}">${esc(issue.opening.title)}</h2>
        ${paragraphs(issue.opening.copy)}
      </td></tr>
      ${cardSequence(issue)}
      ${dossiers(issue.dossiers, issue.accent)}
      <tr><td class="section question" style="${sectionStyle}background:#10151b;text-align:center;">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">READER RESPONSE REQUESTED</p>
        <h2 style="${headingStyle}color:${esc(issue.accent)};">${esc(issue.readerQuestion)}</h2>
        <p class="copy" style="${copyStyle}">Hit reply with the DV number. Tony reads every reply. LD-12 logs them for reasons management has declined to investigate.</p>
      </td></tr>
      ${issue.groupPromo ? `<tr><td class="section dossier" style="${sectionStyle}background:#0d1116;border-left:4px solid ${esc(issue.accent)};">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">LD-12 TRANSMISSION // FREE READS DETECTED</p>
        <h2 style="${headingStyle}">${esc(issue.groupPromo.title)}</h2>
        <a href="${esc(issue.groupPromo.url)}" style="text-decoration:none;"><img class="promo-image" src="${esc(issue.groupPromo.image)}" alt="${esc(issue.groupPromo.alt)}" width="592" style="display:block;width:100%;max-width:592px;height:auto;margin:20px 0;border:0;"></a>
        ${paragraphs(issue.groupPromo.copy)}
        <div class="button-wrap" style="padding:8px 0 16px;text-align:center;"><a class="button" href="${esc(issue.groupPromo.url)}" style="${font}display:inline-block;padding:13px 22px;background:${esc(issue.accent)};color:#08090b;font-size:14px;font-weight:bold;text-decoration:none;border-radius:3px;">${esc(issue.groupPromo.button)}</a></div>
        <p class="copy" style="${copyStyle}"><strong>${esc(issue.groupPromo.offer)}</strong></p>
      </td></tr>` : ""}
      ${issue.feature ? `<tr><td class="section dossier" style="${sectionStyle}background:#0d1116;border-left:4px solid ${esc(issue.accent)};">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">PROCTOR CULTURAL DISPATCH</p>
        <h2 style="${headingStyle}">${esc(issue.feature.title)}</h2>
        <img class="promo-image" src="${esc(issue.feature.image)}" alt="${esc(issue.feature.alt)}" width="592" style="display:block;width:100%;max-width:592px;height:auto;margin:20px 0;border:0;">
        ${paragraphs(issue.feature.copy)}
        <div class="button-wrap" style="padding:8px 0 16px;text-align:center;"><a class="button" href="${esc(issue.feature.url)}" style="${font}display:inline-block;padding:13px 22px;background:${esc(issue.accent)};color:#08090b;font-size:14px;font-weight:bold;text-decoration:none;border-radius:3px;">${esc(issue.feature.button)}</a></div>
        <p class="copy" style="${copyStyle}"><strong>${esc(issue.feature.offer)}</strong></p>
      </td></tr>` : ""}
      ${issue.interview ? `<tr><td class="section dossier" style="${sectionStyle}background:#0d1116;border-left:4px solid ${esc(issue.accent)};">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">LD-12 INTERVIEWS MANAGEMENT</p>
        <h2 style="${headingStyle}">${esc(issue.interview.title)}</h2>
        <img class="promo-image" src="${esc(issue.interview.image)}" alt="${esc(issue.interview.alt)}" width="592" style="display:block;width:100%;max-width:592px;height:auto;margin:20px 0;border:0;">
        ${issue.interview.lines.map((line) => `<p class="dialogue" style="${font}margin:0 0 14px;color:#d7dce2;font-size:14px;line-height:1.7;"><span class="speaker" style="color:#ffffff;font-weight:bold;letter-spacing:.5px;">${esc(line.speaker)}:</span> ${esc(line.text)}</p>`).join("\n")}
      </td></tr>` : ""}
      ${issue.fieldReport ? `<tr><td class="section report" style="${sectionStyle}background:#090b0e;border-top:3px solid #3b4653;">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">LD-12 FIELD REPORT ${esc(issue.fieldReport.code)}</p>
        <h2 style="${headingStyle}">${esc(issue.fieldReport.title)}</h2>
        <img class="report-image" src="${esc(issue.fieldReport.image)}" alt="${esc(issue.fieldReport.alt)}" width="592" style="display:block;width:100%;max-width:592px;height:auto;margin:20px 0;border:0;">
        <div class="report-meta" style="${font}padding:14px 16px;background:#121820;color:#aeb9c5;font-size:12px;line-height:1.7;">CLASSIFICATION: ${esc(issue.fieldReport.classification)}<br>STATUS: INVESTIGATION OPEN<br>RESPONSIBLE UNIT: LD-12</div>
        ${paragraphs(issue.fieldReport.copy)}
      </td></tr>` : ""}
      ${issue.authorNote ? `<tr><td class="section" style="${sectionStyle}background:#10151b;">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">AUTHOR'S LOG // RELEASE WEEK</p>
        <h2 style="${headingStyle}">${esc(issue.authorNote.title)}</h2>
        ${paragraphs(issue.authorNote.copy)}
        <p class="copy" style="${copyStyle}margin-top:24px;color:#ffffff;"><strong>— Tony</strong></p>
      </td></tr>` : ""}
      <tr><td class="section books" style="${sectionStyle}background:#0a0d11;">
        <p class="eyebrow" style="${font}margin:0 0 12px;color:${esc(issue.accent)};font-size:11px;font-weight:bold;letter-spacing:2.5px;text-transform:uppercase;">${esc(issue.launchEyebrow || "LAUNCH TRANSMISSION // OCTOBER 13, 2026")}</p>
        <h2 style="${headingStyle}">${esc(issue.launchTitle || "The Dolphin begins.")}</h2>
        ${paragraphs(issue.launchCopy)}
        <div class="button-wrap" style="padding:8px 0 16px;text-align:center;"><a class="button" href="${esc(issue.launchUrl || "https://lunadumupress.com/#books")}" style="${font}display:inline-block;padding:13px 22px;background:${esc(issue.accent)};color:#08090b;font-size:14px;font-weight:bold;text-decoration:none;border-radius:3px;">${esc(issue.launchButton || "View the books")}</a></div>
      </td></tr>
      <tr><td class="footer" style="${font}padding:34px 44px 48px;background:#0a0c0f;color:#87919c;font-size:11px;line-height:1.7;">
        <strong style="color:#d7dce2">Luna Dumu Press</strong><br>
        Mythic sci-fi about love, power, and survival.<br><br>
        <a href="https://lunadumupress.com" style="color:#9db9d6;">Website</a> &nbsp;·&nbsp;
        <a href="https://shop.lunadumupress.com" style="color:#9db9d6;">Store</a> &nbsp;·&nbsp;
        <a href="https://moon-gun-sam.subscribepage.io" style="color:#9db9d6;">Pod Archive</a><br><br>
        You received this transmission because you joined the Pod.<br>
        <a href="{$unsubscribe}" style="color:#9db9d6;">Unsubscribe</a><br><br>
        Luna Dumu Press<br>
        Keep your signal open.<br>— Tony
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
