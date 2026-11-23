# SMARTVET — GRAY / BLACK FIGMA DESIGN PROMPT

> **How to use:** paste this entire document into the Figma agent as one prompt. It designs the real SmartVet interface in the gray-and-black style of the attached reference board, with correct placeholder treatment (gray blocks for data, real labels for structure).
>
> The reference board is a hospital OPD system ("Q-Guide"): near-black left rail, light-gray app shell, white cards with hairline borders, solid black pill buttons, gray secondary text, and **no chromatic accent anywhere**. Copy that.

---

## 0. Role and deliverable

You are a senior product designer. Design the **SmartVet** veterinary platform in Figma. SmartVet has two sides:

- **Set A — Veterinary clinic workspace** (desktop), frames **1440 × 900**
- **Set B — Pet owner app** (mobile, iPhone 17), frames **402 × 874**

**Visual direction:** strictly monochrome. Near-black navigation rail, light-gray page background (`#F4F5F6`), white cards with 1px `#E5E7EB` borders, solid black pill primary buttons, gray muted text. Flat surfaces — no gradients, no colored glows, no claymorphism. Match the reference board's density and typography hierarchy.

**Placeholder rule (the core requirement):** this is a **structural replica of the real SmartVet UI**. Layout, spacing, hierarchy, navigation and component placement must match exactly. Content is **placeholder only**: gray blocks stand in for every piece of data, while all structural text stays real and legible. Do not invent screens, features or navigation items; do not drop any that are listed.

Do not copy the reference board's medical content (EVMC, queue tickets, patient names). Every label below is SmartVet's own.

---

## 1. Design system — monochrome

### 1.1 Color tokens (use these exact hex values only)

| Token | Hex | Use |
|---|---|---|
| Rail / sidebar | `#0E0E0E` | Left navigation rail, all app screens |
| Rail text inactive | `#8C8C8C` | Inactive nav labels, rail meta text |
| Rail text active | `#0D0D0D` on `#FFFFFF` | Active nav item = white pill, black text |
| Rail divider | `#262626` | Separators inside the dark rail |
| Page / app shell | `#F4F5F6` | Main background behind cards |
| Surface / header | `#FFFFFF` | Top header, cards, panels, table panel |
| Card border | `#E5E7EB` | 1px outline on every card, panel, table |
| Primary button | `#0D0D0D` bg / `#FFFFFF` text | Main actions, pills |
| Secondary button | `#FFFFFF` bg / `#111827` text / `#D1D5DB` border | Secondary actions |
| Disabled | `#F4F5F6` bg / `#9CA3AF` text / `#E5E7EB` border | Disabled look |
| Input well | `#FFFFFF` bg / `#D1D5DB` border | Inputs, selects, textareas |
| Text primary | `#111827` | Headings, values, body |
| Text muted | `#6B7280` | Subtitles, helper text, placeholders, footnotes |
| Focus ring | `#111827` | 1.5px offset ring on focused inputs |

**No other hues.** Not blue, not green, not red, not amber. If a state needs emphasis, use weight, fill or a marker symbol — never color.

### 1.2 Status without hue

Differentiate status by fill weight plus a leading marker, so nothing depends on color:

| Meaning | Treatment |
|---|---|
| Approved / Completed / Active / In service | Solid `#0D0D0D` pill, white text |
| Pending / In review / Waiting | `#FFFFFF` pill, `#111827` text, 1px `#111827` border |
| Overdue / Needs attention | `#F4F5F6` pill, `#111827` text, 1px `#E5E7EB` border, leading `!` marker |
| Inactive / Muted / Disabled | `#F4F5F6` pill, `#6B7280` text, 1px `#E5E7EB` border |

Clinic stat cards use four grayscale weights instead of color: `#0D0D0D`, `#374151`, `#6B7280`, and `#F4F5F6` with a `#E5E7EB` border. Text on the three dark ones is white.

### 1.3 Typography

Font stack: `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

- Screen H1: 30px, weight 800, `#111827`
- Section H2: 20px, weight 700, `#111827`
- Card H3: 16px, weight 700, `#111827`
- Body: 14px, line-height 1.5, `#111827`
- Muted / description: 12.5px, `#6B7280`
- Eyebrow label: 11px, weight 700, letter-spacing 1.2px, uppercase, `#6B7280`
- Stat value: 34px, weight 800, `#111827` (white on dark stat cards)
- Button label: 14px, weight 600

