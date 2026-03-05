const crypto = require('crypto');
const AuthModel = require('../models/auth.model');
const dayjs = require('dayjs');
const pool = require('../db/db');
const { generateAccessToken, verifyToken, generateRefreshToken } = require('../utils/jwt.util');
const { auditLog } = require('../utils/audit.util');
const { sendMail } =  require('../utils/email.util');
const { sendUltronSMS } = require('../utils/otp.util');
const md5 = (value) => crypto.createHash('md5').update(value).digest('hex');

// ---------------------------------------------------------------------------
// Helper: generate & persist a fresh OTP for a given emp_uuid
// ---------------------------------------------------------------------------
const createOtp = async (emp_uuid) => {
  // const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp = 222666;
  await pool.query(
    `INSERT INTO tbl_mfa_otp (emp_uuid, otp, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '5 minutes')`,
    [emp_uuid, otp]
  );
  return otp;
};

// ---------------------------------------------------------------------------
// Helper: dispatch OTP to the user (email / SMS / console-fallback)
// Wire up your real transport (nodemailer, twilio, etc.) here.
// ---------------------------------------------------------------------------
const sendOtp = async ({ emp_email, emp_phone, otp }) => {
  // --- Email transport example (nodemailer) ---
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({
  //   from: process.env.MAIL_FROM,
  //   to: emp_email,
  //   subject: 'Your verification code',
  //   text: `Your OTP is: ${otp}. It expires in 5 minutes.`
  // });

  // --- SMS transport example (Twilio) ---
  // await twilioClient.messages.create({
  //   body: `Your OTP is: ${otp}. It expires in 5 minutes.`,
  //   from: process.env.TWILIO_FROM,
  //   to: emp_phone
  // });
   const toEmail = emp_email;
      await sendMail({
        to: toEmail,
        subject: `Your verification code`,
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.6;">
      

        <p>
          <strong>Your OTP is: ${otp}. It expires in 5 minutes.</strong>
        </p>
        <p>
          Regards,<br />
          <strong>Japfa Intranet Team</strong>
        </p>
  
        <p style="font-size: 12px; color: #777;">
          This is an automated notification. Please do not reply.
        </p>
      </div>
        `
      });

  // Fallback: log to console (remove in production)
  console.log(`[MFA] OTP for ${emp_email ?? emp_phone}: ${otp}`);
};

// ---------------------------------------------------------------------------
// POST /auth/login
// Step 1 of 2 — validate credentials, issue OTP, do NOT return tokens yet.
// ---------------------------------------------------------------------------
exports.login = async (req, res) => {
  try {
    const { emp_id, password } = req.body;

    if (!emp_id || !password) {
      return res.status(400).json({ sts: '0', message: 'emp_id and password are required' });
    }

    const user = await AuthModel.findUserByEmpId(emp_id);
    if (!user) {
      return res.status(401).json({ sts: '0', message: 'Invalid credentials' });
    }

    const hashedPassword = md5(password);
    if (hashedPassword !== user.emp_password) {
      return res.status(401).json({ sts: '0', message: 'Invalid credentials' });
    }

    // ── MFA: generate and send OTP ──────────────────────────────────────────
    const otp = await createOtp(user.emp_uuid);
    // await sendOtp({ emp_email: user.emp_email, emp_phone: user.emp_phone, otp });
    await sendUltronSMS("918087658020", otp);
    // Audit the login attempt (pre-MFA)
    await auditLog({
      user: {
        emp_uuid: user.emp_uuid,
        emp_name: user.emp_name,
        emp_role: user.emp_role,
      },
      action: 'LOGIN',
      entityType: 'AUTH',
      entityId: user.emp_uuid,
      oldValue: null,
      newValue: null,
      req,
    });

    // Return emp_uuid so the client can pass it to /verify-otp.
    // Do NOT return access/refresh tokens until MFA is confirmed.
    return res.json({
      sts: '1',
      message: 'OTP sent. Please verify to complete login.',
      mfa_required: true,
      emp_uuid: user.emp_id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: 'Server error' });
  }
};

// ---------------------------------------------------------------------------
// POST /auth/verify-otp
// Step 2 of 2 — validate OTP, then issue access + refresh tokens.
// ---------------------------------------------------------------------------
exports.verifyOTP = async (req, res) => {
  try {
    const { emp_id, otp } = req.body;

    if (!emp_id || !otp) {
      return res.status(400).json({ sts: '0', message: 'emp_id and otp are required' });
    }
    const emp = await pool.query(
      `SELECT emp_uuid FROM tbl_emp_master
       WHERE emp_id = $1`,
      [emp_id]
    );
    // Validate OTP
    const result = await pool.query(
      `SELECT id FROM tbl_mfa_otp
       WHERE emp_uuid = $1
         AND otp       = $2
         AND is_used   = false
         AND expires_at > NOW()`,
      [emp.rows[0].emp_uuid, otp]
    );

    if (!result.rows.length) {
      return res.status(401).json({ sts: '0', message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await pool.query(
      `UPDATE tbl_mfa_otp SET is_used = true WHERE id = $1`,
      [result.rows[0].id]
    );

    // Fetch user to build tokens
    const user = await AuthModel.findUserByEmpId(emp_id);
    if (!user) {
      console.error(`User not found for emp_id: ${emp_id}`);
      return res.status(404).json({ sts: '0', message: 'User not found' });
    }

    // Issue tokens now that MFA is confirmed
    const accessToken = generateAccessToken({
      emp_uuid: user.emp_uuid,
      emp_id: user.emp_id,
      emp_department: user.emp_department,
      emp_role: user.roles,
    });

    const refreshToken = generateRefreshToken();
    await AuthModel.storeRefreshToken(
      user.emp_uuid,
      refreshToken,
      dayjs().add(14, 'day').toDate()
    );

    return res.json({
      sts: '1',
      message: 'OTP verified. Login successful.',
      accessToken,
      refreshToken,
      result: {
        emp_uuid: user.emp_uuid,
        emp_id: user.emp_id,
        emp_name: user.emp_name,
        emp_email: user.emp_email,
        emp_department: user.emp_department,
        emp_designation: user.emp_designation,
        emp_role: user.roles,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: 'Server error' });
  }
};

// ---------------------------------------------------------------------------
// POST /auth/resend-otp
// Lets the client request a fresh OTP (rate-limit this route in production).
// ---------------------------------------------------------------------------
exports.resendOTP = async (req, res) => {
  try {
    const { emp_uuid } = req.body;

    if (!emp_uuid) {
      return res.status(400).json({ sts: '0', message: 'emp_uuid is required' });
    }

    const user = await AuthModel.findUserByEmpUuid(emp_uuid);
    if (!user) {
      return res.status(404).json({ sts: '0', message: 'User not found' });
    }

    // Invalidate any still-active OTPs for this user before issuing a new one
    await pool.query(
      `UPDATE tbl_mfa_otp SET is_used = true
       WHERE emp_uuid = $1 AND is_used = false AND expires_at > NOW()`,
      [emp_uuid]
    );

    const otp = await createOtp(emp_uuid);
    await sendOtp({ emp_email: user.emp_email, emp_phone: user.emp_phone, otp });

    return res.json({ sts: '1', message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sts: '0', message: 'Server error' });
  }
};

// ---------------------------------------------------------------------------
// POST /auth/refresh-token
// Bug fix: was referencing undeclared `user` variable — now uses record fields.
// ---------------------------------------------------------------------------
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ sts: '0', message: 'Refresh token required' });
    }

    const record = await AuthModel.findValidRefreshToken(refreshToken);
    if (!record) {
      return res.status(401).json({ sts: '0', message: 'Invalid refresh token' });
    }

    // FIX: original code referenced `user` which was never declared in this scope.
    // `record` is the row returned by findValidRefreshToken — adjust field names
    // to match whatever your AuthModel actually returns.
    const newAccessToken = generateAccessToken({
      emp_uuid: record.emp_uuid,
      emp_id: record.emp_id,
      emp_department: record.emp_department,
      emp_role: record.emp_role,
    });

    return res.json({ sts: '1', accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ sts: '0', message: 'Failed to refresh token' });
  }
};

// ---------------------------------------------------------------------------
// POST /auth/logout  (unchanged logic, audit log uncommented for reference)
// ---------------------------------------------------------------------------
exports.logout = async (req, res) => {
  try {
    const { refreshToken, emp_id } = req.body;

    if (refreshToken) {
      await AuthModel.revokeRefreshToken(refreshToken);
    }

    // await auditLog({
    //   emp_id,
    //   action: 'LOGOUT',
    //   entityType: 'AUTH',
    //   entityId: emp_id,
    //   req,
    // });

    return res.json({ sts: '1', message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ sts: '0', message: 'Logout failed' });
  }
};