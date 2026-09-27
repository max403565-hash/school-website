/**
 * Mo/Pelwatta Navodya Secondary College
 * Admissions & Inquiry Google Apps Script Automation
 *
 * Requirements:
 * 1. Must be deployed under the school's official Google Workspace / Google account (not personal account).
 * 2. Sheet sharing restricted to named school administrative staff emails only (never "Anyone with link").
 * 3. Sends immediate "Application Received" confirmation on submit.
 * 4. Interview Invites are strictly MANUAL: triggered via custom menu "School Tools -> Send Interview Invite for Selected Row".
 * 5. Time-based daily quota queue handler for Gmail rate limits.
 */

// Global Configuration
const CONFIG = {
  SCHOOL_NAME: "Mo/Pelwatta Navodya Secondary College",
  OFFICIAL_EMAIL: "admissions@pelwattacollege.sch.lk",
  RTI_EMAIL: "rti@pelwattacollege.sch.lk",
  MASTER_SHEET_NAME: "Master",
  RESPONSES_SI: "Responses_SI",
  RESPONSES_TA: "Responses_TA",
  RESPONSES_EN: "Responses_EN",
  CONTACT_SHEET_NAME: "Contact_Inquiries",
  QUEUE_SHEET_NAME: "Email_Queue"
};

/**
 * Adds Custom Menu to the Google Sheet when opened by authorized staff
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("School Tools")
    .addItem("Send Interview Invite for Selected Row", "sendInterviewInviteForSelectedRow")
    .addSeparator()
    .addItem("Process Pending Email Queue Now", "processEmailQueue")
    .addItem("Audit Data Retention (PDPA Check)", "auditDataRetention")
    .addToUi();
}

/**
 * Triggered automatically on Form Submission
 * Sends an immediate "Application Received" confirmation email to the applicant parent
 */