### 1.4 Radius, elevation, spacing

**Radius:** panels/cards 12px · inner cards 10px · inputs/selects 10px · nav items 10px · primary buttons 999px (pill) · secondary buttons 10px · badges/pills 999px · avatars/photos 50% · media boxes 10px.

**Elevation:** flat. Every card, panel, input and button gets a 1px `#E5E7EB` (or `#D1D5DB` for inputs) border. No drop shadows, no inner highlights, no gradients. Hover state (annotate, do not animate): background `#F4F5F6`.

**Spacing:** 8pt grid. Panel padding 24px (16px on mobile). Gaps 12–20px. Main content horizontal padding 28–40px. Nav item height 44px.

### 1.5 Placeholder treatment — the core rule

This is a **wireframe with final-looking chrome**, not a loading state. Apply this split everywhere:

**Stays REAL TEXT (wireframe labels — always legible, `#111827` or `#6B7280`):**
- Page eyebrows, H1/H2/H3 headings
- All navigation labels, sidebar headings, section labels
- All form `<label>` text, field names, helper text, required markers
- All button labels, pill/badge labels (status words such as "Approved", "Overdue", "Waiting")
- Table header cells (`Pet / Patient ID`, `Vaccine`, `Due Date`, `Status`)
- Detail-grid **keys** (left column of every label/value pair: Species, Breed, Sex, …)
- Toggle labels, footer link text, filter labels

**Becomes GRAY PLACEHOLDER (no readable content, no lorem ipsum):**
- All **values / data**: stat numbers, dates, names, emails, addresses, counts, totals, IDs, queue numbers
- Descriptions and paragraph body copy under headings
- Table body cells and list rows
- Card bodies, notification bodies, activity/feeding detail rows (the value side)
- Photos, avatars, logos, QR codes, charts, camera preview, uploaded images
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
- Photo / avatar → gray circle (avatars, profile photos) or gray rounded rect (pet photos, camera view, QR)
- Icon slot → 20px gray rounded square/circle `#D1D5DB`
- Chart / graph → gray rounded rect with 3–4 gray bars of varying height
- **Do not** use shimmer, animation, opacity pulsing, lorem ipsum, "TBD", "Sample", fake numbers or fake pet names

### 1.6 Component patterns

- **Primary button:** `#0D0D0D` fill, white text, radius 999px, min-height 44px, padding 0 22px
- **Secondary button:** `#FFFFFF` fill, `#111827` text, 1px `#D1D5DB` border, radius 10px, min-height 44px
- **Input / select / textarea:** `#FFFFFF` fill, 1px `#D1D5DB` border, radius 10px, padding 12px 14px, **empty** (labels stay real)
- **Panel:** `#FFFFFF`, radius 12px, 1px `#E5E7EB` border, padding 24px, flat
- **Stat card:** grayscale fill (see 1.2), radius 12px, padding 20px, white or `#111827` text
- **Table:** white panel, header row 12.5px uppercase `#6B7280` labels, rows separated by 1px `#E5E7EB`
- **Modal:** white card radius 12px, header (icon badge + eyebrow + title + close ×), scrollable body, pinned footer holding the primary button
- **Top header:** white, 64px tall, 1px bottom `#E5E7EB`
- **Dark rail:** `#0E0E0E`, full height, white active pill, `#8C8C8C` inactive labels

---

## 2. SET A — VETERINARY WORKSPACE (DESKTOP)

**Frame:** 1440 × 900. Name each frame `Vet — <Screen>`.

**Shell (every screen in this set):**
- **Top header**, full width, 64px tall, `#FFFFFF`, 1px bottom border `#E5E7EB`:
  - Left: logo mark (36×36 dark rounded square) + wordmark "VetCare"
  - Right: muted text "Veterinary Workspace" + black pill button "Log out"
