const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const paragraphs = (items = [], className = "copy") => items
  .map((text) => `<p class="${className}">${esc(text)}</p>`)
  .join("\n");

const card = (item) => `
  <tr>
    <td class="section card-section">
      <p class="eyebrow">CARD TRANSMISSION ${esc(item.code)}</p>
      <img class="card-image" src="${esc(item.image)}" alt="${esc(item.alt)}" width="600">
      <h2>${esc(item.code)} — ${esc(item.title)}</h2>
      ${paragraphs(item.copy)}
    </td>
  </tr>`;

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
<body>
  <div class="preheader" style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">${esc(issue.previewText)}</div>
  <table role="presentation" class="shell" width="100%"><tr><td align="center">
    <table role="presentation" class="frame" width="680">
      <tr><td class="hero">
        <img class="hero-image" src="${esc(issue.hero.image)}" alt="${esc(issue.hero.alt || "Moon Gun Sam")}" width="680" style="display:block;width:100%;max-width:680px;height:auto;border:0;">
        <div class="hero-copy">
          <h1 class="issue">${esc(issue.heading)}</h1>
          <p class="deck">${esc(issue.deck)}</p>
        </div>
      </td></tr>
      <tr><td class="section">
        <p class="eyebrow">POD TRANSMISSION // ISSUE ${esc(issue.number)}</p>
        <h2>${esc(issue.opening.title)}</h2>
        ${paragraphs(issue.opening.copy)}
      </td></tr>
      ${issue.cards.map(card).join("\n")}
      <tr><td class="section question">
        <p class="eyebrow">READER RESPONSE REQUESTED</p>
        <h2>${esc(issue.readerQuestion)}</h2>
        <p class="copy">Hit reply with the DV number. Tony reads every reply. LD-12 logs them for reasons management has declined to investigate.</p>
      </td></tr>
      <tr><td class="section dossier">
        <p class="eyebrow">PROCTOR CULTURAL DISPATCH</p>
        <h2>${esc(issue.feature.title)}</h2>
        <img class="promo-image" src="${esc(issue.feature.image)}" alt="${esc(issue.feature.alt)}" width="592">
        ${paragraphs(issue.feature.copy)}
        <div class="button-wrap"><a class="button" href="${esc(issue.feature.url)}">${esc(issue.feature.button)}</a></div>
        <p class="copy"><strong>${esc(issue.feature.offer)}</strong></p>
      </td></tr>
      <tr><td class="section dossier">
        <p class="eyebrow">LD-12 INTERVIEWS MANAGEMENT</p>
        <h2>${esc(issue.interview.title)}</h2>
        <img class="promo-image" src="${esc(issue.interview.image)}" alt="${esc(issue.interview.alt)}" width="592">
        ${issue.interview.lines.map((line) => `<p class="dialogue"><span class="speaker">${esc(line.speaker)}:</span> ${esc(line.text)}</p>`).join("\n")}
      </td></tr>
      <tr><td class="section report">
        <p class="eyebrow">LD-12 FIELD REPORT ${esc(issue.fieldReport.code)}</p>
        <h2>${esc(issue.fieldReport.title)}</h2>
        <img class="report-image" src="${esc(issue.fieldReport.image)}" alt="${esc(issue.fieldReport.alt)}" width="592">
        <div class="report-meta">CLASSIFICATION: ${esc(issue.fieldReport.classification)}<br>STATUS: INVESTIGATION OPEN<br>RESPONSIBLE UNIT: LD-12</div>
        ${paragraphs(issue.fieldReport.copy)}
      </td></tr>
      <tr><td class="section books">
        <p class="eyebrow">LAUNCH TRANSMISSION // OCTOBER 13, 2026</p>
        <h2>The Dolphin begins.</h2>
        ${paragraphs(issue.launchCopy)}
        <div class="button-wrap"><a class="button" href="https://lunadumupress.com/#books">View the books</a></div>
      </td></tr>
      <tr><td class="footer">
        <strong style="color:#d7dce2">Luna Dumu Press</strong><br>
        Mythic sci-fi about love, power, and survival.<br><br>
        <a href="https://lunadumupress.com">Website</a> &nbsp;·&nbsp;
        <a href="https://shop.lunadumupress.com">Store</a> &nbsp;·&nbsp;
        <a href="https://moon-gun-sam.subscribepage.io">Pod Archive</a><br><br>
        You received this transmission because you joined the Pod.<br>
        <a href="{$unsubscribe}">Unsubscribe</a><br><br>
        Luna Dumu Press<br>
        Keep your signal open.<br>— Tony
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
