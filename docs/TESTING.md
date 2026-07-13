# Testing checklist

## Automated gates

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Supabase migration applies to an empty local database
- [ ] Seed signs in with `olivia@example.com` / `padua-demo`

## Public and authentication

- [ ] Landing CTAs open onboarding and tour preparation
- [ ] Metadata, canonical URL, social preview, sitemap, and robots render
- [ ] Onboarding blocks invalid email, guest count, and budget values
- [ ] Exact/month date options require a date; undecided does not
- [ ] Password, magic-link, reset, callback, and sign-out flows work
- [ ] Protected routes redirect signed-out users when Supabase is configured

## Couple workspace

- [ ] Sidebar, mobile bottom navigation, and mobile drawer are keyboard accessible
- [ ] Checklist add/edit/delete/status/filter/reorder flows work
- [ ] Wedding-day timeline adds and reorders items
- [ ] Budget totals and accessible chart summary update after adding an item
- [ ] Guest search, sort, filters, pagination, bulk updates, CSV import/export work
- [ ] Vendor search, filters, and record creation work
- [ ] Inspiration accepts URL and local previews; favorites and palette update
- [ ] Venue sections retain clear save confirmation
- [ ] Notes pin/add/delete; document mock uploads and deletes
- [ ] Team request validates body and adds a history item
- [ ] Final-detail and settings controls provide confirmation

## Authorization and security

- [ ] Couple A cannot select or mutate Couple B records
- [ ] Staff can access only weddings listed in `wedding_members`
- [ ] Staff-only notes/messages are hidden from couple users
- [ ] Only administrators can edit templates, venue content, and preferred vendors
- [ ] Storage rejects paths outside the authenticated wedding membership
- [ ] Signed URLs expire and service-role credentials never reach the browser
- [ ] Support endpoint rejects invalid, unauthenticated, and unauthorized requests

## Responsive and accessibility

- [ ] 320 px, 390 px, 768 px, 1024 px, and 1440 px layouts
- [ ] 200% browser zoom without lost controls
- [ ] Keyboard-only operation with visible focus
- [ ] Screen-reader names for icon buttons, progress, charts, and form errors
- [ ] Reduced-motion preference
- [ ] Contrast meets WCAG 2.2 AA
- [ ] Loading, empty, error, success, and disabled states

## Deployment smoke test

- [ ] Vercel environment variables point to the intended Supabase project
- [ ] Supabase auth Site URL and redirect allowlist match deployment domains
- [ ] Public preview cards load at 1200×630
- [ ] Preview deployments are excluded from indexing
- [ ] Production CSP/monitoring and distributed rate limiter are configured