- **Left rail**, width 260px, full height, `#0E0E0E`, padding 16px 12px:
  - Brand row: white mark tile + "VetCare" in white
  - Eyebrow "CLINIC WORKSPACE", H2 "Veterinary Portal", muted line "Pet records and clinical services"
  - Nav items (icon slot + label, 44px tall, radius 10px). Inactive label `#8C8C8C`; active item = `#FFFFFF` pill with `#0D0D0D` text. Order exactly:
    1. Dashboard (active) 🖥️
    2. Scan Pet QR 📇
    3. Registration review 📋
    4. Vaccination management 💊
    5. Feeding history 🍽️
    6. Device Management 📟
    7. Reports & Exports 📊
    8. User Management 👤 *(administrator only)*
    9. System Settings ⚙️
    10. Device Registry 📟 *(administrator only)*
    11. Audit Logs 🧾 *(administrator only)*
  - Bottom: staff user block (gray avatar circle + gray name/role lines), then a "Dark mode" row; separate with 1px `#262626` dividers
- **Main area:** background `#F4F5F6`, padding 28px 32px 56px.

**A1 — Dashboard (`Vet — Dashboard`)**
- Heading row: left = eyebrow "CLINIC OVERVIEW" + H1 "Welcome, Staff" + two gray description lines; right = outlined pill "Verifying session".
- Row of **4 stat cards**, equal width, min-height 132px, white text on grayscale fills (`#0D0D0D`, `#374151`, `#6B7280`, `#F4F5F6`+border for the last with dark text). Each = big gray value block, real uppercase label, small gray subtext line:
  - "Registered Pets" / "Total pet records in SmartVet"
  - "Pending Review" / "Awaiting registration review"
  - "Overdue Vaccines" / "Past their recorded due date"
  - "Due Within 30 Days" / "Upcoming recorded vaccinations"
- Panel "Overall Vaccination Status": real heading + gray helper line, a gray chart/media placeholder block, and a small legend with real labels "Up to Date" and "Overdue".
- Panel "Vaccination Attention List": real heading + gray line, table with real header `Pet / Patient ID | Vaccine | Due Date | Status`, then **3 placeholder rows** (gray blocks in the first three columns, gray/outlined status pill in the last).
- Panel "Quick Actions": **2 full-width action rows**, each = 40px icon tile + bold real title + small gray description + right arrow:
  - "Review Registrations" / "Approve pets or request additional verification."
  - "Vaccination Records" / "Record a vaccination or review history."

**A2 — Scan Pet QR (`Vet — Scan QR`)**
- Heading: eyebrow "PET IDENTIFICATION", H1 "Scan Pet QR", two gray description lines.
- Panel "QR Code Scanner": status line, a large 16:9 gray camera placeholder block, gray helper line, full-width primary button "Scan Another Pet".
- Panel "Pet Information": eyebrow "IDENTIFICATION RESULT" + H2 + status pill "Approved". Two-column row: 200×200 gray photo placeholder (left) + details (right) with real labels **Pet name** and **Owner Name** above gray value lines, then a 2-column detail grid with real keys (Species, Breed, Sex, Date of Birth, Color, Pet Owner) and gray value lines; below, 3 buttons in a row with real labels: "View Owner Details", "Add Vaccination Record", "Vaccination History".

**A3 — Pending registrations (`Vet — Pending`)**
- Heading: eyebrow "PET REGISTRATION", H1 "Pending Registrations", gray line; right = secondary button "Refresh list".
- Vertical list of **3 pet cards** (radius 12, white, 1px border): 220×180 gray photo placeholder, gray H3 name line, 2 gray lines, outlined status pill, and a row of small real-label action buttons.

**A4 — Vaccination management (`Vet — Vaccinations`)**
- Heading: eyebrow "CLINICAL RECORDS", H1 "Vaccination Records", gray lines; right = secondary button "Refresh approved pets".
- Panel: full-width select labeled "Select approved pet" (empty well) + gray helper line, then H2 "Record a Vaccination" and a 2-column form grid with **real labels / empty wells**: Vaccine name * · Date administered * · Next due date · Batch or lot number · Manufacturer · Dosage · Notes (full-width textarea); primary button "Save Vaccination"; gray status line.
- Panel "Vaccination History": heading + gray line + secondary "Refresh history" button, then **3 placeholder rows**.