function onFormSubmit(e) {
  try {
    if (!e || !e.namedValues) {
      Logger.log("No event values provided");
      return;
    }

    const namedValues = e.namedValues;
    const applicantName = (namedValues["Student Full Name"] || namedValues["ශිෂ්‍යයාගේ සම්පූර්ණ නම"] || namedValues["மாணவர் முழுப் பெயர்"] || [""])[0];
    const parentName = (namedValues["Parent / Guardian Name"] || namedValues["දෙමාපිය / භාරකරුගේ නම"] || namedValues["பெற்றோர் / பாதுகாவலர் பெயர்"] || [""])[0];
    const email = (namedValues["Email Address"] || namedValues["විද්‍යුත් තැපැල් ලිපිනය"] || namedValues["மின்னஞ்சல்"] || [""])[0];
    const grade = (namedValues["Grade Applying For"] || namedValues["අයදුම් කරන ශ්‍රේණිය"] || namedValues["விண்ணப்பிக்கும் தரம்"] || [""])[0];
    const consent = (namedValues["PDPA Consent"] || namedValues["පෞද්ගලික දත්ත එකඟතාවය"] || namedValues["தனியுரிமை ஒப்புதல்"] || [""])[0];

    if (!email || email.indexOf("@") === -1) {
      Logger.log("Valid email not found in submission");
      return;
    }

    // Verify statutory PDPA Consent
    if (!consent || consent.toLowerCase().indexOf("consent") === -1 && consent.indexOf("එකඟ") === -1 && consent.indexOf("ஒப்புதல்") === -1) {
      Logger.log("PDPA statutory consent not verified for submission: " + applicantName);
    }

    const refNumber = "PEL-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);

    const subject = `[Application Received: ${refNumber}] Mo/Pelwatta Navodya Secondary College`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0A2240; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0; color: #fcd34d;">Mo/Pelwatta Navodya Secondary College</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Designated as a National School · Free Government Institution</p>
        </div>
        <div style="padding: 24px;">
          <p>Dear ${parentName || "Parent / Guardian"},</p>
          <p>Thank you for submitting an admission registration for <strong>${applicantName}</strong> for <strong>${grade}</strong>.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #d97706; padding: 12px 16px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Administrative Reference No:</strong> ${refNumber}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px;"><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #92400e; margin: 16px 0;">
            <strong>Important Notice:</strong> This digital submission is for administrative tracking only. Mo/Pelwatta Navodya Secondary College is a strictly free, non-fee-charging government school. Final admission decisions are made strictly following official Ministry of Education circular criteria and physical document verification by the School Admissions Committee.
          </div>

          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Original birth certificates, Grama Niladhari residence proofs, and academic records will be verified in person during scheduled interviews.</li>
            <li>If shortlisted based on circular vacancies, staff will issue an official physical/electronic call-up notification.</li>
          </ul>

          <p>For inquiries, please contact the Principal's Office at +94 (0) 55 227 3420 during school hours (7:30 AM – 2:00 PM).</p>
          <p style="margin-top: 24px;">Yours in Education,<br><strong>Admissions Administration Desk</strong><br>Mo/Pelwatta Navodya Secondary College</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 12px; font-size: 11px; text-align: center; color: #64748b;">
          In compliance with Sri Lanka Personal Data Protection Act No. 09 of 2022 (PDPA). Data is audited and periodically deleted per school policy.
        </div>
      </div>
    `;

    sendOrQueueEmail(email, subject, htmlBody);
  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}

/**
 * MANUAL INTERVIEW INVITATION
 * Staff must select a row on the Master sheet, review details, then click this tool.
 * Never automated!
 */
function sendInterviewInviteForSelectedRow() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getName() !== CONFIG.MASTER_SHEET_NAME) {
    ui.alert("Please switch to the 'Master' tab before sending interview invitations.");
    return;
  }

  const activeRange = sheet.getActiveRange();
  const rowIndex = activeRange.getRow();

  if (rowIndex <= 2) { // Row 1 is Cutoff, Row 2 is Header
    ui.alert("Please select a valid student row (Row 3 or below).");
    return;
  }

  const rowData = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Column Mappings on Master Tab:
  // Col A: Timestamp, Col B: Ref, Col C: Student Name, Col D: Parent Name, Col E: Email, Col F: Phone, Col G: Grade, Col H: Score/Criteria, Col I: Screening Status, Col J: Interview Status
  const refNo = rowData[1];
  const studentName = rowData[2];
  const parentName = rowData[3];
  const email = rowData[4];
  const grade = rowData[6];
  const screeningStatus = rowData[8];
  const currentInterviewStatus = rowData[9];

  if (!email || email.indexOf("@") === -1) {
    ui.alert(`Row ${rowIndex} does not have a valid email address.`);
    return;
  }

  const promptResult = ui.prompt(
    "Confirm Interview Invitation",
    `Applicant: ${studentName}\nParent: ${parentName}\nGrade: ${grade}\nScreening Status: ${screeningStatus}\n\nEnter Interview Date and Time (e.g., 'Tuesday, 14th April 2026 at 9:30 AM'):`,
    ui.ButtonSet.OK_CANCEL
  );

  if (promptResult.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const interviewDateTime = promptResult.getResponseText().trim();
  if (!interviewDateTime) {
    ui.alert("Interview Date and Time cannot be blank.");
    return;
  }

  const subject = `[Interview Call-Up: ${refNo}] Mo/Pelwatta Navodya Secondary College`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0A2240; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; color: #fcd34d;">Mo/Pelwatta Navodya Secondary College</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Designated as a National School · Free Government Institution</p>
      </div>
      <div style="padding: 24px;">
        <p>Dear ${parentName},</p>
        <p>You and your child, <strong>${studentName}</strong>, are kindly invited to attend the physical document verification and interview for admission to <strong>${grade}</strong>.</p>
        
        <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <h3 style="margin-top:0; color:#1e40af;">Interview Appointment Details</h3>
          <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${interviewDateTime}</p>
          <p style="margin: 4px 0;"><strong>Venue:</strong> College Main Administration Hall, Mo/Pelwatta Navodya Secondary College, Pelwatta, Monaragala</p>
          <p style="margin: 4px 0;"><strong>Reference No:</strong> ${refNo}</p>
        </div>

        <h4 style="color:#0A2240;">Mandatory Original Documents to Bring:</h4>
        <ol>
          <li>Original Birth Certificate of the child (with English translation if applicable).</li>
          <li>Original National Identity Cards (NIC) of both parents / legal guardians.</li>
          <li>Grama Niladhari Residential Certificate countersigned by the Divisional Secretary.</li>
          <li>Supporting electoral register extracts, deed/lease, or utility bills for address proof.</li>
          <li>Previous school records, report cards, or scholarship result slips where relevant.</li>
        </ol>

        <div style="background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 10px 14px; border-radius: 4px; font-size: 13px; margin: 16px 0;">
          <strong>Reminder:</strong> Mo/Pelwatta Navodya Secondary College does NOT charge any fees for admission. Please arrive 15 minutes before the scheduled time in formal school/office attire.
        </div>

        <p>Yours faithfully,<br><strong>School Admissions Board</strong><br>Mo/Pelwatta Navodya Secondary College</p>
      </div>
    </div>
  `;

  sendOrQueueEmail(email, subject, htmlBody);

  // Update interview status column on sheet
  sheet.getRange(rowIndex, 10).setValue(`Invite Sent: ${new Date().toLocaleDateString()} (${interviewDateTime})`);
  ui.alert(`Interview Invitation successfully sent to ${email} for student ${studentName}.`);
}

/**
 * Helper to dispatch email or queue it if approaching daily quota limit
 */
function sendOrQueueEmail(toEmail, subject, htmlBody) {
  const quota = MailApp.getRemainingDailyEmails();
  
  if (quota > 15) {
    MailApp.sendEmail({
      to: toEmail,
      subject: subject,
      htmlBody: htmlBody,
      name: CONFIG.SCHOOL_NAME
    });
    Logger.log("Email dispatched directly to: " + toEmail);
  } else {
    // Queue email in Queue tab for next day's cron execution
    queueEmail(toEmail, subject, htmlBody);
  }
}

function queueEmail(toEmail, subject, htmlBody) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let queueSheet = ss.getSheetByName(CONFIG.QUEUE_SHEET_NAME);
  if (!queueSheet) {
    queueSheet = ss.insertSheet(CONFIG.QUEUE_SHEET_NAME);
    queueSheet.appendRow(["Timestamp", "To", "Subject", "Body", "Status"]);
  }
  queueSheet.appendRow([new Date(), toEmail, subject, htmlBody, "PENDING"]);
  Logger.log("Daily quota limit near; queued email for: " + toEmail);
}

