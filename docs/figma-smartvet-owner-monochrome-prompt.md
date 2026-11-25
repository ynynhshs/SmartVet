# SMARTVET — OWNER PORTAL (MOBILE) · GRAY / BLACK FIGMA DESIGN PROMPT

> **How to use:** paste this entire document into the Figma agent as one prompt. It designs only the **SmartVet pet owner portal**, as a mobile app, in the gray-and-black style of the attached reference board, with correct placeholder treatment (gray blocks for data, real labels for structure).

---

## 0. Role and deliverable

You are a senior product designer. Design the **SmartVet pet owner portal** — the app a pet owner uses to register pets, track vaccinations and feeding, and read collar activity.

- **One frame set only:** `Owner (Mobile / iPhone 17)`. Every frame is **402 × 874 px**.
- **Reference layout:** iPhone 17 — CSS viewport 402 × 874, native 1206 × 2622, DPR 3, **safe area top 62px / bottom 34px**. Design at 402px width. Keep every interactive element **≥44px tall**. Respect both safe areas (no control may sit under the status bar or the home indicator).
- **Visual direction:** strictly monochrome, copied from the attached reference board ("Q-Guide", an outpatient-department app): near-black navigation rail/drawer, light-gray app shell (`#F4F5F6`), white cards with hairline borders, solid black pill buttons, gray muted text, and **no chromatic accent anywhere**. Flat surfaces — no gradients, no colored glows, no claymorphism.

**Placeholder rule (the core requirement):** this is a **structural replica of the real SmartVet owner portal**. Layout, spacing, hierarchy, navigation and component placement must match exactly. Content is **placeholder only**: gray blocks stand in for every piece of data, while all structural text stays real and legible. Do not invent screens, features or navigation items; do not drop any that are listed.

Do not copy the reference board's medical content (EVMC, queue tickets, patient names). Every label below is SmartVet's own.

### 0.1 Frame inventory — build exactly these 13 frames

| # | Frame name | What it contains |
|---|---|---|
| 1 | `Owner — Nav drawer` | Slide-out navigation drawer over a dimmed scrim |
| 2 | `Owner — Overview` | Portal home: PIN banner, 3 stat cards, quick actions |
| 3 | `Owner — My Pets` | Registered pets as flip cards |
| 4 | `Owner — Register` | Pet registration form + photo upload |
| 5 | `Owner — Vaccinations` | Vaccination follow-up cards |
| 6 | `Owner — Feeding` | Feeding history with filters |
| 7 | `Owner — Activity` | Collar activity monitoring |
| 8 | `Owner — Notifications` | Notification list |
| 9 | `Owner — Account` | Personal information form |
| 10 | `Owner — Theme` | Appearance (Light / Dark) |
| 11 | `Owner — PIN` | App-lock PIN setup + reset |
| 12 | `Owner — Login` | Sign-in state of the shared login screen |
| 13 | `Owner — Register account` · `Owner — PIN unlock` · `Owner — Reset PIN` | The other three states of the shared login screen (three separate frames) |

That is **15 frames total** (the login screen alone contributes four).

---

## 1. Design system — monochrome (mobile)

### 1.1 Color tokens (use these exact hex values only)

| Token | Hex | Use |
|---|---|---|
| Drawer / rail | `#0E0E0E` | Slide-out navigation drawer |
| Drawer text inactive | `#8C8C8C` | Inactive nav labels, drawer meta text |
| Drawer text active | `#0D0D0D` on `#FFFFFF` | Active nav item = white pill, black text |
| Drawer divider | `#262626` | Separators inside the dark drawer |
| Page background | `#F4F5F6` | Main scrolling background |
| Surface / header | `#FFFFFF` | Top header, cards, panels |
| Card border | `#E5E7EB` | 1px outline on every card and panel |
| Scrim | `rgba(17,24,39,0.45)` | Backdrop behind the open drawer |
| Primary button | `#0D0D0D` bg / `#FFFFFF` text | Main actions, pills |
| Secondary button | `#FFFFFF` bg / `#111827` text / `#D1D5DB` border | Secondary actions |
| Disabled | `#F4F5F6` bg / `#9CA3AF` text / `#E5E7EB` border | Disabled look |
| Input well | `#FFFFFF` bg / `#D1D5DB` border | Inputs, selects, textareas, date input |
| Text primary | `#111827` | Headings, values, body |
| Text muted | `#6B7280` | Subtitles, helper text, placeholders, footnotes |
| Focus ring | `#111827` | 1.5px offset ring on focused inputs |

