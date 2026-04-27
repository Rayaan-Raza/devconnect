// Email utility - using console.log for now (no paid service)
// Replace these with nodemailer + real SMTP later

exports.sendVerificationEmail = (email, name, token) => {
  console.log(`\n📧 [EMAIL] Verification Email`);
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your DevConnect account`);
  console.log(`Body: Hello ${name}, verify your account at: http://localhost:5173/verify/${token}`);
  console.log('---');
};

exports.sendPasswordResetEmail = (email, name, token) => {
  console.log(`\n📧 [EMAIL] Password Reset Email`);
  console.log(`To: ${email}`);
  console.log(`Subject: Reset your DevConnect password`);
  console.log(`Body: Hello ${name}, reset your password at: http://localhost:5173/reset-password/${token}`);
  console.log(`This link expires in 1 hour.`);
  console.log('---');
};

exports.sendWelcomeEmail = (email, name, role) => {
  console.log(`\n📧 [EMAIL] Welcome Email`);
  console.log(`To: ${email}`);
  console.log(`Subject: Welcome to DevConnect!`);
  console.log(`Body: Hello ${name}, welcome to DevConnect as a ${role}!`);
  console.log('---');
};

exports.sendCompanyVerifiedEmail = (email, companyName) => {
  console.log(`\n📧 [EMAIL] Company Verified`);
  console.log(`To: ${email}`);
  console.log(`Subject: Your company has been verified on DevConnect`);
  console.log(`Body: ${companyName} is now verified on DevConnect. You can now post jobs and connect with students.`);
  console.log('---');
};

exports.sendProjectApprovedEmail = (email, name, projectTitle) => {
  console.log(`\n📧 [EMAIL] Project Approved`);
  console.log(`To: ${email}`);
  console.log(`Subject: Your project "${projectTitle}" has been approved!`);
  console.log(`Body: Hello ${name}, your FYP project is now live on DevConnect!`);
  console.log('---');
};

exports.sendProjectRejectedEmail = (email, name, projectTitle, reason) => {
  console.log(`\n📧 [EMAIL] Project Rejected`);
  console.log(`To: ${email}`);
  console.log(`Subject: Project Review Update - "${projectTitle}"`);
  console.log(`Body: Hello ${name}, your project was rejected. Reason: ${reason}`);
  console.log('---');
};

exports.sendMessageNotification = (email, name, senderName) => {
  console.log(`\n📧 [EMAIL] New Message`);
  console.log(`To: ${email}`);
  console.log(`Subject: New message from ${senderName}`);
  console.log(`Body: Hello ${name}, you have a new message from ${senderName} on DevConnect.`);
  console.log('---');
};
