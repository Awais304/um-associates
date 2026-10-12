# UM Associates

Complete multi-division corporate website built with Next.js App Router, TypeScript, Tailwind CSS, Motion, Lucide, React Hook Form, and Zod. Content is maintained in `lib/content.ts`. It includes 54 service detail routes, three division pages, nine industry pages, product, contact, careers, portfolio concepts, editorial drafts, and legal notices.

## Run

Use Node.js 20.9 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local`. Open the Local URL printed by Next.js. Run `npm run build` and `npm start` for production. Run `npm run typecheck` for TypeScript validation. Run `node scripts/test-submissions.cjs` for server security tests with mocked providers; run `node scripts/test-routes.cjs` against a running production server for route and metadata checks.

## Configure submissions

Forms deliberately do not report success when delivery is unavailable. The API returns HTTP 503 and a clear message if required configuration is missing. The UI displays alternate email and WhatsApp options. There is no silent local submission sink.

1. Create a Resend account and verify the sending domain. Set `RESEND_API_KEY`, `MAIL_FROM`, and `MAIL_TO` in the deployment environment. Use a verified address for `MAIL_FROM`.
2. Create a Cloudflare Turnstile managed widget. Add the production and preview hostnames, then set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Public variables require rebuilding after changes. Server verification checks both the one-use token and hostname. Honeypot, same-origin checking, strict input limits, and escaped email content add protection. Enable Vercel Firewall rate limiting on both POST endpoints before public deployment (for example 5 requests/minute/IP); configure infrastructure request size limits to 6 MB. In-memory rate counters are deliberately not used because serverless instances do not share them.
3. Connect a **private** Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` for CV submissions. Uploads accept only PDFs up to 5 MB, validate their signature, reject common active-content markers, generate storage names, and keep files private. Authorized administrators retrieve files through the Vercel dashboard or authenticated Blob API; do not convert them to public URLs. Marker checks are not antivirus scanning: enable your organization’s malware scanning workflow before staff download files.
4. Verify delivery with a real test enquiry and application. Without external service credentials, live delivery cannot be tested. Resend acceptance confirms queued delivery, not arrival; monitor bounces and delivery events in Resend.

If email sending fails after an upload, the handler attempts to delete that upload. An ambiguous provider timeout cannot guarantee whether the message was accepted; users are instructed to contact the team before retrying. Inspect storage for orphaned files after failures.

### Retention

Application CV retention is 90 days. Set a long random `CRON_SECRET` in Vercel. `vercel.json` schedules `/api/retention` daily at 03:00 UTC; the endpoint verifies the Bearer secret and deletes private `applications/` files whose upload date is older than 90 days. Confirm cron execution in Vercel after deployment, and monitor failure logs. On other hosts, schedule an authenticated GET yourself. Email copies require separate review and deletion; the cleanup does not access mailboxes. Enquiry retention must be defined by the operator. Handle deletion requests through the configured contact email.

## Content administration

- `lib/content.ts` and `lib/service-notes.ts`: central contact/domain settings, divisions, services, industries, jobs, portfolio concepts, draft articles, software features. Add only verified social links. Supply `assessmentUrl` only when the real platform URL is verified.
- `app/[...path]/page.tsx`: shared service and industry templates, about, careers, legal copy, project and draft article detail templates.
- `app/page.tsx` and `app/globals.css`: homepage and responsive design system.
- `components/`: shared navigation, filtering, animation, forms, and footer.
- `lib/submission.ts`: server-side validation, bot verification, private upload, and email delivery.

No active jobs, named team members, social profiles, testimonials, clients, office addresses, licenses, or claimed business statistics are invented. Add verified roles to `jobs`; a job detail route is generated from its title. Portfolio entries are illustrative concepts and insights are editorial drafts. Draft/concept details are noindex and excluded from the sitemap. To publish real articles, add verified editorial metadata, revise the draft label and indexing behavior, add Article structured data with truthful dates and author, and update the sitemap. Team profiles must be added with verified biographies and consent.

The website uses system typography (Inter when already available, otherwise Segoe UI/Arial) and original CSS illustrations. There are no unlicensed external image assets or fabricated employee photos. Add approved, licensed business photography through `next/image` when available.

## Vercel deployment and domain

1. Put this directory in a Git repository and import it into Vercel. Select Next.js. Use `npm ci` and `npm run build`; no static export is used because forms require server routes.
2. Set environment variables in the appropriate production and preview scopes. Never commit `.env.local` or keys.
3. Add `umassociates.us` and `www.umassociates.us` in Vercel Project Settings → Domains. Use the exact DNS records Vercel provides rather than hardcoding values that can change. Configure the apex to redirect to `www.umassociates.us`, matching canonical URLs in `settings.url`.
4. Verify HTTPS and test forms after DNS resolves. Add verified sender DNS records supplied by Resend independently from website DNS.

This source targets Vercel as expressly requested. Sites hosting uses a different Worker runtime, so no incompatible Sites deployment is supplied. The domain and external accounts have not been changed.

## Launch review

Review legal operator details and privacy notices with the business. Confirm supplied contact information and operational connections. Test Turnstile, email delivery, private CV access/deletion, keyboard navigation, mobile menus, filters, FAQ toggles, and all calls to action. Review dependency advisories with `npm audit` and keep the lockfile updated. Test assistive technology and contrast before claiming WCAG 2.2 AA compliance. No optional analytics or advertising scripts are loaded; if added later, implement legally required consent before loading them.

Security headers include HSTS, frame denial, MIME sniffing protection, referrer restrictions, and restricted browser permissions. Content Security Policy requires deployment-specific testing with Next.js inline assets and Turnstile; do not add an untested policy that blocks forms.