**No other hues.** Not blue, not green, not red, not amber. If a state needs emphasis, use weight, fill or a marker symbol — never color.

### 1.2 Status without hue

Differentiate status by fill weight plus a leading marker, so nothing depends on color:

| Meaning | Treatment |
|---|---|
| Approved / Completed / Active / Available | Solid `#0D0D0D` pill, white text |
| Pending / In review / Waiting | `#FFFFFF` pill, `#111827` text, 1px `#111827` border |
| Overdue / Needs attention | `#F4F5F6` pill, `#111827` text, 1px `#E5E7EB` border, leading `!` marker |
| Inactive / Muted / Not provided | `#F4F5F6` pill, `#6B7280` text, 1px `#E5E7EB` border |

### 1.3 Typography (mobile scale)

Font stack: `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

- Screen H1: 26px, weight 800, `#111827`
- Section H2: 19px, weight 700, `#111827`
- Card H3: 16px, weight 700, `#111827`
- Body: 14px, line-height 1.5, `#111827`
- Muted / description: 12.5px, `#6B7280`
- Eyebrow label: 10.5px, weight 700, letter-spacing 1.2px, uppercase, `#6B7280`
- Stat value: 30px, weight 800, `#111827`
- Button label: 14px, weight 600

### 1.4 Radius, elevation, spacing (mobile)

**Radius:** cards/panels 12px · inner cards 10px · inputs/selects/date 10px · nav items 10px · primary buttons 999px (pill) · secondary buttons 10px · badges/pills 999px · avatars/photos 50% · media boxes 10px · PIN boxes 10px.

**Elevation:** flat. Every card, panel, input and button gets a 1px `#E5E7EB` (or `#D1D5DB` for inputs) border. No drop shadows, no inner highlights, no gradients. Hover/pressed state (annotate, do not animate): background `#F4F5F6`.

**Spacing:** 8pt grid. Panel padding 16px. Gaps 12–16px. Screen horizontal padding 14px; content padding 20px 14px 36px. Header height 64px. Nav item height 44px.

### 1.5 Placeholder treatment — the core rule

This is a **wireframe with final-looking chrome**, not a loading state. Apply this split everywhere:

**Stays REAL TEXT (wireframe labels — always legible, `#111827` or `#6B7280`):**
- Page eyebrows, H1/H2/H3 headings
- All drawer navigation labels and section headings
- All form `<label>` text, field names, helper text, required markers
- All button labels, pill/badge labels (status words such as "Approved", "Overdue", "Waiting")
- Filter labels and their option text (pet names are placeholders, activity/status words are real)
- Detail-grid **keys** (left column of every label/value pair: Species, Breed, Sex, …)
- Toggle labels, footer link text

**Becomes GRAY PLACEHOLDER (no readable content, no lorem ipsum):**
- All **values / data**: stat numbers, dates, names, emails, addresses, counts, totals, IDs, queue numbers
- Descriptions and paragraph body copy under headings
- Card bodies, notification bodies, activity/feeding detail rows (the value side)
- Pet photos, avatars, logos, QR codes, charts, uploaded images
- Input contents — leave the well empty, or show one short gray dash line

**Gray placeholder palette (use only these):**

| Use | Hex |
|---|---|
| Block fill (light) | `#E5E7EB` |
| Block fill (nested / darker) | `#D1D5DB` |
| Rounded line (text line) | `#E5E7EB`, height 8–12px, radius 999px |
| Circle (avatar / photo) | `#D1D5DB`, border-radius 50% |
| Image / media box | `#E5E7EB`, radius 10px |

**Placeholder shapes by content type:**
- One line of text → one rounded gray line, 60–90% of the container width
- Paragraph → 3 stacked lines, last one ~55% width
- Data value in a label/value pair → short gray line (80–140px) in the value column
- Pet photo / avatar → gray circle (avatars) or gray rounded rect (pet photo, QR code)
- Icon slot → 20px gray rounded square/circle `#D1D5DB`
- Chart / graph → gray rounded rect with 3–4 gray bars of varying height
- **Do not** use shimmer, animation, opacity pulsing, lorem ipsum, "TBD", "Sample", fake numbers or fake pet/people names

### 1.6 Component patterns (mobile)

