# Moon Gun Sam newsletter generator

The generator turns one structured issue file into responsive, email-safe HTML.

## Local build

```sh
cd newsletters
npm run build:007
npm run build:008
```

The output is written to `newsletters/dist/pod-007.html` or
`newsletters/dist/pod-008.html`.

## MailerLite connection check

```sh
cd newsletters
npm run mailerlite:inspect
```

This read-only command lists campaign groups and sender identities from recent
campaigns. It does not create, update, schedule, or send anything.

## Create an Internal Test draft

```sh
cd newsletters
npm run mailerlite:draft:007
```

This creates an unscheduled draft addressed only to the `Internal Test` group.

## Create and schedule a production draft

Production campaigns are created as fresh drafts for the `Moon Gun Sam – Main
List` group, verified, and then scheduled with an explicit date and time:

```sh
node mailerlite.mjs create-production-draft issues/pod-007.json
node mailerlite.mjs inspect-draft CAMPAIGN_ID
node mailerlite.mjs schedule-draft CAMPAIGN_ID 2026-09-04 17 00 America/Chicago
```

There is deliberately no instant-send command in this project.

## Safety

- Generated campaigns begin as drafts.
- API credentials belong in `newsletters/.env`, which is ignored by Git.
- Scheduling and sending require a separate explicit action.
- Issue-specific copy and links live under `newsletters/issues/`.
- Shared visual structure lives in `newsletters/template.mjs`.