**A5 — Feeding history (`Vet — Feeding`)**
- Heading: eyebrow "DEVICE ACTIVITY", H1 "Feeding History", gray lines.
- Panel toolbar: left = H2 "Feeding Events" + gray line; right = select labeled "Filter by status" (options: All statuses, Running, Completed, Failed, Cancelled) + secondary "Refresh history" button.
- Grid of **3 feeding cards** (min 340px each, radius 12): gray title line, 2 gray lines, 2×2 detail grid with real keys and gray values, outlined status pill.
- Dashed footnote line at the bottom.

**A6 — Device Management (`Vet — Devices`)**
- Heading: eyebrow "IOT DEVICE CONTROL", H1 "Device Management", gray lines.
- Panel "Register a Device": stacked form with real labels / empty wells — Device Code · Device Type (select) · Assign to Pet (select) · Firmware Version · Description (textarea); primary "Register Device" button; gray status line.
- Panel "Registered Devices": heading + gray line + secondary "Refresh Devices" button, then grid of **2 device cards** (min 320px): gray title line + status pill, gray detail lines, actions row (select + real-label button).

**A7 — Reports & Exports (`Vet — Reports`)**
- Heading: eyebrow "CLINIC INSIGHTS", H1 "Reports & Exports", gray line.
- Panel with a filter row: select labeled "Report", date input labeled "From", date input labeled "To", then primary "Run report" + disabled "Download CSV"; gray status line; large gray results placeholder block.

**A8 — User Management (`Vet — Users`)**
- Heading: eyebrow "ADMINISTRATION", H1 "User Management", gray line; right = primary "Add User" button.
- Panel "Veterinary Staff Accounts": table with real header `Name | Email | Role | Status | Last Sign-in | Actions`, then **4 placeholder rows** (gray blocks; status pill; actions cell with two small real-label buttons).

**A9 — System Settings (`Vet — Settings`)**
- Heading: eyebrow "CLINIC WORKSPACE", H1 "System Settings", gray line.
- Panel "Appearance": real heading + gray line, **2 option cards** side by side — "Light" / "Bright surfaces and blue accents." and "Dark" / "Easier on the eyes at night." — each with a gray preview swatch block and a selection indicator (Light selected). **Rewrite the "blue accents" copy to be color-neutral** (e.g. "Bright surfaces and high-contrast text.").
- Panel "Clinic Profile": gray line "Shown across the veterinary workspace.", then real labels / empty wells: Clinic name · Clinic email · Clinic phone · Clinic address.
- Panel "Registration & Access": toggle rows with real labels — "Require veterinary review before a pet becomes approved", "Allow new pet owner self-registration", "Allow owner PIN fast unlock" — each with a gray toggle slot and a real state word.
- Panel "Reminders, Devices & Security": toggle rows — "Send vaccination reminder notifications", "Remind owners this many days before a due date" (with a gray number well), "Accept telemetry from registered devices".

**A10 — Device Registry (`Vet — Device Registry`)**
- Heading: eyebrow "ADMINISTRATION", H1 "Global IoT Device Registry", gray line.
- Panel "Registered Devices": filter row with selects labeled "Status" (All statuses, Active, Disabled, Revoked) and "Type" (All types, Automatic Feeder, Activity Collar); table with real header `Device Code | Assigned Pet | Last Seen | Actions`, then **4 placeholder rows**.

**A11 — Audit Logs (`Vet — Audit Logs`)**
- Heading: eyebrow "ADMINISTRATION", H1 "System Audit Logs", gray line.
- Panel "Audit Trail": filter row — select "Action", select "Record type" (All types, User, Pet, Vaccination, Feeding schedule, Feeding event, Device, Notification, System), select "Source"; table with real header `When | Actor | Record | Details`, then **4 placeholder rows**.