- **Primary button:** `#0D0D0D` fill, white text, radius 999px, min-height 44px, padding 0 20px
- **Secondary button:** `#FFFFFF` fill, `#111827` text, 1px `#D1D5DB` border, radius 10px, min-height 44px
- **Input / select / textarea / date:** `#FFFFFF` fill, 1px `#D1D5DB` border, radius 10px, padding 12px 14px, min-height 44px, **empty** (labels stay real)
- **Panel:** `#FFFFFF`, radius 12px, 1px `#E5E7EB` border, padding 16px, flat
- **Stat card:** white, radius 12px, 1px `#E5E7EB` border, padding 16px
- **Header:** white, 64px tall, 1px bottom `#E5E7EB`, horizontal padding 14px
- **Drawer:** `#0E0E0E`, width `min(86vw, 340px)`, radius 0 12px 12px 0, full height, scrim `rgba(17,24,39,0.45)`
- **PIN boxes:** 44×52px white wells, 1px `#D1D5DB` border, radius 10px, empty

---

## 2. Shell (present on every screen)

**Header** — white, 64px tall, 1px bottom border `#E5E7EB`, horizontal padding 14px:
- Left: logo mark 34×34 (dark rounded square) + wordmark "VetCare"
- Right: small black pill button "Log out" + hamburger button 44×44 (opens the drawer)

**Navigation drawer** — off-canvas from the left, width `min(86vw, 340px)`, radius 0 12px 12px 0, full height, background `#0E0E0E`, over a scrim `rgba(17,24,39,0.45)`:
- Brand row: white "SV" tile 40×40 + "VetCare" in white + close × (44×44)
- Eyebrow "PET OWNER PORTAL", H2 "Owner Workspace", muted line "Manage pets & updates"
- Nav items: icon slot + real label, 44px tall, radius 10px. Inactive label `#8C8C8C`; active item = `#FFFFFF` pill with `#0D0D0D` text. Order exactly:
  1. Overview (active) ⌂
  2. Register a Pet ✚
  3. My Registered Pets 🐾 (gray count badge)
  4. Feeding History 🍽️
  5. Activity Monitoring 🐾
  6. Vaccinations & Follow-up 💉
  7. Notifications 🔔 (gray count badge)
  8. Settings (expandable group) ⚙ → My Account · Theme · PIN Code
- Bottom: owner block (gray avatar circle + gray name/role lines), separated by 1px `#262626` dividers

**Main content:** background `#F4F5F6`, padding 20px 14px 36px, single column, bottom padding clears the 34px safe area.

---

## 3. Screens

**O1 — Overview (`Owner — Overview`)**
- Heading: eyebrow "PET OWNER PORTAL", H1 "Owner Dashboard", two gray description lines.
- Info banner (white card, radius 12): icon slot + bold real title "Unlock faster with a PIN." + gray description lines + primary "Set up PIN" + close ×.
- **3 stat cards stacked** (white, radius 12, 1px border): real label / big gray value block / gray description line:
  - "Registered Pets" / "Total pets in your account"
  - "Unread Notifications" / "Reminders and updates"
  - "Digital Access" / "Available" + second gray line "QR codes & vaccination cards"
- Panel "Quick Actions" (real heading + gray line "Select a workspace tab to manage your pet records.") with **3 stacked action rows**: 40px icon tile + bold real title + gray description + right arrow:
  - "Register a New Pet" / "Submit pet details for veterinary verification."
  - "View Registered Pets" / "Check approval status, QR codes, and digital cards."
  - "Notifications" / "View vaccination reminders and updates."

**O2 — My Registered Pets (`Owner — My Pets`)**
- Heading: eyebrow "MY PETS", H1 "My Registered Pets", gray line; right = secondary "Refresh List".
- Status line, then **2 flip cards** (full width, ~340px tall, radius 12):
  - Front: gray circular photo placeholder, gray pet-name line, outlined status pill.
  - Back: gray H3 line, 2×2 detail grid with **real keys** (Species, Breed, Sex, Date of Birth) and gray values, gray official pet ID block, gray QR placeholder.
  - Annotate: "card flips on tap".

