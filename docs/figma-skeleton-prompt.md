# SMARTVET — SKELETON / WIREFRAME DESIGN PROMPT

## 0. Role and deliverable

You are a senior product designer. Create a **low-fidelity skeleton (wireframe)** of the SmartVet veterinary platform in Figma. The skeleton is a **structural replica of the existing UI**: identical layout, spacing, hierarchy, navigation and component placement, but with **placeholder content only** — gray blocks for data, real wireframe labels for everything structural.

Deliver TWO frame sets:

- **Set A — Veterinary workspace (desktop), 1440 × 900**
- **Set B — Pet owner app (mobile, iPhone 17), 402 × 874**

Do not invent new screens, features or navigation items. Reproduce exactly what is specified below. Every screen list in sections 2 and 3 is taken from the real SmartVet markup — nothing is optional, nothing is missing.

---

## 1. Global design system

**Style:** Claymorphism — soft pastel surfaces, puffy rounded cards, dual shadow (inner top highlight + soft outer diffusion), 2px light borders, generous rounding.

**Color tokens (use these exact hex values):**

| Token | Hex |
|---|---|
| Page background | `#E6F0FA` (with soft radial washes of `#87C3F5`, `#96DCCB`, `#AFB9F8` at low opacity) |
| Surface / header / sidebar | `#F1F7FE` |
| Card surface | `#EAF3FD` |
| Sunken input well | `#E4EEFB` |
| Primary text | `#23425E` |
| Heading text | `#14314C` |
| Muted text | `#537490` |
| Primary blue | `#2389E0` |
| Primary gradient | `#248CE6 → #2D65E2` (135°) |
| Success green | `#0E8A66` / dark `#07543F` |
| Warning amber | `#FFE396` / text `#614400` |
| Danger red | `#C9384F` |
| White | `#FFFFFF` |

**Clinic stat-card gradients (real values from the stylesheet, keep them):**
`red` = `#007E9E → #00B4D8` · `blue` = `#0062FF → #4D94FF` · `green` = `#18CD5E → #42E681` · `purple` = `#8E2DE2 → #4A00E0`

**Typography:** system-ui stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`).

- Screen H1: 28–32px, weight 800, color heading
- Eyebrow label: 11–12px, weight 800, letter-spacing 1.2px, uppercase, blue
- Section H2: 20px, weight 800, heading color
- Body: 15px, line-height 1.6, text color
- Muted/description: 13px, muted color
- Stat value: 32–36px, weight 900

**Radius scale:** panels/cards 26px · content cards 20px · buttons & inputs 16px · nav items 16px · inner chips/icons 10–14px · pills 999px.

**Elevation (claymorphism):** every card/panel/button gets a light 2px border `rgba(255,255,255,0.9)` plus a soft dual shadow — inner top white highlight and a large soft blue-gray drop shadow (e.g. `0 14px 28px rgba(35,82,130,0.12)`).

**Spacing:** 8pt grid. Panel padding 28px (18px on mobile). Gaps 14–24px. Main content horizontal padding 20–40px.

### 1.1 SKELETON TREATMENT — the core rule

This is a **wireframe**, not a loading state. Apply this split everywhere:

**Stays REAL TEXT (wireframe labels — always legible, in the real text color):**
- Page eyebrows, H1/H2/H3 headings
- All navigation labels, sidebar headings
- All form `<label>` text, field names, helper text, section headings inside forms
- All button labels, pill/badge labels (status text such as "Approved", "Overdue", "Pending")
- Table header cells (`Pet / Patient ID`, `Vaccine`, `Due Date`, `Status`)
- Detail-grid **keys** (left column of every label/value pair: Species, Breed, Sex, …)
- Toggle labels, footer link text

**Becomes GRAY PLACEHOLDER (no readable content, no lorem ipsum):**
- All **values / data**: stat numbers, dates, names, emails, addresses, counts, totals, IDs
- Descriptions and paragraph body copy under headings
- Table body cells and list rows
- Card bodies, notification bodies, activity/feeding detail rows (the value side)
- Photos, avatars, logos, QR codes, charts, camera preview, uploaded images
- Placeholder token text inside inputs (use an empty well, or a short gray dash line)

**Gray placeholder palette (use only these):**

| Use | Hex |
|---|---|
| Block fill (light) | `#D9E2EC` |
| Block fill (dark / nested) | `#C9D6E4` |
| Rounded line (text line) | `#DCE4EE`, height 8–12px, radius 999px |
| Circle (avatar / photo) | `#C9D6E4`, border-radius 50% |
| Image / media box | `#D9E2EC`, radius 16–20px |