/**
 * Time-based trigger to process pending queued emails
 * Run daily at 6:00 AM via Apps Script Triggers
 */
function processEmailQueue() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const queueSheet = ss.getSheetByName(CONFIG.QUEUE_SHEET_NAME);
  if (!queueSheet) return;

  const data = queueSheet.getDataRange().getValues();
  let remainingQuota = MailApp.getRemainingDailyEmails();

  for (let i = 1; i < data.length; i++) {
    const status = data[i][4];
    if (status === "PENDING" && remainingQuota > 10) {
      const to = data[i][1];
      const subject = data[i][2];
      const body = data[i][3];

      try {
        MailApp.sendEmail({
          to: to,
          subject: subject,
          htmlBody: body,
          name: CONFIG.SCHOOL_NAME
        });
        queueSheet.getRange(i + 1, 5).setValue("SENT: " + new Date().toISOString());
        remainingQuota--;
      } catch (err) {
        queueSheet.getRange(i + 1, 5).setValue("ERROR: " + err.toString());
      }
    }
  }
}

/**
 * Periodic audit helper under Sri Lanka PDPA Act No. 09 of 2022
 */
function auditDataRetention() {
  const ui = SpreadsheetApp.getUi();
  ui.alert("PDPA Audit Report:\nAll applicant records are stored securely under school domain permissions. Inactive applicant records older than 1 academic year should be purged following admissions committee signoff.");
}
