# Orixs.io deploy record: French (fr) locale, 2026-11-20/21

| Field | Value |
| --- | --- |
| Application | orixs-web (`/var/www/orixs-web`, https://orixs.io; PM2 `orixs-web`) |
| Branch | `release/fr-on-fc2e3a1f-20261120` |
| Deployed SHA | `62c06cd06439bcb77011ebd81be81550485f6dbc` (matched `git ls-remote` before deploy) |
| Rollback SHA | `fc2e3a1f37d2618c2095475a22adf8085b9fcd68` (from `release/web-features-20261111`) |
| Method | detached checkout of the exact SHA, `npm run build`, `pm2 reload orixs-web --update-env` as `kpyxal` |

## Why not `main`
Server HEAD was on `release/web-features-20261111` and not an ancestor of `main` (it has the Features page and
newer legal text; `main` lacked them). The candidate is server HEAD plus French only.

## Scope
- Diff vs `fc2e3a1f`: `messages/fr/*` (incl. new `features.json`, restructured legal), `i18n/routing.ts`,
  `lib/copilot/promptBuilder.ts` (French in the Copilot language note). `package.json` untouched, so no install.
- Local gates: `tsc --noEmit` clean; `npm run build` passes with `/fr` pages prerendered; fr/en key parity 0 missing, 0 extra.

## Server evidence
- Deployment reported successful by the operator. The step-by-step outputs (preflight SHA, build log, pm2 status,
  HTTP checks on /en /fr /es /ar) were NOT reviewed by the author of this record.

## Gaps
- French Privacy Policy and Terms are an unreviewed translation; they need legal and native-French review
  (Terms state the English version prevails).
- Browser acceptance of /fr pages not recorded.
- Other apps (talent, africa, insurance, construction) not yet deployed.