**Placeholder shapes by content type:**
- One line of text → one rounded gray line, 60–90% of the container width
- Paragraph → 3 stacked lines, last one ~55% width
- Data value in a label/value pair → short gray line (80–140px) in the value column
- Photo / avatar → gray circle (avatars, profile photos) or gray rounded rect (pet photos, camera view, QR)
- Icon slot → 24px gray rounded square/circle
- Chart / graph → gray rounded rect with 3–4 gray bars of varying height
- Do **not** use shimmer, animation, or opacity pulsing — static gray blocks only
- Do **not** use lorem ipsum, "TBD", "Sample", fake numbers, or fake pet names

**Component patterns to reuse:**
- Primary button: gradient `#248CE6→#2D65E2`, white text, radius 16, min-height 44
- Secondary button: `#EAF3FD` bg, heading text, radius 16, min-height 44
- Input/select/textarea: `#E4EEFB` bg, inset shadow (sunken well), radius 16, padding 13×16, **empty** (labels stay real)
- Panel: `#F1F7FE`, radius 26, 2px white border, clay shadow, padding 28
- Stat card: `#EAF3FD` (owner) / colored gradient (clinic), radius 24, padding 24
- Modal: header (icon badge + eyebrow + title + close button), scrollable body, pinned footer with the submit button

---

## 2. SET A — VETERINARY WORKSPACE (DESKTOP)

**Frame:** 1440 × 900, name each frame `Vet — <Screen>`.
**Shell (every screen in this set):**
- Top header, full width, min-height 78px, surface `#F1F7FE`, 2px bottom border `rgba(255,255,255,0.85)`:
  - Left: logo mark (42×42 rounded square) + wordmark "VetCare"
  - Right: muted text "Veterinary Workspace" + "Log out" button (primary)
- Left sidebar, width 280px, sticky, surface `#F1F7FE`, radius 26, 2px white border, clay shadow, padding 20×12:
  - Top bar: collapse toggle (hamburger ☰, 40×40 rounded)
  - Eyebrow "CLINIC WORKSPACE", H2 "Veterinary Portal", muted line "Pet records and clinical services"
  - Nav items (icon slot + label, 48px tall, radius 16; first item active = blue gradient pill with white text):
    1. Dashboard (active) 🖥️
    2. Scan Pet QR 📇
    3. Registration review 📋
    4. Vaccination management 💊
    5. Feeding history 🍽️
    6. Device Management 📟
    7. Vaccine Inventory 🧪
    8. Reports & Exports 📊
  - Bottom: theme toggle row (icon + label "Dark mode")
- Main area: background `#E6F0FA`, padding 28px clamp(20px, 3vw, 40px) 60px.

**A1 — Dashboard (`Vet — Dashboard`)**
- Page heading row: left = eyebrow "CLINIC OVERVIEW" + H1 "Welcome, Staff" + gray description lines; right = pill badge "Verifying session".
- Thin status line below heading (gray).
- Row of **4 colored stat cards**, equal width, min-height 140, white text, each = big gray value block / real uppercase label / small gray subtext line:
  - teal `#007E9E→#00B4D8` — "Registered Pets"
  - blue `#0062FF→#4D94FF` — "Pending Review"
  - green `#18CD5E→#42E681` — "Overdue Vaccines"
  - purple `#8E2DE2→#4A00E0` — "Due Within 30 Days"
- Panel "Vaccination Attention List" (real section heading + gray muted line) with a table: real header row `Pet / Patient ID | Vaccine | Due Date | Status`, then **3 placeholder rows** (gray blocks in the first three columns, gray pill in Status).
- Panel "Quick Actions" with **2 full-width action rows**, each = 46px icon tile + bold real title + small gray description + right arrow:
  - "Review Registrations" / "Approve pets or request additional verification."
  - "Vaccination Records" / "Record a vaccination or review history."

**A2 — Scan Pet QR (`Vet — Scan QR`)**
- Heading: eyebrow "PET IDENTIFICATION", H1 "Scan Pet QR", gray description lines.
- Panel "QR Code Scanner": status line, a large 16:9 gray camera placeholder block, gray helper line, full-width "Scan Another Pet" button (visible, primary).
- Panel "Pet Information": eyebrow "IDENTIFICATION RESULT" + H2 + status badge "Approved" (real text). Two-column row = 200×200 gray photo placeholder (left) + details (right): gray H2 name line, gray ID badge pill, 2-column detail grid with **real keys** (Species, Breed, Sex, Date of Birth, Color, Pet Owner) and **gray value lines**; then 3 action buttons in a row with real labels: "View Owner Details", "Add Vaccination Record", "Vaccination History".

