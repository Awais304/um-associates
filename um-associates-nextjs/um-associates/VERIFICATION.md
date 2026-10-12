# Verification

Checked against the local production build on 12 October 2026.

- `npm run build`: passed, including strict TypeScript checking.
- `node scripts/test-routes.cjs`: all 86 configured page routes returned 200 with one H1 and canonical metadata. No dummy `href="#"` links. Sample project/article details were noindex. Unknown routes returned 404. Unconfigured contact submissions returned an explicit 503. Retention endpoint rejected unauthenticated access. Open Graph image returned 200.
- `node scripts/test-submissions.cjs`: 17 behavior checks passed with isolated provider mocks. Covered unavailable configuration, origin checks, honeypot, consent, invalid email/requirements, bot token and hostname validation, escaped email content, successful provider acceptance, delivery failures, missing/fake/active/oversized PDFs, private upload, and cleanup after failed email delivery. No real messages were sent.
- `npm audit --omit=dev`: zero known production dependency vulnerabilities reported at verification time.
- Browser checks: desktop homepage and service-category mega menu at 1440 px; mobile homepage/contact/service layout at 390 px; mobile navigation, portfolio and insights filtering, division-dependent service options, service-specific contact preselection, FAQ expansion, form labels, and explicit disabled submission state without configuration. Checked horizontal overflow on representative views; corrected reduced-motion menu positioning.

## Deployment-dependent verification

Real email receipt, Turnstile with the production hostname, private Blob access, scheduled retention execution, provider delivery monitoring, DNS, HTTPS on the custom domain, and firewall limits require the operator's deployment accounts and environment variables. These have not been configured or tested live. No website has been deployed to the supplied domain.

Keyboard-focus styles, native disclosure controls, semantic headings, input labels, a skip link, and reduced-motion behavior are implemented. A full WCAG 2.2 AA assistive-technology audit is not claimed. Approved business photography and verified leadership/client content can be added through the documented content workflow.