**A12 — Modals (`Vet — Modals`)** — draw as centered overlays on a dimmed `#F4F5F6` scrim `rgba(17,24,39,0.45)`
- **Add Vaccination Record:** header = icon badge + eyebrow "CLINICAL RECORD" + title + gray pet line + close ×; body = section label "Vaccination details" + form grid (Vaccine Name, Administration Date, Next Due Date, Batch Number, Manufacturer, Dosage, full-width Notes); footer = primary "Save Vaccination".
- **Vaccination History:** header (icon + eyebrow "CLINICAL RECORD" + title + gray pet line + close ×); body = placeholder list of 3 entries.
- **Owner details:** gray avatar + gray name line, grid of label/value rows with real keys (Email, Phone, Date of Birth, Sex/Gender, Civil Status, Nationality, Government ID, Occupation, Current Address, Permanent Address) and gray value lines; footer = secondary "Email owner" + primary "Done".
- **Add User:** header (icon + eyebrow "USER ACCOUNT" + title + close ×); body section "Account access" with real labels / empty wells — Full name *, Email address *, Role * (Veterinary Staff, Veterinarian (Administrator)), Account status (Active, Disabled), toggle "Require a password change at next sign-in", Password *; footer = primary "Add User".
- **Reset Password:** header (icon + eyebrow "ACCOUNT ACCESS" + title + close ×); body with real labels / empty wells — New password *, Confirm new password *, toggle "Require a password change at the next sign-in"; footer = primary "Reset Password".

---

## 3. SET B — PET OWNER APP (MOBILE, iPhone 17)

**Device spec (state this in the file):** iPhone 17 — CSS viewport **402 × 874 px**, native 1206 × 2622, DPR 3, safe area top **62px** / bottom **34px**. Design at 402px width; keep every interactive element ≥44px tall; respect the safe areas.

**Frame:** 402 × 874. Name each frame `Owner — <Screen>`.

**Shell (every screen in this set):**
- **Header**, 64px tall, `#FFFFFF`, 1px bottom border `#E5E7EB`, horizontal padding 14px:
  - Left: logo 34×34 (dark rounded square) + "VetCare"
  - Right: small black pill "Log out" + hamburger button 44×44
- The navigation is a **slide-out drawer** (off-canvas from the left, `min(86vw, 340px)`, radius 0 12px 12px 0) over a scrim `rgba(17,24,39,0.45)`. Draw it as its own frame `Owner — Nav drawer`:
  - Brand row: white "SV" tile (40×40) + "VetCare" + close ×
  - Eyebrow "PET OWNER PORTAL", H2 "Owner Workspace", muted line "Manage pets & updates"
  - Nav items (icon slot + real label, 44px, radius 10). Inactive `#8C8C8C`; active = `#FFFFFF` pill, `#0D0D0D` text. Order exactly:
    1. Overview (active) ⌂
    2. Register a Pet ✚
    3. My Registered Pets 🐾 (gray count badge)
    4. Feeding History 🍽️
    5. Activity Monitoring 🐾
    6. Vaccinations & Follow-up 💉
    7. Notifications 🔔 (gray count badge)
    8. Settings (expandable group) ⚙ → My Account · Theme · PIN Code
- **Main content:** background `#F4F5F6`, padding 20px 14px 36px, single column.

**B1 — Overview (`Owner — Overview`)**
- Heading: eyebrow "PET OWNER PORTAL", H1 "Owner Dashboard", two gray description lines.
- Info banner: icon slot + bold real title "Unlock faster with a PIN." + gray description lines + primary "Set up PIN" + close ×.
- **3 stat cards stacked** (white, radius 12): real label / big gray value block / gray description line — "Registered Pets" / "Total pets in your account"; "Unread Notifications" / "Reminders and updates"; "Digital Access" / "Available" + "QR codes & vaccination cards".
- Panel "Quick Actions" (real heading + gray line "Select a workspace tab to manage your pet records.") with **3 stacked action rows** (icon tile + real title + gray description + arrow):
  - "Register a New Pet" / "Submit pet details for veterinary verification."
  - "View Registered Pets" / "Check approval status, QR codes, and digital cards."
  - "Notifications" / "View vaccination reminders and updates."

**B2 — My Registered Pets (`Owner — My Pets`)**
- Heading: eyebrow "MY PETS", H1 "My Registered Pets", gray line; right = secondary "Refresh List".
- **2 flip cards** (full width, ~340px tall, radius 12):
  - Front: gray circular photo placeholder, gray pet-name line, outlined status pill.
  - Back: gray H3 line, 2×2 detail grid (real keys Species, Breed, Sex, Date of Birth + gray values), gray official pet ID block, gray QR placeholder.
  - Annotate: "card flips on tap".