**A3 — Pending registrations (`Vet — Pending`)**
- Heading: eyebrow "PET REGISTRATION", H1 "Pending Registrations", gray line; right = "Refresh list" secondary button.
- Status line, then a vertical list of **3 pet cards** (radius 20, card surface): 220×180 gray photo placeholder, gray H3 name line, 2 gray lines, gray status pill, and a row of small real-label action buttons.

**A4 — Vaccination management (`Vet — Vaccinations`)**
- Heading: eyebrow "CLINICAL RECORDS", H1 "Vaccination Records", gray lines; right = "Refresh approved pets" button.
- Panel: full-width select labeled "Select approved pet" (empty well) + gray helper line, then H2 "Record a Vaccination" and a 2-column form grid with **real labels / empty wells**: Use inventory lot (optional, full width) · Doses used · Vaccine name * · Date administered * · Next due date · Batch or lot number · Manufacturer · Dosage · Notes (full-width textarea); then "Save Vaccination" primary button and a status line.
- Panel "Vaccination History": heading + gray line + "Refresh history" button, then **3 placeholder rows**.

**A5 — Feeding history (`Vet — Feeding`)**
- Heading: eyebrow "DEVICE ACTIVITY", H1 "Feeding History", gray lines.
- Panel toolbar: left = H2 "Feeding Events" + gray line; right = select labeled "Filter by status" + "Refresh history" button.
- Grid of **3 feeding cards** (min 360px each, radius 20): gray title line, 2 gray lines, 2×2 detail grid (real keys / gray values), gray status pill.
- Dashed footnote line at the bottom.

**A6 — Device Management (`Vet — Devices`)**
- Heading: eyebrow "IOT DEVICE CONTROL", H1 "Device Management", gray lines.
- Panel "Register a Device": stacked form with **real labels / empty wells** — Device Code · Device Type (select) · Assign to Pet (select) · Firmware Version · Description (textarea); "Register Device" primary button; status line.
- Panel "Registered Devices": heading + gray line + "Refresh Devices" button, then grid of **2 device cards** (min 320px): gray title + gray status pill, gray detail lines, and an actions row (select + real-label button).

**A7 — Vaccine Inventory (`Vet — Inventory`)**
- Heading: eyebrow "CLINICAL SUPPLIES", H1 "Vaccine Inventory", gray line; right = "Refresh inventory".
- Panel "Add vaccine lot": 2-column form grid with real labels / empty wells — Vaccine * · Manufacturer * · Batch / lot number * · Expiry date * · Initial doses * · Low-stock alert at · Notes (full width); "Add lot" primary button.
- Panel "Stock by lot": heading + gray line, then grid of **3 placeholder lot cards** (min 340px): gray title + gray pill, gray detail lines, gray footer row.

**A8 — Reports & Exports (`Vet — Reports`)**
- Heading: eyebrow "CLINIC INSIGHTS", H1 "Reports & Exports", gray line.
- Panel with a filter row: select labeled "Report", date input labeled "From", date input labeled "To", then "Run report" (primary) + "Download CSV" (disabled look) buttons; status line; gray results placeholder block.

**A9 — Modals (draw as centered overlay frames on top of A2/A4)**
- **Add Vaccination Record:** header = icon badge + eyebrow "CLINICAL RECORD" + title + gray pet line + "Close" button; body = section label "Inventory lot (optional)" + select row, section label "Vaccination details" + form grid (Vaccine Name, Administration Date, Next Due Date, Batch Number, Manufacturer, Dosage, full-width Notes); footer = "Save Vaccination" primary button.
- **Vaccination History:** header (icon + eyebrow "CLINICAL RECORD" + title + gray pet line + Close); body = placeholder list of 3 entries.
- **Owner details:** card with gray avatar + gray name, grid of label/value rows with real keys (Email, Phone, Date of Birth, Sex/Gender, Civil Status, Nationality, Government ID, Occupation, Current Address, Permanent Address) and gray value lines; footer = "Email owner" + "Done".

---

## 3. SET B — PET OWNER APP (MOBILE, iPhone 17)

