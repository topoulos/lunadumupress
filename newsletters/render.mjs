import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderNewsletter } from "./template.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const issuePath = process.argv[2];

if (!issuePath) {
  console.error("Usage: node render.mjs issues/pod-007.json");
  process.exit(1);
}

const issue = JSON.parse(fs.readFileSync(path.resolve(root, issuePath), "utf8"));
const production = process.argv.includes("--production");

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

const renderedIssue = production ? productionAssets(issue) : issue;
const outputPath = path.join(root, "dist", `${issue.slug}.html`);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, renderNewsletter(renderedIssue));
console.log(outputPath);