**B3 — Register a Pet (`Owner — Register`)**
- Heading: eyebrow "REGISTRATION FORM", H1 "Register a Pet", gray line "Submit your pet's information for veterinary review."
- Stacked panel: dashed gray upload box (icon + real text "Click to upload image") + gray file-name/remove status bar ("No file chosen", "Remove"); then real labels / empty wells: Pet name * · Species * (select: Dog, Cat, Rabbit, Bird, Other) · Breed · Sex (select: Unknown, Male, Female) · Date of birth · Color / markings; real helper "Fields marked * are required."; buttons primary "Submit Registration" + secondary "Clear Form"; gray status line.

**B4 — Vaccinations & Follow-up (`Owner — Vaccinations`)**
- Heading: eyebrow "PET HEALTH", H1 "Vaccinations & Follow-up", gray lines; right = secondary "Refresh vaccinations".
- **2 stacked vaccination cards** (radius 12): gray title line, gray description lines, gray date rows, outlined status pill.

**B5 — Feeding History (`Owner — Feeding`)**
- Heading: eyebrow "PET CARE", H1 "Feeding History", gray lines; right = secondary "Refresh Feeding History".
- Filter toolbar (stacked, real labels): select "Filter by pet" ("All my pets"), select "Filter by status" (All statuses, In progress, Completed, Failed, Cancelled).
- **2 stacked feeding cards**: gray title line, gray lines, gray detail rows, outlined status pill.

**B6 — Activity Monitoring (`Owner — Activity`)**
- Heading: eyebrow "PET WELLNESS", H1 "Activity Monitoring", gray lines; right = secondary "Refresh Activity".
- Panel "Your Pet's Activity" (real heading + gray line): filter row with real labels — select "Filter by pet" ("All my pets"), select "Filter by activity" (All activities, Walking, Running, Resting, Sleeping, Inactive, Unknown), and a date input labeled "From date".
- Status line, then **3 gray activity record cards** (each: gray H3 line, gray collar/duration/sensor/measured lines), a secondary "Load more" button, and a dashed gray footnote.

**B7 — Notifications (`Owner — Notifications`)**
- Heading: eyebrow "COMMUNICATIONS", H1 "Notifications", gray line; toolbar with real labels "Enable Browser Notifications" + secondary "Refresh Notifications".
- **3 stacked notification cards**: gray title line + gray body lines; the first marked unread with a 3px `#0D0D0D` left border and a small `#0D0D0D` dot.

**B8 — My Account (`Owner — Account`)**
- Heading: eyebrow "USER SETTINGS", H1 "My Account", gray line "Manage your personal information and profile photo."
- Panel "Personal Information" (real heading + gray line "Keep your contact details up to date"): centered profile block (gray circular avatar 96px, gray name line), then stacked real labels / empty wells: Full name · Date of birth · Sex / Gender (Select…, Male, Female, Prefer not to say) · Civil / Marital Status (Single, Married, Widowed, Separated) · Nationality / Citizenship · Government / ID Number · Occupation / Student Status (Employed, Self-Employed, Student) · Email address · Phone number · Current address · Permanent address; buttons secondary "Choose photo" + primary "Save Changes"; gray status line.

**B9 — Theme (`Owner — Theme`)**
- Heading: eyebrow "USER SETTINGS", H1 "Theme", gray line "Choose how SmartVet looks on this device."
- Panel "Appearance": **2 option cards** side by side — "Light" / "Bright surfaces and blue accents." and "Dark" / "Easier on the eyes at night." — each with a gray preview swatch block and a selection indicator (Light selected). **Rewrite the "blue accents" copy to be color-neutral.**

**B10 — PIN Code (`Owner — PIN`)**
- Heading: eyebrow "USER SETTINGS", H1 "PIN Code", gray lines.
- Panel "App lock PIN": gray status strip, then two rows of **6 square gray PIN boxes** with real labels "New PIN" and "Confirm PIN"; primary "Save PIN" + secondary "Remove PIN"; real text link "Reset it with your email and password".
- Panel "Reset your PIN": real labels / empty wells — Email, Password, New PIN (6 boxes), Confirm PIN (6 boxes); primary "Reset PIN" + secondary "Cancel".

**B11 — Login states (`Owner — Login`, `Owner — Register account`, `Owner — PIN unlock`, `Owner — Reset PIN`)**