**Device spec (state this in the file):** iPhone 17 — CSS viewport **402 × 874 px**, native 1206 × 2622, DPR 3, safe area top **62px** / bottom **34px**. Design at 402px width; keep all interactive elements ≥44px tall; respect the safe areas.

**Frame:** 402 × 874, name each frame `Owner — <Screen>`.
**Shell (every screen in this set):**
- Header, min-height 64px, surface `#F1F7FE`, horizontal padding 14px, 2px bottom border:
  - Left: logo 36×36 + "VetCare"
  - Right: "Log out" small primary button + hamburger button (44×44)
  - (Below 600px the "Pet Owner Portal" role text is hidden — omit it.)
- The sidebar is a **slide-out drawer** (off-canvas from the left, `min(86vw, 340px)`, radius 0 24px 24px 0) with a dark backdrop `rgba(8,20,35,0.48)`. Show it as one separate frame `Owner — Nav drawer` containing:
  - Brand mark "SV" (42×42 gradient tile) + close (×)
  - Eyebrow "PET OWNER PORTAL", H2 "Owner Workspace", gray line "Manage pets & updates"
  - Nav items (icon slot + real label, 48px): Overview (active) · Register a Pet · My Registered Pets (gray count badge) · Feeding History · Activity Monitoring · Vaccinations & Follow-up · Notifications (gray count badge) · Settings (expandable group → My Account, Theme, PIN Code)
- Main content: background `#E6F0FA`, padding 20px 14px 36px, single column.

**B1 — Overview (`Owner — Overview`)**
- Heading: eyebrow "PET OWNER PORTAL", H1 "Owner Dashboard", gray description lines.
- Status line.
- Info banner: icon slot + real bold title "Unlock faster with a PIN." + gray description lines + "Set up PIN" button + close (×).
- **3 stat cards stacked** (full width, card surface, radius 24): real label / big gray value block / small gray description line — Registered Pets · Unread Notifications · Digital Access.
- Panel "Quick Actions" (real heading + gray line) with **3 stacked action rows** (icon tile + real title + gray description + arrow): "Register a New Pet", "View Registered Pets", "Notifications".

**B2 — My Registered Pets (`Owner — My Pets`)**
- Heading: eyebrow "MY PETS", H1 "My Registered Pets", gray line; right = "Refresh List".
- Status line, then **2 flip cards** (full width, ~340px tall, radius 20):
  - Front: gray circular photo placeholder, gray pet-name line, gray status pill.
  - Back: gray H3 line, 2×2 detail grid (real keys species/breed/sex/DOB, gray values), gray official pet ID block, gray QR placeholder.
  - Annotate: "card flips on tap".

**B3 — Register a Pet (`Owner — Register`)**
- Heading: eyebrow "REGISTRATION FORM", H1 "Register a Pet", gray line.
- Panel, two columns on desktop-width frames but stacked at 402px: left = dashed gray upload box (icon + real text "Click to upload image") + gray file-name/remove status bar; right = stacked fields with **real labels / empty wells**: Pet name *, Species * (select), Breed, Sex (select), Date of birth, Color / markings; real helper "Fields marked * are required."; buttons "Submit Registration" (primary) + "Clear Form" (secondary); status line.

**B4 — Vaccinations & Follow-up (`Owner — Vaccinations`)**
- Heading: eyebrow "PET HEALTH", H1 "Vaccinations & Follow-up", gray lines; right = "Refresh vaccinations".
- Status line, then **2 stacked vaccination cards** (radius 20): gray title line, gray description lines, gray date rows, and a gray status pill.

**B5 — Feeding History (`Owner — Feeding`)**
- Heading: eyebrow "PET CARE", H1 "Feeding History", gray lines; right = "Refresh Feeding History".
- Filter toolbar (stacked, real labels): "Filter by pet" select, "Filter by status" select, "Apply Filters" button.
- Status line, then **2 stacked feeding cards**: gray title line, gray lines, gray detail rows, gray status pill.

**B6 — Activity Monitoring (`Owner — Activity`)**
- Heading: eyebrow "PET WELLNESS", H1 "Activity Monitoring", gray lines; right = "Refresh Activity".
- Panel "Your Pet's Activity" (real heading + gray line): filter row (real labels: Filter by pet, Filter by activity), status line, **2 gray activity record cards**, gray dashed footnote.

