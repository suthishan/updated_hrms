const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  name: 'intranet.japfa.com',   // 🔑 VERY IMPORTANT
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false   // only if internal SMTP
  }
});

exports.sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `<${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
  console.log(`Email sent to ${to} with subject "${subject}"`);
};