These four are states of the shared `login.html` screen: white canvas, centered card (radius 12, 1px `#E5E7EB`), brand pill "🐾 SmartVet" above the card.

- **`Owner — Login`:** H1 "Sign in", gray subtitle line, real labels Email / Password (password field with an eye-toggle icon slot), primary "Sign in", gray message line, footer real links ("Create owner account", "Veterinary portal", "Home").
- **`Owner — Register account`:** gray circular avatar upload, H1 "Create account", three numbered sections with real headings — 1 Personal details (Full name, Date of birth, Sex/Gender, Civil Status, Nationality, Government ID, Occupation), 2 Contact & address (Email, Phone, Current address, Permanent address), 3 Account security (Password, Confirm password) — all real labels / empty wells, then primary "Create owner account".
- **`Owner — PIN unlock`:** H1 "Unlock with PIN", gray account card (gray name line + gray email line), **6 gray masked PIN boxes**, primary "Unlock", gray message line, footer real links ("Use password instead", "Forgot PIN", "Switch account", "Create owner account").
- **`Owner — Reset PIN`:** H1 "Reset your PIN", real labels / empty wells — Email, Password, New PIN (6 boxes), Confirm PIN (6 boxes); primary "Reset PIN" + secondary "Cancel".

---

## 4. Hard rules

1. **Two frame sets only:** desktop 1440 × 900 (veterinary) and iPhone 17 402 × 874 (owner). No other sizes, no tablet, no watch.
2. **Every screen keeps its shell** — header + dark rail for Set A, header + drawer for Set B.
3. **Monochrome only.** Use the tokens in section 1.1 and nothing else. No blue, green, red, amber, purple, gradients or glows. Status is conveyed by fill weight and markers (section 1.2), never by hue.
4. **Skeleton = gray placeholders for content, real wireframe labels for structure.** Labels, headings, nav items, buttons, form field names, table headers, detail keys and badge text are always real and legible. Values, descriptions, rows, photos, avatars, QR codes, charts and input contents are always gray blocks. No lorem ipsum, no "TBD", no fake numbers, no fake pet or people names, no shimmer or animation.
5. **Element order, column counts and alignment must match the inventories exactly.** Do not merge, reorder or drop screens, panels, filters, fields or nav items.
6. **Name frames exactly as given** (`Vet — Dashboard`, `Owner — Overview`, …) and group them into two Figma pages: **Veterinary (Desktop)** and **Owner (Mobile / iPhone 17)**.
7. **Do not add** bottom tab bars, side rails, FABs, breadcrumbs or navigation items that are not listed. Do not add a "Skip" link, onboarding, tooltips or empty-state illustrations beyond what is described.
8. **Keep the flat monochrome finish:** white surfaces, 1px `#E5E7EB` borders, black pill primary actions, gray placeholder blocks. Placeholders must sit *on* that styling — they must not flatten it into an unstyled wireframe.
9. **Neutralize color-referencing copy.** The real app says "Bright surfaces and blue accents." in the Appearance settings — rewrite it to something color-free such as "Bright surfaces and high-contrast text."
10. **Do not reuse the reference board's content** (EVMC, Eastern Virginia Medical Center, queue tickets, patient names, Elena A.). Only the palette and styling are borrowed.

---

## 5. Suggested build order

**Set A:** shell → A1 → A2 → A3 → A4 → A5 → A6 → A7 → A8 → A9 → A10 → A11 → A12.
**Set B:** shell → drawer → B1 → B2 → B3 → B4 → B5 → B6 → B7 → B8 → B9 → B10 → B11.

Build the shell once as a component and instance it, so the rail and header stay identical across every frame.

---

## Optional variants (only if asked)

- **Strict grayscale vs. single status accent.** The prompt above is deliberately hue-free. If the client wants statuses to read faster, allow exactly one desaturated accent (e.g. `#0F766E` teal) used *only* for Overdue/Needs-attention pills and the Overdue stat card; everything else stays grayscale. Say so explicitly before applying it.
- **Dark mode.** Invert the shell only: page `#0E0E0E`, cards `#161616`, borders `#262626`, text `#F4F5F6`, muted `#8C8C8C`, primary button `#F4F5F6` with `#0D0D0D` text, placeholders `#262626` / `#333333`. Keep the same layout and placeholders.