**B7 — Notifications (`Owner — Notifications`)**
- Heading: eyebrow "COMMUNICATIONS", H1 "Notifications", gray line; toolbar with real labels "Enable Browser Notifications" + "Refresh Notifications".
- Status line, then **3 stacked notification cards** (gray title line + gray body lines; the first marked unread with a blue left border and a gray dot).

**B8 — My Account (`Owner — Account`)**
- Heading: eyebrow "USER SETTINGS", H1 "My Account", gray line.
- Panel "Personal Information" (real heading + gray line), then a profile card (radius 20, centered): gray decorative header band, gray circular avatar, real title "My Account", gray subtitle line, then stacked fields with **real labels / empty wells**: Full name · Date of birth · Sex/Gender · Civil/Marital Status · Nationality · Government ID · Occupation · Email address · Phone number · Current address · Permanent address; buttons "Choose photo" + "Save Changes"; status line.

**B9 — Theme (`Owner — Theme`)**
- Heading: eyebrow "USER SETTINGS", H1 "Theme", gray line; status line.
- Panel "Appearance" (real heading + gray line): **2 option cards** side by side, each = gray icon slot + real title (Light / Dark) + gray description line + gray check circle (Light selected).

**B10 — PIN Code (`Owner — PIN`)**
- Heading: eyebrow "USER SETTINGS", H1 "PIN Code", gray lines; status line.
- Panel "App lock PIN" (real heading + gray line): gray status strip, then two rows of **6 square gray PIN boxes** (real labels "New PIN", "Confirm PIN"), "Save PIN" primary + "Remove PIN" secondary, and real text link "Reset it with your email and password".
- Second panel "Reset your PIN" (real heading + gray line): real labels / empty wells — Email, Password, New PIN (6 boxes), Confirm PIN (6 boxes); "Reset PIN" + "Cancel".

**B11 — Login / unlock (`Owner — Login`, `Owner — Register account`, `Owner — PIN unlock`)**

These three are the shared login screen (`public/login.html`) — a two-column card at desktop width, single column at 402px with the hero side hidden. Show the form column only on the mobile frames.

- `Owner — Login`: brand pill "🐾 SmartVet", H1 "Sign in", gray subtitle line, real labels Email / Password (password field with eye toggle icon slot), "Sign in" primary button, gray message line, footer real text links ("Create owner account", "Veterinary portal", "Home").
- `Owner — Register account`: gray circular avatar upload, H1 "Create account", three numbered sections with real headings — 1 Personal details (Full name, Date of birth, Sex/Gender, Civil Status, Nationality, Government ID, Occupation), 2 Contact & address (Email, Phone, Current address, Permanent address), 3 Account security (Password, Confirm password) — all with real labels / empty wells, then "Create owner account" primary button.
- `Owner — PIN unlock`: H1 "Unlock with PIN", gray account card (gray name line + gray email line), **6 gray masked PIN boxes**, "Unlock" primary button, gray message line, footer real text links ("Use password instead", "Forgot PIN", "Switch account", "Create owner account").

---

## 4. Hard rules

1. Two frame sets only: desktop 1440×900 (veterinary) and iPhone 17 402×874 (owner). No other sizes.
2. Every screen keeps the shell described in section 2/3 (header + sidebar for desktop; header + drawer for mobile).
3. Use only the color tokens, radii and shadows in section 1.
4. **Skeleton = gray placeholders for content, real wireframe labels for structure.** Labels, headings, nav, buttons, form field names, table headers, detail keys and badge text are always real text. Values, descriptions, rows, photos, charts and QR codes are always gray blocks. No lorem ipsum, no fake data, no real photos, no shimmer.
5. Element order, column counts and alignment must match the inventories above exactly.
6. Name frames exactly as given (`Vet — Dashboard`, `Owner — Overview`, …) and group them into two Figma pages/sections: **Veterinary (Desktop)** and **Owner (Mobile / iPhone 17)**.
7. Do not add bottom tab bars, side rails, or navigation items that are not listed.
8. Keep the claymorphism look: pastel surfaces, 2px white borders, soft dual shadows, large radii. Gray placeholders sit on top of that styling — they must not flatten the design.

## 5. Suggested build order

Set A: A1 → A2 → A3 → A4 → A5 → A6 → A7 → A8 → A9.
Set B: drawer → B1 → B2 → B3 → B4 → B5 → B6 → B7 → B8 → B9 → B10 → B11.

Optional: duplicate A1 and B1 in a dark palette (`#0D1726` bg, `#152337` surface, `#1B2B40` card, placeholders `#2A3A4E` / `#34465C`) if a dark skeleton is needed.
