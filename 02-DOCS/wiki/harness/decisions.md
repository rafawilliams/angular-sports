# Harness decisions

- Accepted plan `eeeb8cadf77c7af0489d88b8b0239c498b57daf6baa7f7dd733f5d3e77b2041e`.
- Project kind: software.
- SDD: selected.

## 2026-11-03 — Constitución v1.0.0 ratificada

- Documento: `02-DOCS/wiki/sdd/constitution.md` (20 principios) y `REVIEW.md`.
- Lint: angular-eslint (descartados: sin linter; dejarlo pendiente). Por qué: el `.eslintrc.js` actual no soporta TS/Angular y ESLint no está instalado.
- Tests: `ng test` en verde + test por cambio de comportamiento, sin umbral de cobertura (descartados: cobertura ≥ 70 %, TDD estricto). Por qué: proyecto small.
- CI: build + test obligatorios en cada PR (descartado: solo verificación local). Por qué: los PRs de Dependabot se mergeaban sin build, y así entró `typescript@7`.
- Commits: gitmoji + Conventional Commits (descartado: texto libre). Por qué: coincide con el gitmoji-guard instalado.
- Autoría git humana: sin `Co-Authored-By` de IA ni pie "generated with".
- Riesgo: `.rsc/sello-config.json` sube a tier 2 place-order, services y dependabot.yml (checkout y workflows ya lo son por defecto). Es local: `.rsc/` está en `.gitignore`.

## 2026-11-03 — Ajustes del harness tras la revisión de tier 2

- `rsc git-permissions off`: el `.claude/settings.json` commiteado ya no preaprueba `git commit`, `git push` ni `gh pr create`. Por qué: repo público; en un clon nuevo los guards no están activos y un push a `master` no pedía permiso.
- `rsc knowledge-sync off` y borrado de `origin/rsc/knowledge`. Por qué: subía 01-TOOLS/ y 02-DOCS/wiki/ al remoto público sin preguntar, y `01-TOOLS/.gitignore` solo cubre `.env`. Los docs llegan a `master` por PR. Descartados: mantenerlo con un ignore más amplio; apagarlo y conservar la rama.
- `.rsc/.no-auto-update` (local): no se ejecuta `npx @ericrisco/rsc@<última>` al iniciar sesión. Se actualiza a mano con `rsc upgrade`.
