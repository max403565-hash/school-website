# Mo/Pelwatta Navodya Secondary College
## Admissions & Contact Google Forms + Sheets + Apps Script System

This free, billing-free architecture handles trilingual admissions registrations and general inquiries for Mo/Pelwatta Navodya Secondary College using standard Google Workspace / Google Apps tools.

---

### 1. Mandatory Institutional Ownership & Security Setup

1. **Official School Account Only**:
   - Must be created under the school's official Google Workspace / Google account (e.g., `admin@pelwattacollege.sch.lk` or `pelwattanavodya@gmail.com`).
   - Never build this under an individual teacher's personal Google account.

2. **Access & Sharing Controls**:
   - Open the Google Sheet's **Share** settings.
   - Set General Access to **"Restricted"**.
   - Explicitly add ONLY the named school administrative staff emails (Principal, Deputy Principal, Admission Secretary) with *Editor* permissions.
   - **NEVER** set sharing to *"Anyone with the link"*.

---

### 2. Google Forms Structure (Admissions)

Build three identical forms in Google Forms for each language:
- **Form 1: Sinhala (සිංහල)** — `1 ශ්‍රේණිය සහ අතරමැදි ඇතුළත් කිරීම් ලියාපදිංචි කිරීම`
- **Form 2: Tamil (தமிழ்)** — `தரம் 1 மற்றும் இடைநிலை சேர்க்கை விண்ணப்பப் பதிவு`
- **Form 3: English** — `Grade 1 & Intermediate Admission Registration Portal`

#### Required Form Fields:
1. Student Full Name *(Text)*
2. Date of Birth *(Date)*
3. Gender *(Multiple Choice: Male / Female)*
4. Grade Applying For *(Dropdown: Grade 1, Grade 6, Grade 10 O/L, Grade 12 A/L)*
5. Academic Stream if A/L *(Dropdown: Biological Science, Physical Science, Commerce, Arts, Technology)*
6. Parent / Guardian Name *(Text)*
7. Parent National Identity Card (NIC) Number *(Text)*
8. Contact Telephone Number *(Text/Number)*
9. Email Address *(Text, Email Validation)*
10. Permanent Residential Address & Grama Niladhari Division *(Text)*
11. Entrance Marks / Scholarship Score / O/L Results Summary *(Text/Number)*
12. **MANDATORY STATUTORY CONSENT CHECKBOX (Required)**:
    - *English*: `"I consent to this school storing and processing my child's information for admission purposes, in line with Sri Lanka's Personal Data Protection Act."`
    - *Sinhala*: `"2022 අංක 09 දරන ශ්‍රී ලංකා පෞද්ගලික දත්ත ආරක්ෂණ පනතට (PDPA) අනුකූලව ඇතුළත් කිරීමේ පරිපාලන කටයුතු උදෙසා මාගේ දරුවාගේ තොරතුරු රඳවා ගැනීමට හා සැකසීමට මම මෙයින් කැමැත්ත ප්‍රකාශ කරමි."`
    - *Tamil*: `"2022 ஆம் ஆண்டின் 09 ஆம் இலக்க இலங்கை தனிப்பட்ட தரவுப் பாதுகாப்புச் சட்டத்திற்கு அமைவாக, சேர்க்கை நிர்வாக நோக்கங்களுக்காக எனது பிள்ளையின் தகவல்களை சேமிக்கவும் கையாளவும் ஒப்புதல் அளிக்கின்றேன்."`

---

### 3. Google Sheet Architecture (4 Tabs)

Link the three forms to the **SAME** Google Sheet as three separate tabs:
1. `Responses_SI` (Form responses from Sinhala form)
2. `Responses_TA` (Form responses from Tamil form)
3. `Responses_EN` (Form responses from English form)

#### 4. The "Master" Tab:
Create a fourth tab named **`Master`**.

- **Row 1 (Cutoff Control Cell)**:
  - Cell `A1`: `Administrative Screening Cutoff Score:`
  - Cell `B1`: `150` (or cutoff score determined by staff)
  - Cell `C1`: `*Note: Administrative sorting aid only, not an automated admission decision.`

- **Row 2 (Column Headers)**:
  - `A2`: Timestamp
  - `B2`: Reference No
  - `C2`: Student Full Name
  - `D2`: Parent Name
  - `E2`: Email Address
  - `F2`: Telephone
  - `G2`: Grade
  - `H2`: Stream / Criteria
  - `I2`: Marks / Score
  - `J2`: Screening Status (Formula)
  - `K2`: Interview Status (Manual)

- **Formula in Master Tab (Cell A3)** to combine all three language tabs:
```excel
={QUERY(Responses_SI!A2:K, "WHERE Col1 IS NOT NULL", 0);
  QUERY(Responses_TA!A2:K, "WHERE Col1 IS NOT NULL", 0);
  QUERY(Responses_EN!A2:K, "WHERE Col1 IS NOT NULL", 0)}
```

- **Administrative Screening Formula** (in Column J, starting at J3):
```excel
=ARRAYFORMULA(IF(ISBLANK(A3:A), "", IF(I3:I >= $B$1, "Qualified (Admin Screening)", "Under Review")))
```
*Notice: Label this clearly as an administrative sorting aid, not an automatic decision.*

---

### 4. Google Apps Script Setup

1. In the Google Sheet, navigate to **Extensions > Apps Script**.
2. Replace default code with `/google-apps-script/Code.gs`.
3. Save the project as `Pelwatta_Admissions_System`.

#### Setting up Triggers:
1. Click the **Triggers (clock icon)** in the left sidebar of Apps Script.
2. Click **Add Trigger**:
   - Function to run: `onFormSubmit`
   - Event source: `From spreadsheet`
   - Event type: `On form submit`
   - Failure notification: `Notify me immediately`
   - Click **Save** and authorize permissions under the school account.
3. Add a second trigger for the email queue:
   - Function to run: `processEmailQueue`
   - Event source: `Time-driven`
   - Type of time based trigger: `Day timer`
   - Time of day: `6am to 7am`
   - Click **Save**.

---

### 5. Staff Usage Workflow

1. **Immediate Acknowledgment**: When a parent submits the web form, they immediately receive an automated confirmation email with a unique tracking reference number.
2. **Reviewing Applications**: School staff open the Google Sheet and inspect the unified `Master` tab.
3. **Manual Interview Invitation**:
   - Staff member clicks on the row of a qualified candidate.
   - Staff clicks the custom top menu: **`School Tools > Send Interview Invite for Selected Row`**.
   - A dialog prompts the staff member to enter the specific interview date, time, and room.
   - The script sends a formal call-up notice to the parent and records the interview status in Column K with timestamp.
   - **Zero automatic interviews** — all invitations require human staff oversight.