**O3 — Register a Pet (`Owner — Register`)**
- Heading: eyebrow "REGISTRATION FORM", H1 "Register a Pet", gray line "Submit your pet's information for veterinary review."
- Stacked panel:
  - Dashed gray upload box (icon + real text "Click to upload image") + gray file-name / remove status bar ("No file chosen", "Remove")
  - Real labels / empty wells: Pet name * · Species * (select: Dog, Cat, Rabbit, Bird, Other) · Breed · Sex (select: Unknown, Male, Female) · Date of birth · Color / markings
  - Real helper "Fields marked * are required."
  - Primary "Submit Registration" + secondary "Clear Form"; gray status line

**O4 — Vaccinations & Follow-up (`Owner — Vaccinations`)**
- Heading: eyebrow "PET HEALTH", H1 "Vaccinations & Follow-up", gray lines; right = secondary "Refresh vaccinations".
- Status line, then **2 stacked vaccination cards** (radius 12): gray title line, gray description lines, gray date rows, outlined status pill.

**O5 — Feeding History (`Owner — Feeding`)**
- Heading: eyebrow "PET CARE", H1 "Feeding History", gray lines; right = secondary "Refresh Feeding History".
- Filter toolbar (stacked, real labels): select "Filter by pet" (first option "All my pets"), select "Filter by status" (All statuses, In progress, Completed, Failed, Cancelled).
- Status line, then **2 stacked feeding cards**: gray title line, gray lines, gray detail rows with real keys, outlined status pill.

**O6 — Activity Monitoring (`Owner — Activity`)**
- Heading: eyebrow "PET WELLNESS", H1 "Activity Monitoring", gray lines; right = secondary "Refresh Activity".
- Panel "Your Pet's Activity" (real heading + gray line):
  - Filter row, real labels: select "Filter by pet" (first option "All my pets"), select "Filter by activity" (All activities, Walking, Running, Resting, Sleeping, Inactive, Unknown), date input labeled "From date"
  - Status line
  - **3 gray activity record cards**, each: gray H3 line (pet + activity), gray collar line, gray duration line, gray sensor line, gray measured-time line
  - Secondary "Load more" button
  - Dashed gray footnote line

**O7 — Notifications (`Owner — Notifications`)**
- Heading: eyebrow "COMMUNICATIONS", H1 "Notifications", gray line; toolbar with real labels "Enable Browser Notifications" + secondary "Refresh Notifications".
- Status line, then **3 stacked notification cards**: gray title line + gray body lines; the first marked unread with a 3px `#0D0D0D` left border and a small `#0D0D0D` dot.

**O8 — My Account (`Owner — Account`)**
- Heading: eyebrow "USER SETTINGS", H1 "My Account", gray line "Manage your personal information and profile photo."
- Panel "Personal Information" (real heading + gray line "Keep your contact details up to date"):
  - Centered profile block: gray circular avatar 96px, gray name line
  - Stacked real labels / empty wells: Full name · Date of birth · Sex / Gender (Select…, Male, Female, Prefer not to say) · Civil / Marital Status (Single, Married, Widowed, Separated) · Nationality / Citizenship · Government / ID Number · Occupation / Student Status (Employed, Self-Employed, Student) · Email address · Phone number · Current address · Permanent address
  - Secondary "Choose photo" + primary "Save Changes"; gray status line

**O9 — Theme (`Owner — Theme`)**
- Heading: eyebrow "USER SETTINGS", H1 "Theme", gray line "Choose how SmartVet looks on this device."
- Panel "Appearance": **2 option cards** side by side — "Light" / "Bright surfaces and blue accents." and "Dark" / "Easier on the eyes at night." — each with a gray preview swatch block and a selection indicator (Light selected). **Rewrite the "blue accents" copy to be color-neutral** (e.g. "Bright surfaces and high-contrast text.").

**O10 — PIN Code (`Owner — PIN`)**
- Heading: eyebrow "USER SETTINGS", H1 "PIN Code", gray lines.
- Panel "App lock PIN": gray status strip, then two rows of **6 square gray PIN boxes** with real labels "New PIN" and "Confirm PIN"; primary "Save PIN" + secondary "Remove PIN"; real text link "Reset it with your email and password".
- Panel "Reset your PIN": real labels / empty wells — Email, Password, New PIN (6 boxes), Confirm PIN (6 boxes); primary "Reset PIN" + secondary "Cancel".

**O11 — Login states (`Owner — Login`, `Owner — Register account`, `Owner — PIN unlock`, `Owner — Reset PIN`)**

