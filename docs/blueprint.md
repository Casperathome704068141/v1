# **App Name**: Maple Leafs Education

## Core Features:

- Login / Register: Email/password inputs, “Forgot password” link, social SSO (Google, Facebook), error states.
- Onboarding Wizard: Email verification screens, welcome messages, progress indicator.
- Dashboard: Quick-access cards for Eligibility Scanner (3-min quiz), College Match AI preview, Timeline of application milestones
- Eligibility Quiz: Horizontal progress bar, multi-choice questions, result screen with approval likelihood score & explanation tooltip.
- College Match wizard: Search and filter UI, reasoning panel explaining DLI filtering logic, results grid with “Save favorite” toggles. The reasoning tool helps with dynamic filtering.
- Application Wizard: 5-step form: Profile details; Document upload (drag-and-drop); Preview & edit uploads; E-signature capture; Fee payment (integrated Stripe/Flutterwave)
- Document Locker: Secure file list with thumbnails, preview overlay, expiry alerts, share-link controls.
- Payments Hub: Payment method selector (Stripe, M-Pesa, Flutterwave, Airtel), form states (idle, loading, success, error).
- Appointment Booking: VAC slot calendar view, time-slot modal, booking confirmation, “Add to Google Calendar” flow.
- Timeline & Notifications: Color-coded SVG timeline, interactive tooltips, new-event pop-in animations.
- Support & Resources: FAQ section
- Admin Console: User segmentation filters (by program, status); Analytics dashboard with bar and line charts; News CMS editor UI; Case-management overview
- IRCC API Status Polling: Integrate directly with IRCC’s status API (or screen-scraping fallback) to automatically fetch application progress instead of manual updates.
- Real-Time Push Notifications: SMS or push messages on milestone changes (LOA issued, biometrics scheduled, PPR received).
- Profile Health Dashboard: A quick “readiness” meter showing whether the user has completed all required steps, documents, and payments.
- Audit Logs & Data Export: Allow users (and admins) to download a full log of their interactions and form submissions (useful for audits or appeals).
- Document Checklist & Reminders: A task list tied to each wizard flow, with automated email/SMS reminders for upcoming deadlines or missing uploads.
- Bulk Upload & CSV Import: Let power users (e.g. education agents) onboard multiple applicants via spreadsheet import.
- Multi-Language UI: Offer French, English, Swahili, Amharic, etc., both for forms and in-app help.
- Accessibility Compliance: WCAG 2.1 AA features: high-contrast mode, alt-text on images, keyboard navigation.
- Role-Based Admin Access: Tiered admin roles (Super-admin, Case-worker, Agent) with scoped permissions.
- Cohort & Funnel Analytics: Visualize drop-off rates at each wizard step, average time to PPR, and channel effectiveness (e.g. social SSO vs. email).
- Automated Outreach Campaigns: Triggered emails or SMS to nudge users who stall at a particular step (e.g. never finish the eligibility quiz).

## Style Guidelines:

- Navy #002147 (headers, nav)
- Light Gray #F1F3F5 (backgrounds, cards)
- Teal #008080 (primary CTAs, links)
- Gold #FFD300 (focus rings, progress)
- Green #2A9D8F (success states)
- Red #E63946 (errors, overdue)
- Purple #6F42C1 (premium ribbons)
- Montserrat (H1–H6)
- Lato (body)
- Roboto Mono (monospace)
- Hero scroll parallax
- Card lift + glare
- Button press-scale
- Timeline SVG-draw + tick pop