These four are states of the shared `login.html` screen. White canvas (`#FFFFFF`), centered card (radius 12, 1px `#E5E7EB` border), brand pill "🐾 SmartVet" above the card. Draw each as its own frame.

- **`Owner — Login`:** H1 "Sign in", gray subtitle line, real labels Email / Password (password field with an eye-toggle icon slot), primary "Sign in", gray message line, footer real links ("Create owner account", "Veterinary portal", "Home").
- **`Owner — Register account`:** gray circular avatar upload, H1 "Create account", three numbered sections with real headings — 1 Personal details (Full name, Date of birth, Sex/Gender, Civil Status, Nationality, Government ID, Occupation), 2 Contact & address (Email, Phone, Current address, Permanent address), 3 Account security (Password, Confirm password) — all real labels / empty wells, then primary "Create owner account".
- **`Owner — PIN unlock`:** H1 "Unlock with PIN", gray account card (gray name line + gray email line), **6 gray masked PIN boxes**, primary "Unlock", gray message line, footer real links ("Use password instead", "Forgot PIN", "Switch account", "Create owner account").
- **`Owner — Reset PIN`:** H1 "Reset your PIN", real labels / empty wells — Email, Password, New PIN (6 boxes), Confirm PIN (6 boxes); primary "Reset PIN" + secondary "Cancel".

---

## 4. Hard rules

1. **Mobile only.** One frame set, `Owner (Mobile / iPhone 17)`, every frame 402 × 874 px. No desktop, tablet or watch frames. Do not draw a responsive desktop variant.
2. **Respect the device spec:** safe area top 62px and bottom 34px; nothing interactive under the status bar or home indicator; every tappable element ≥44px tall.
3. **Every screen keeps its shell** — the white 64px header with logo, "Log out" pill and hamburger; the navigation lives in the dark slide-out drawer, never as a bottom tab bar.
4. **Monochrome only.** Use the tokens in section 1.1 and nothing else. No blue, green, red, amber, purple, gradients or glows. Status is conveyed by fill weight and markers (section 1.2), never by hue.
5. **Skeleton = gray placeholders for content, real wireframe labels for structure.** Labels, headings, nav items, buttons, form field names, filter options, detail keys and badge text are always real and legible. Values, descriptions, rows, pet photos, avatars, QR codes, charts and input contents are always gray blocks. No lorem ipsum, no "TBD", no fake numbers, no fake pet or people names, no shimmer or animation.
6. **Element order, column counts and alignment must match the inventories exactly.** Single column throughout; do not merge, reorder or drop screens, panels, filters, fields or nav items.
7. **Name frames exactly as given** (`Owner — Nav drawer`, `Owner — Overview`, …) and keep them all on one Figma page called **Owner (Mobile / iPhone 17)**.
8. **Do not add** bottom tab bars, floating action buttons, breadcrumbs, gesture hints or navigation items that are not listed. Do not add onboarding, tooltips or empty-state illustrations beyond what is described.
9. **Keep the flat monochrome finish:** white surfaces, 1px `#E5E7EB` borders, black pill primary actions, gray placeholder blocks. Placeholders sit *on* that styling — they must not flatten it into an unstyled wireframe.
10. **Neutralize color-referencing copy.** The real Theme screen says "Bright surfaces and blue accents." — rewrite it to something color-free such as "Bright surfaces and high-contrast text."
11. **Do not reuse the reference board's content** (EVMC, Eastern Virginia Medical Center, queue tickets, patient names, Elena A.). Only the palette and styling are borrowed.

---

## 5. Suggested build order

Header component → drawer component → O1 → O2 → O3 → O4 → O5 → O6 → O7 → O8 → O9 → O10 → O11 (four login frames).

Build the header and the drawer once as components and instance them across every frame so the chrome stays identical.

---

## Optional variants (only if asked)

- **Strict grayscale vs. single status accent.** This prompt is deliberately hue-free. If the client wants statuses to read faster, allow exactly one desaturated accent (e.g. `#0F766E` teal) used *only* for Overdue/Needs-attention pills; everything else stays grayscale. Confirm before applying.
- **Dark mode.** Invert the shell only: page `#0E0E0E`, cards `#161616`, borders `#262626`, text `#F4F5F6`, muted `#8C8C8C`, primary button `#F4F5F6` with `#0D0D0D` text, placeholders `#262626` / `#333333`. Keep the same layout, radii and placeholders.
