import express from "express";
import mysql from "mysql2";
import cors from "cors";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import util from "util";

const app = express();
const PORT = 5000;
const JWT_SECRET = "a98f4f22aaaa2bef68cda9c4a54c4857525f4a5e831ef95f61d19830e0ea4281491f2cf0097d484eea5b5552a13e3b78226f59f81bd0687e6f3e94bd02371944";

// ==============================
// Middleware
// ==============================
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ==============================
// MySQL connection
// ==============================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Prasitha@15",
  database: "hostel_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database (hostel_db)");
});

const query = util.promisify(db.query).bind(db);
// ==============================
// Nodemailer transporter
// ==============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nechostel.noreply@gmail.com",
    pass: "lupm wlya gltm muqu",
  },
});

// ==============================
// ROOT TEST ROUTE
// ==============================


app.get("/", (req, res) => {
  res.send("🚀 Hostel Management Backend is running!");
});

// ⏱ Automatic attendance check (only inserts once per day between 4:30–5:30 PM)
// AUTO ATTENDANCE ENABLE CHECKER (8:30–9:30 PM)
// AUTO ATTENDANCE ENABLE CHECKER (8:30–9:30 PM)
/*
const checkAttendanceTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const start = 20 * 60 + 30; // 8:30 PM
  const end = 21 * 60 + 30;   // 9:30 PM
  const enable = totalMinutes >= start && totalMinutes <= end ? "Yes" : "No";
  const today = new Date().toISOString().split("T")[0];

  console.log(`🕒 Current time: ${hours}:${minutes < 10 ? "0" + minutes : minutes}`);
  console.log(`📊 enable = ${enable}, totalMinutes=${totalMinutes}, start=${start}, end=${end}`);

  const sqlCheck = "SELECT * FROM attendance_enable WHERE date = ? LIMIT 1";
  db.query(sqlCheck, [today], (err, results) => {
    if (err) return console.error("❌ DB error:", err);

    if (results.length === 0) {
      // If no record exists, insert one
      const insertSql = "INSERT INTO attendance_enable (date, enabled) VALUES (?, ?)";
      db.query(insertSql, [today, enable], (err2) => {
        if (err2) return console.error("❌ DB insert error:", err2);
        console.log(`✅ Inserted new record for ${today} with enabled='${enable}'.`);
      });
    } else {
      // If record exists, update it based on time
      const updateSql = "UPDATE attendance_enable SET enabled = ? WHERE date = ?";
      db.query(updateSql, [enable, today], (err3) => {
        if (err3) return console.error("❌ DB update error:", err3);
        console.log(`🔄 Updated record for ${today} to enabled='${enable}'.`);
      });
    }
  });
};

// Check every minute
setInterval(checkAttendanceTime, 60 * 1000);
*/

/*

// 🧑‍💼 Warden manually enables/disables attendance
app.post("/api/enable-attendance", (req, res) => {
  const { enabled } = req.body; // expects "Yes" or "No"
  const today = new Date().toISOString().split("T")[0];

  const sqlCheck = "SELECT * FROM attendance_enable WHERE date = ? LIMIT 1";
  db.query(sqlCheck, [today], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.json({ success: false });
    }

    // If warden enables and no record exists, insert it
    if (enabled === "Yes" && results.length === 0) {
      const insertSql = "INSERT INTO attendance_enable (date, enabled) VALUES (?, ?)";
      db.query(insertSql, [today, "Yes"], (err2) => {
        if (err2) {
          console.error("DB error:", err2);
          return res.json({ success: false });
        }
        console.log(`✅ Warden manually enabled attendance for ${today}.`);
        res.json({ success: true });
      });
    } 
    // If warden disables, just ignore for now (no insert)
    else {
      console.log(`ℹ️ Warden requested disable on ${today}, no DB insert.`);
      res.json({ success: true });
    }
  });
});
*/



// ==============================
// STUDENT ROUTES
// ==============================
const studentOtpStore = {};

function generateStudentOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Student registration OTP
app.post("/student/request-otp", (req, res) => {
  const { email } = req.body;

  if (!email.endsWith("@nec.edu.in")) {
    return res.status(400).json({ error: "Only nec.edu.in emails allowed" });
  }

  const otp = generateStudentOTP();
  studentOtpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    data: req.body,
  };

  const mailOptions = {
    from: "nechostel.noreply@gmail.com",
    to: email,
    subject: "Student Registration OTP",
    text: `Hello,\n\nYour OTP for student registration is: ${otp}\n\nThis OTP will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("❌ Error sending OTP:", error);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
    console.log("✅ OTP sent to:", email, "OTP:", otp);
    res.json({ message: "OTP sent to your email. Please verify." });
  });
});

// ✅ Password strength validator (server-side)
function isStrongPassword(password) {
  // At least 8 chars, one uppercase, one lowercase, one number, one special char
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return strongPasswordRegex.test(password);
}


// Student verify OTP
app.post("/student/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = studentOtpStore[email];

  if (!record) {
    return res.status(400).json({ error: "No OTP request found for this email" });
  }

  if (Date.now() > record.expiresAt) {
    delete studentOtpStore[email];
    return res.status(400).json({ error: "OTP expired, please register again" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  db.query("SELECT * FROM students WHERE email = ?", [email], async (errCheck, rows) => {
    if (errCheck) {
      console.error("❌ SQL Error:", errCheck);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const {
      fullName,
      rollNumber,
      department,
      yearOfAdmission,
      address,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      fatherNumber,
      motherNumber,
      personalNumber,
      alternativeNumber,
      password,
      roomNumber,
      blockNumber,
    } = record.data;

    try {
      if (!password) {
        return res.status(400).json({ error: "Password missing in OTP record" });
      }

// ✅ Enforce strong password rules
if (!isStrongPassword(password)) {
  return res.status(400).json({
    error:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
  });
}


      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO students
        (fullName, rollNumber, department, yearOfAdmission, address,
         fatherName, motherName, fatherOccupation, motherOccupation,
         fatherNumber, motherNumber, personalNumber, alternativeNumber,
         email, password, otp, isVerified, registrationDate,
         roomNumber, blockNumber, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), ?, ?, NOW())
      `;

      db.query(
        sql,
        [
          fullName,
          rollNumber,
          department,
          yearOfAdmission,
          address,
          fatherName,
          motherName,
          fatherOccupation,
          motherOccupation,
          fatherNumber,
          motherNumber,
          personalNumber,
          alternativeNumber,
          email,
          hashedPassword,
          record.otp,
          roomNumber,
          blockNumber,
        ],
        (err, result) => {
          if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({
              error: "Database error",
              details: err.sqlMessage,
            });
          }

          db.query("SELECT * FROM students WHERE id = ?", [result.insertId], (err2, rows) => {
            if (err2) {
              console.error("❌ Fetch after insert failed:", err2);
              return res.status(500).json({ error: "Fetch after registration failed" });
            }

            delete studentOtpStore[email];
            res.json(rows[0]);
          });
        }
      );
    } catch (err) {
      console.error("❌ Error hashing password:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
});

// Student login
app.post("/student/login", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  const sql = "SELECT * FROM students WHERE email = ? LIMIT 1";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Error during login:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const student = results[0];

    try {
      const match = await bcrypt.compare(password, student.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.json(student);
    } catch (compareErr) {
      console.error("❌ Bcrypt error:", compareErr);
      res.status(500).json({ error: "Server error" });
    }
  });
});

// Student profile
app.get("/student/profile/:id", (req, res) => {
  const studentId = req.params.id;
  const sql = "SELECT * FROM students WHERE id = ?";

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error("❌ Profile fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch student profile" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(results[0]);
  });
});


//CALENDAR FOR STUDENT PAGE
/*
app.get("/api/attendance-status-by-date", (req, res) => {
  const { studentId, date } = req.query;

  if (!studentId || !date) {
    return res.status(400).json({ message: "Missing parameters" });
  }

const sql = "SELECT status, DATE(marked_at) AS marked_date FROM attendance_records WHERE student_id = ?";
  db.execute(sql, [studentId, date], (err, rows) => {
    if (err) {
      console.error("❌ SQL ERROR:", err);
      return res.status(500).json({ message: "Server error", sqlError: err.sqlMessage || err.message });
    }

    if (rows.length > 0) {
      res.json({ status: rows[0].status });
    } else {
      res.status(404).json({ message: "No attendance record for that date." });
    }
  });
});*/




// ==============================
// MARK ATTENDANCE ROUTES (UPDATED)
// ==============================

// ✅ Enable attendance marking (warden)


// ✅ Check if attendance marking is enabled
// Check if attendance marking is enabled
app.get("/api/attendance-status", (req, res) => {
  const sql = `
    SELECT enabled FROM attendance_enable
    WHERE date = CURDATE()
    LIMIT 1
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching attendance status:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      // If no record exists for today, default to 'No'
      return res.json({ attendanceEnabled: false });
    } else {
      // Return true if 'Yes', false if 'No'
      const enabled = results[0].enabled === "Yes";
      return res.json({ attendanceEnabled: enabled });
    }
  });
});

// Enable/Disable attendance
// Enable/Disable attendance + generate daily QR
app.post("/api/enable-attendance", (req, res) => {
  const { enabled } = req.body; // 'Yes' or 'No'
  const today = new Date().toISOString().split("T")[0];

  const sqlCheck = "SELECT * FROM attendance_enable WHERE date = ? LIMIT 1";
  db.query(sqlCheck, [today], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });

    const query = results.length === 0
      ? "INSERT INTO attendance_enable (date, enabled) VALUES (?, ?)"
      : "UPDATE attendance_enable SET enabled = ? WHERE date = ?";

    const params = results.length === 0 ? [today, enabled] : [enabled, today];
    db.query(query, params, (err2) => {
      if (err2) return res.status(500).json({ error: "DB error" });
if (enabled === "Yes") {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  const qrValue = `QR_${today}_${Math.floor(Math.random() * 100000)}`;
  const validUntil = new Date();
  validUntil.setHours(23, 59, 59, 999);
  const validUntilStr = validUntil.toISOString().slice(0, 19).replace("T", " ");

  const insertQr = `
    INSERT INTO attendance_qr (date, qr_value, valid_until)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE qr_value=?, valid_until=?
  `;

  db.query(insertQr, [today, qrValue, validUntilStr, qrValue, validUntilStr], (err3) => {
    if (err3) console.error("❌ QR generation error:", err3);
    else console.log("✅ QR generated for today:", qrValue);
  });
}


      res.json({ success: true });
    });
  });
});

// --- Get today's QR ---
app.get("/api/get-active-qr/:personId", (req, res) => {
  const personId = req.params.personId;
  const now = new Date();

  // 1️⃣ Check if student is on leave today
  const leaveSql = "SELECT status FROM attendance_records WHERE student_id = ? AND DATE(date) = CURDATE()";
  db.query(leaveSql, [personId], (err, leaveRows) => {
    if (err) return res.status(500).json({ success: false, message: "Internal server error" });

    if (leaveRows.length > 0) {
      const status = leaveRows[0].status.toLowerCase();
      if (status === "leave") {
        return res.json({ active: false, message: "You are on leave today" });
      }
      if (status === "present") {
        return res.json({ active: false, message: "Attendance already marked" });
      }
    }

    // 2️⃣ Fetch today's QR
    const qrSql = "SELECT qr_value FROM attendance_qr WHERE DATE(date) = CURDATE() ORDER BY id DESC LIMIT 1";
    db.query(qrSql, (err, qrRows) => {
      if (err) return res.status(500).json({ success: false, message: "Internal server error" });
      if (!qrRows || qrRows.length === 0) return res.json({ active: false, message: "No QR generated today" });

      // 3️⃣ Check QR expiry (end of day)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(todayStart.getDate() + 1);

      if (now >= tomorrowStart) return res.json({ active: false, message: "QR expired" });

      // 4️⃣ Return QR
      return res.json({ active: true, qrValue: qrRows[0].qr_value });
    });
  });
});




// ✅ Mark attendance (student) - UPDATED with today's check
app.post("/api/mark-attendance", (req, res) => {
  const { studentId, qrValue } = req.body;
  if (!studentId || !qrValue) return res.status(400).json({ message: "Missing studentId or QR" });

  const today = new Date().toISOString().split("T")[0];

  // Check if attendance enabled
  db.query("SELECT enabled FROM attendance_enable WHERE date=? LIMIT 1", [today], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!results.length || results[0].enabled !== "Yes") return res.status(400).json({ message: "Attendance not enabled" });

    // Validate QR
    db.query("SELECT qr_value, valid_until FROM attendance_qr WHERE date=? LIMIT 1", [today], (err2, qrResults) => {
      if (err2) return res.status(500).json({ message: "DB error" });
      if (!qrResults.length || qrResults[0].qr_value !== qrValue) return res.status(400).json({ message: "Invalid QR" });

      if (new Date() > new Date(qrResults[0].valid_until)) {
        return res.status(400).json({ message: "QR expired" });
      }

      // Check if already marked
      db.query("SELECT * FROM attendance_records WHERE student_id=? AND date=?", [studentId, today], (err3, check) => {
        if (err3) return res.status(500).json({ message: "DB error" });
        if (check.length) return res.status(400).json({ message: "Attendance already marked" });

        // Insert attendance
        const insertSql = `
          INSERT INTO attendance_records (student_id, date, status, qr_scanned)
          VALUES (?, ?, 'Present', ?)
        `;
        db.query(insertSql, [studentId, today, qrValue], (err4) => {
          if (err4) return res.status(500).json({ message: "DB error" });
          res.json({ message: "Attendance marked successfully!" });
        });
      });
    });
  });
});
app.get("/api/mark-attendance", (req, res) => {
  const { id, qrValue } = req.query;
  const studentId = id;
  if (!studentId) return res.status(400).send("Missing student ID");

  const today = new Date().toISOString().split("T")[0];

  db.query("SELECT enabled FROM attendance_enable WHERE date=? LIMIT 1", [today], (err, results) => {
    if (err) return res.status(500).send("DB error");
    if (!results.length || results[0].enabled !== "Yes") return res.status(400).send("Attendance not enabled");

    db.query("SELECT qr_value, valid_until FROM attendance_qr WHERE date=? LIMIT 1", [today], (err2, qrResults) => {
      if (err2) return res.status(500).send("DB error");
      if (!qrResults.length) return res.status(400).send("QR not generated for today");

      const validUntil = new Date(qrResults[0].valid_until);
      validUntil.setHours(23, 59, 59, 999); // ensure QR valid until end of day

      if (new Date() > validUntil) return res.status(400).send("QR expired");

      db.query("SELECT * FROM attendance_records WHERE student_id=? AND date=?", [studentId, today], (err3, check) => {
        if (err3) return res.status(500).send("DB error");
        if (check.length) return res.status(400).send("Attendance already marked");

        db.query(
          "INSERT INTO attendance_records (student_id, date, status, qr_scanned) VALUES (?, ?, 'Present', ?)",
          [studentId, today, qrResults[0].qr_value],
          (err4) => {
            if (err4) return res.status(500).send("DB error");
            res.send("✅ Attendance marked successfully!");
          }
        );
      });
    });
  });
});



// ✅ Get all attendance records for a student
// Get all attendance for a student
app.get("/api/attendance/:studentId", (req, res) => {
  const { studentId } = req.params;
  const sql = `
    SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, status, qr_scanned, marked_at
    FROM attendance_records
    WHERE student_id=?
    ORDER BY date DESC
  `;
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
});


// ✅ Get student's today attendance status
app.get("/api/today-attendance/:studentId", (req, res) => {
  const { studentId } = req.params;
  const today = new Date().toISOString().split('T')[0];

  const sql = "SELECT status FROM attendance_records WHERE student_id = ? AND date = ? LIMIT 1";
  
  db.query(sql, [studentId, today], (err, results) => {
    if (err) {
      console.error("❌ Error fetching today's attendance:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      res.json({ status: "Not Marked" });
    } else {
      res.json({ status: results[0].status });
    }
  });
});

// ✅ Get student's attendance stats
app.get("/api/attendance-stats/:studentId", (req, res) => {
  const { studentId } = req.params;

  const statsSql = `
    SELECT 
      COUNT(*) as totalDays,
      SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as presentDays,
      (SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as attendanceRate
    FROM attendance_records
    WHERE student_id = ?
  `;

  db.query(statsSql, [studentId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching attendance stats:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const stats = results[0];
    res.json({
      totalDays: stats.totalDays || 0,
      presentDays: stats.presentDays || 0,
      attendanceRate: stats.attendanceRate || 0
    });
  });
});

// ==============================
// STUDENTS LIST FOR WARDEN
// ==============================
app.get("/api/students", (req, res) => {
  const { search = "", category = "" } = req.query;

  let sql = `
    SELECT 
        s.id,
        s.fullName,
        s.rollNumber,
        s.department,
        s.roomNumber,
        s.blockNumber,
        COALESCE(a.status, 'Absent') AS attendance
    FROM students s
    LEFT JOIN attendance_records a ON s.id = a.student_id AND a.date = CURDATE()
    WHERE 1=1
  `;

  const values = [];

  if (search && category) {
    const likeSearch = `%${search.toLowerCase()}%`;
    switch (category) {
      case "name":
        sql += " AND LOWER(s.fullName) LIKE ?";
        values.push(likeSearch);
        break;
      case "rollNumber":
        sql += " AND LOWER(s.rollNumber) LIKE ?";
        values.push(likeSearch);
        break;
      case "department":
        sql += " AND LOWER(s.department) LIKE ?";
        values.push(likeSearch);
        break;
      case "roomNumber":
        sql += " AND LOWER(s.roomNumber) LIKE ?";
        values.push(likeSearch);
        break;
      case "blockNumber":
        sql += " AND LOWER(s.blockNumber) LIKE ?";
        values.push(likeSearch);
        break;
      default:
        sql += ` AND (
          LOWER(s.fullName) LIKE ? OR
          LOWER(s.rollNumber) LIKE ? OR
          LOWER(s.department) LIKE ? OR
          LOWER(s.roomNumber) LIKE ? OR
          LOWER(s.blockNumber) LIKE ?
        )`;
        values.push(likeSearch, likeSearch, likeSearch, likeSearch, likeSearch);
    }
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("❌ Error fetching students:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ==============================
// WARDEN ROUTES (Keep existing)
// ==============================
const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Warden registration
app.post("/warden/register", async (req, res) => {
  const {
    name, age, gender, dob,
    email, phone, address, aadhaar,
    username, password, confirmPassword
  } = req.body;

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const checkSql = "SELECT * FROM wardens WHERE email = ? OR username = ? LIMIT 1";
  db.query(checkSql, [email, username], (checkErr, results) => {
    if (checkErr) {
      console.error("❌ SQL Check Error:", checkErr);
      return res.status(500).json({ error: "Database error", details: checkErr.sqlMessage });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "Email or Username already exists" });
    }

    const otp = generateOTP();
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      data: {
        name, age, gender, dob,
        email, phone, address, aadhaar,
        username, password,
      },
    };

    transporter.sendMail(
      {
        from: "nechostel.noreply@gmail.com",
        to: email,
        subject: "Warden Registration OTP",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      },
      (mailErr, info) => {
        if (mailErr) {
          console.error("❌ Error sending OTP:", mailErr);
          return res.status(500).json({ error: "Failed to send OTP" });
        }
        console.log("📩 OTP sent:", otp);
        res.json({ message: "✅ OTP sent successfully" });
      }
    );
  });
});

// Warden verify OTP
app.post("/warden/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ error: "No OTP request found" });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP expired, please register again" });
  }
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  const {
    name, age, gender, dob,
    phone, address, aadhaar,
    username, password,
  } = record.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkSql = "SELECT * FROM wardens WHERE email = ? OR username = ? OR aadhaar = ? LIMIT 1";
    db.query(checkSql, [email, username, aadhaar], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        const existing = results[0];
        if (existing.email === email) return res.status(400).json({ error: "Email already exists" });
        if (existing.username === username) return res.status(400).json({ error: "Username already exists" });
        if (existing.aadhaar === aadhaar) return res.status(400).json({ error: "Aadhaar already exists" });
      }

      const insertSql = `
        INSERT INTO wardens
        (name, age, gender, dob, email, phone, address, aadhaar,
         username, password, isVerified, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
      `;

      db.query(
        insertSql,
        [name, age, gender, dob, email, phone, address, aadhaar, username, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("❌ SQL Insert Error:", err);
            return res.status(500).json({ error: "Database insert error", details: err.sqlMessage });
          }

          delete otpStore[email];
          res.json({ message: "✅ Warden registered successfully", id: result.insertId });
        }
      );
    });
  } catch (err) {
    console.error("❌ Error hashing password:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// forgot password

// ✅ 1️⃣ Request OTP (Send to Email)
app.post("/request-otp", (req, res) => {
  const { email } = req.body;

  // Check if email exists
  db.query("SELECT * FROM wardens WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0)
      return res.status(404).json({ error: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP temporarily in DB
    db.query(
      "UPDATE wardens SET otp = ?, isVerified = 0 WHERE email = ?",
      [otp, email],
      (err2) => {
        if (err2) return res.status(500).json({ error: "Error saving OTP" });

        // Send OTP email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "nechostel.noreply@gmail.com", // 🔹replace with your email
            pass: "lupm wlya gltm muqu", // 🔹use Gmail App Password
          },
        });

        const mailOptions = {
          from: "nechostel.noreply@gmail.com",
          to: email,
          subject: "FixIt Portal - Password Reset OTP",
          text: `Your OTP for resetting your password is: ${otp}. It is valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (err3) => {
          if (err3) {
            console.error("❌ Email error:", err3);
            return res.status(500).json({ error: "Failed to send OTP" });
          }
          console.log(`📨 OTP ${otp} sent to ${email}`);
          return res.json({ message: "OTP sent successfully" });
        });
      }
    );
  });
});

// ✅ 2️⃣ Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM wardens WHERE email = ? AND otp = ?",
    [email, otp],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.length === 0)
        return res.status(400).json({ error: "Invalid or expired OTP" });

      // Mark OTP verified
      db.query(
        "UPDATE wardens SET isVerified = 1, otp = NULL WHERE email = ?",
        [email],
        (err2) => {
          if (err2)
            return res
              .status(500)
              .json({ error: "Error updating verification" });
          return res.json({ message: "OTP verified successfully" });
        }
      );
    }
  );
});

// ✅ 3️⃣ Reset Password
app.post("/reset-password", (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // Check if verified
  db.query(
    "SELECT * FROM wardens WHERE email = ? AND isVerified = 1",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.length === 0)
        return res
          .status(400)
          .json({ error: "OTP not verified or email not found" });

      // Update password and reset isVerified
      db.query(
        "UPDATE wardens SET password = ?, isVerified = 1 WHERE email = ?",
        [hashedPassword, email],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: "Error updating password" });

          return res.json({
            message: "Password reset successful. Redirecting to login...",
            redirectTo: "/login",
          });
        }
      );
    }
  );
});


// Warden login
app.post("/warden/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM wardens WHERE username = ? AND isVerified = 1 LIMIT 1";
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials or not verified" });
    }

    const warden = results[0];
    const match = await bcrypt.compare(password, warden.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    delete warden.password;
    res.json({ message: "✅ Login successful", warden });
  });
});



// ✅ Get Warden Profile by ID
app.get("/warden/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id, name, age, gender, dob, email, phone, address, aadhaar, username FROM wardens WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching warden profile:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Warden not found" });
    }

    res.json(results[0]);
  });
});
// ==============================
// NOTIFICATION ROUTES
// ==============================

// ==============================
// NOTIFICATIONS ROUTES
// ==============================
/*app.get("/api/notifications", (req, res) => {
  db.query("SELECT * FROM notifications ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});*/
app.get("/api/notifications", (req, res) => {
  const sql = "SELECT * FROM notifications ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching notifications:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


/*app.post("/api/notifications", (req, res) => {
  const { title, message, student_id } = req.body;
  const sql = `
    INSERT INTO notifications (title, message, student_id, created_at)
    VALUES (?, ?, ?, NOW())
  `;
  db.query(sql, [title, message, student_id || null], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ success: true, id: result.insertId });
  });
});*/
app.post("/notifications", (req, res) => {
  const { title, message, type, valid_until, created_by } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required" });
  }
  const sql = `
    INSERT INTO notifications (title, message, type, valid_until, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, message, type || "general", valid_until || null, created_by || "warden"], (err, result) => {
    if (err) {
      console.error("❌ Error inserting notification:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // ✅ Return the full inserted notification
    const selectSql = "SELECT * FROM notifications WHERE id = ?";
    db.query(selectSql, [result.insertId], (err2, rows) => {
      if (err2) {
        console.error("❌ Error fetching new notification:", err2);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows[0]); // now frontend receives full notification object with id
    });
  });
});




// Route to fetch warden dashboard stats
app.get("/students/stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Total students
    const students = await query("SELECT COUNT(*) AS total_students FROM students");

    // Present / Leave today
    const attendance = await query(`
      SELECT 
        SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present_today,
        SUM(CASE WHEN status='Leave' THEN 1 ELSE 0 END) AS leave_today
      FROM attendance_records
      WHERE date = ?
    `, [today]);

    const totalStudents = students[0].total_students || 0;
    const presentToday = attendance[0].present_today || 0;
    const leaveToday = attendance[0].leave_today || 0;

    // Absent = total students - present - leave
    const absentToday = totalStudents - presentToday - leaveToday;

    // Recent activities (optional, replace with your activities table)
    const activities = await query("SELECT * FROM activities ORDER BY created_at DESC LIMIT 5");

    // Daily attendance for chart (last 7 days)
    const daily = await query(`
      SELECT DATE(date) AS day,
             SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present,
             SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) AS absent,
             SUM(CASE WHEN status='Leave' THEN 1 ELSE 0 END) AS leave_count
      FROM attendance_records
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY date
      ORDER BY date ASC
    `);

    res.json({
      total_students: totalStudents,
      present_today: presentToday,
      absent_today: absentToday,
      leave_today: leaveToday,
      recent_activities: activities || [],
      attendanceData: daily || [],
    });

  } catch (err) {
    console.error("❌ /students/stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

//leave
app.post("/api/leave-request", async (req, res) => {
  try {
    const { studentId, fromDate, toDate, leaveType, reason } = req.body;

    const sql = `
      INSERT INTO attendance_requests 
      (studentId, type, fromDate, toDate, leaveType, reason) 
      VALUES (?, 'leave', ?, ?, ?, ?)
    `;
    const result = await query(sql, [studentId, fromDate, toDate, leaveType || 'full-day', reason]);

    res.status(201).json({ message: "Leave request submitted", requestId: result.insertId });
  } catch (err) {
    console.error("❌ Leave request error:", err);
    res.status(500).json({ message: "Failed to submit leave request" });
  }
});

app.post("/api/leave-request", async (req, res) => {
  try {
    const { studentId, fromDate, toDate, leaveType, reason } = req.body;

    if (!studentId || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "studentId, fromDate, toDate, and reason are required" });
    }

    const sql = `
      INSERT INTO attendance_requests 
      (studentId, type, fromDate, toDate, leaveType, reason) 
      VALUES (?, 'leave', ?, ?, ?, ?)
    `;
    const result = await query(sql, [studentId, fromDate, toDate, leaveType || 'full-day', reason]);

    res.status(201).json({ message: "Leave request submitted", requestId: result.insertId });
  } catch (err) {
    console.error("❌ Leave request error:", err);
    res.status(500).json({ message: "Failed to submit leave request" });
  }
});


/*app.put("/api/approve-request/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const sql = `UPDATE attendance_requests SET status = ? WHERE id = ?`;
    await query(sql, [status, requestId]);

    res.json({ message: "Request updated successfully" });
  } catch (err) {
    console.error("❌ Update request error:", err);
    res.status(500).json({ message: "Failed to update request" });
  }
});
app.put("/api/approve-request/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Update request status
    const updateSql = `UPDATE attendance_requests SET status = ? WHERE id = ?`;
    const result = await query(updateSql, [status, requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status === "approved") {
      const requests = await query(
        "SELECT studentId, fromDate, toDate FROM attendance_requests WHERE id = ?",
        [requestId]
      );

      if (!requests || requests.length === 0)
        return res.status(404).json({ message: "Request not found" });

      const request = requests[0];

      const title = "Leave Approved";
      const message = `Your leave from ${new Date(
        request.fromDate
      ).toLocaleDateString()} to ${new Date(
        request.toDate
      ).toLocaleDateString()} has been approved by the warden.`;

      await query(
        "INSERT INTO leave_notifications (student_id, title, message, type) VALUES (?, ?, ?, ?)",
        [request.studentId, title, message, "leave"]
      );
    }

    res.json({ message: "Request updated successfully and student notified" });
  } catch (err) {
    console.error("❌ Update request error:", err);
    res.status(500).json({ message: err.message || "Failed to update request" });
  }
});*/
app.put("/api/approve-request/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // 1️⃣ Update request status
    const updateSql = `UPDATE attendance_requests SET status = ? WHERE id = ?`;
    const result = await query(updateSql, [status, requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status === "approved") {
      // 2️⃣ Fetch the request details
      const requests = await query(
        "SELECT studentId, fromDate, toDate FROM attendance_requests WHERE id = ?",
        [requestId]
      );

      if (!requests || requests.length === 0)
        return res.status(404).json({ message: "Request not found" });

      const request = requests[0];

      // 3️⃣ Insert leave notification
      const title = "Leave Approved";
      const message = `Your leave from ${new Date(
        request.fromDate
      ).toLocaleDateString()} to ${new Date(
        request.toDate
      ).toLocaleDateString()} has been approved by the warden.`;

      await query(
        "INSERT INTO leave_notifications (student_id, title, message, type) VALUES (?, ?, ?, ?)",
        [request.studentId, title, message, "leave"]
      );

      // 4️⃣ Update attendance table for leave dates
      const start = new Date(request.fromDate);
      const end = new Date(request.toDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];

        // Insert or update attendance status as 'Leave'
        await query(
          `INSERT INTO attendance_records (student_id, date, status)
           VALUES (?, ?, 'Leave')
           ON DUPLICATE KEY UPDATE status = 'Leave'`,
          [request.studentId, dateStr]
        );
      }
    }

    res.json({ message: "Request approved, attendance updated, and student notified" });
  } catch (err) {
    console.error("❌ Update request error:", err);
    res.status(500).json({ message: err.message || "Failed to update request" });
  }
});

// 📌 Get leave notifications for a specific student
app.get("/api/student-leave-notifications/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const sql = `
      SELECT id, title, message, type, created_at
      FROM leave_notifications
      WHERE student_id = ?
      ORDER BY created_at DESC
    `;

    const rows = await query(sql, [studentId]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching leave notifications:", err);
    res.status(500).json({ message: "Failed to fetch leave notifications" });
  }
});

//pending
// GET pending attendance requests
// GET pending attendance requests
app.get("/api/pending-requests", async (req, res) => {
  try {
    const rows = await query(
      `SELECT 
          ar.id,
          ar.studentId,
          s.fullName AS studentName,
          s.department,
          s.yearOfAdmission AS currentYear,
          s.roomNumber,
          s.blockNumber,
          s.fatherNumber,
          s.motherNumber,
          s.personalNumber,
          ar.type,
          ar.fromDate AS fromDate,
          ar.toDate AS toDate,
          ar.leaveType,
          ar.reason
      FROM attendance_requests AS ar
      JOIN students AS s ON ar.studentId = s.id
      WHERE ar.status = 'pending'`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Failed to fetch pending requests:", err);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
});


// GET /api/attendance-history
// Optional query: ?studentId=123 to filter for a specific student
app.get("/api/attendance-history", async (req, res) => {
  try {
    const { name, rollNumber, department, roomNumber, blockNumber, status, date, month, year } = req.query;

    let sql = `
      SELECT 
        a.id,
        s.id AS student_id,
        s.fullName,
        s.rollNumber,
        s.department,
        s.roomNumber,
        s.blockNumber,
        a.date,
        a.status
      FROM attendance_records a
      JOIN students s ON a.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (name) { sql += " AND s.fullName LIKE ?"; params.push(`%${name}%`); }
    if (rollNumber) { sql += " AND s.rollNumber LIKE ?"; params.push(`%${rollNumber}%`); }
    if (department) { sql += " AND s.department LIKE ?"; params.push(`%${department}%`); }
    if (roomNumber) { sql += " AND s.roomNumber LIKE ?"; params.push(`%${roomNumber}%`); }
    if (blockNumber) { sql += " AND s.blockNumber LIKE ?"; params.push(`%${blockNumber}%`); }
    if (status) { sql += " AND a.status = ?"; params.push(status); }
    if (date) { sql += " AND DATE(a.date) = DATE(?)"; params.push(date); }
    if (month) { sql += " AND MONTH(DATE(a.date)) = ?"; params.push(month); }
    if (year) { sql += " AND YEAR(DATE(a.date)) = ?"; params.push(year); }

    sql += " ORDER BY a.date DESC";

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching attendance history:", err);
    res.status(500).json({ message: "Failed to fetch attendance history" });
  }
});



//change password

// ✅ Change Warden Password

// ✅ Change Warden Password (secure version)
app.put("/warden/:id/change-password", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  try {
    // Fetch current hashed password
    const sqlSelect = "SELECT password FROM wardens WHERE id = ?";
    db.query(sqlSelect, [id], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(404).json({ error: "Warden not found" });

      const dbPassword = results[0].password;

      // ✅ Compare hashed passwords
      const isMatch = await bcrypt.compare(currentPassword, dbPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // ✅ Hash new password before saving
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const sqlUpdate = "UPDATE wardens SET password = ? WHERE id = ?";
      db.query(sqlUpdate, [hashedPassword, id], (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Failed to update password" });

        res.json({ message: "✅ Password updated successfully!" });
      });
    });
  } catch (error) {
    console.error("❌ Password change error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// server.js
app.get("/api/approved-leaves/:studentId", (req, res) => {
  const { studentId } = req.params;
  // Mock data - replace with DB logic
  const approvedLeaves = [
    { from: "2025-10-05T00:00:00", to: "2025-10-07T23:59:59" },
  ];
  res.json(approvedLeaves);
});
app.get("/api/attendance-by-student", (req, res) => {
  const { studentId, month, year } = req.query;

  if (!studentId || !month || !year) {
    return res.status(400).json({ message: "Missing studentId, month or year" });
  }

  const sql = `
    SELECT date, status 
    FROM attendance_records 
    WHERE student_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
  `;

  db.query(sql, [studentId, year, month], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results); // array of { date, status }
  });
});
/*
app.get("/api/attendance-status-by-date", (req, res) => {
  const { studentId, date } = req.query;

  if (!studentId || !date) {
    return res.status(400).json({ message: "Missing studentId or date" });
  }

  const sql = "SELECT status FROM attendance_records WHERE student_id = ? AND date = ? LIMIT 1";

  db.query(sql, [studentId, date], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No attendance data found for that date." });
    }

    res.json({ status: results[0].status });
  });
});

*/
app.get("/api/attendance-by-student", (req, res) => {
  const { studentId, month, year } = req.query;

  if (!studentId || !month || !year) {
    return res.status(400).json({ message: "Missing studentId, month or year" });
  }

  const sql = `
    SELECT date, status
    FROM attendance_records
    WHERE student_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
  `;

  db.query(sql, [studentId, year, month], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    res.json(results); // [{date: "2025-10-13", status: "Present"}, ...]
  });
});


//RECENT ACTIVITIES FOR WARDEN
// 📍 Add this near bottom of your server file (after all routes)
// Add this to your server file (after all routes)

app.get("/students/live-stats", (req, res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  console.log("👀 Warden connected for live updates");

  const sendStats = () => {
    // 1️⃣ Total students
    db.query("SELECT COUNT(*) AS total FROM students", (err, totalRows) => {
      if (err) return console.error("❌ Error fetching total students:", err);
      const total = totalRows[0].total || 0;

      // 2️⃣ Present today
      db.query(
        "SELECT COUNT(*) AS present FROM attendance_records WHERE DATE(marked_at) = CURDATE() AND status='Present'",
        (err, presentRows) => {
          if (err) return console.error("❌ Error fetching present today:", err);
          const present = presentRows[0].present || 0;

          // 3️⃣ Leave today
          db.query(
            "SELECT COUNT(*) AS leaveToday FROM attendance_records WHERE DATE(marked_at) = CURDATE() AND status='Leave'",
            (err, leaveRows) => {
              if (err) return console.error("❌ Error fetching leave today:", err);
              const leaveToday = leaveRows[0].leaveToday || 0;

              // 4️⃣ Recent activities (last 5 entries today)
              db.query(
                `SELECT s.fullName AS student_name, a.status, a.marked_at AS timestamp
                 FROM attendance_records a
                 JOIN students s ON a.student_id = s.id
                 WHERE DATE(a.marked_at) = CURDATE()
                 ORDER BY a.marked_at DESC
                 LIMIT 5`,
                (err, activityRows) => {
                  if (err) return console.error("❌ Error fetching recent activities:", err);

                  const absent = total - (present + leaveToday);

                  const payload = {
                    totalStudents: total,
                    presentToday: present,
                    absentToday: absent,
                    leaveToday: leaveToday,
                    recent_activities: activityRows.map((r) => ({
                      student_name: r.student_name,
                      status: r.status,
                      timestamp: new Date(r.timestamp).toLocaleTimeString(),
                    })),
                  };

                  // Send SSE payload
                  res.write(`data: ${JSON.stringify(payload)}\n\n`);
                }
              );
            }
          );
        }
      );
    });
  };

  // Send immediately, then every 5 seconds
  sendStats();
  const interval = setInterval(sendStats, 5000);

  req.on("close", () => {
    clearInterval(interval);
    console.log("❌ Warden disconnected");
  });
});

//HOSTEL STAY

/*
// ✅ Route 1: Warden creates a holiday period
app.post("/warden/create-holiday", async (req, res) => {
  try {
    const { title, start_date, end_date, description, created_by } = req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Insert into holiday_periods
    const insertHolidaySql = `
      INSERT INTO holiday_periods (title, start_date, end_date, description, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(insertHolidaySql, [
      title,
      start_date,
      end_date,
      description,
      created_by,
    ]);

    const holidayId = result.insertId;

    // 2️⃣ Prepare notification message
    const message = `New Holiday: ${title} from ${start_date} to ${end_date}${
      description ? ". " + description : ""
    }`;

    // 3️⃣ Insert into stay_notifications (no student_id)
    const notifSql = `
      INSERT INTO stay_notifications (title, message, type)
      VALUES (?, ?, 'holiday')
    `;
    await query(notifSql, [title, message]);

    res.json({
      message: "Holiday created and notification added.",
      holiday: { id: holidayId, title, start_date, end_date, description, created_by },
    });
  } catch (err) {
    console.error("❌ Error creating holiday and notification:", err);
    res.status(500).json({ message: err.message || "Failed to create holiday." });
  }
});



// ✅ Route 2: Get all holidays (for Warden dashboard)
app.get("/api/holidays", async (req, res) => {
  try {
    const sql = `
      SELECT id, title, start_date, end_date
      FROM holiday_periods
      ORDER BY start_date DESC
    `;
    const holidays = await query(sql);
    res.json(holidays);
  } catch (err) {
    console.error("❌ Error fetching holidays:", err);
    res.status(500).json({ message: "Failed to fetch holidays" });
  }
});


// ✅ Route 3: Student submits a stay request
app.post("/students/stay-request", (req, res) => {
  const { student_id, holiday_id, reason } = req.body;

  if (!student_id || !holiday_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const checkSql = "SELECT * FROM stay_requests WHERE student_id = ? AND holiday_id = ?";
  db.query(checkSql, [student_id, holiday_id], (err, existing) => {
    if (err) {
      console.error("❌ Error checking existing request:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (existing.length > 0) {
      return res.status(400).json({ message: "You already submitted a stay request for this holiday" });
    }

    const sql = `
      INSERT INTO stay_requests (student_id, holiday_id, reason)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [student_id, holiday_id, reason], (err2) => {
      if (err2) {
        console.error("❌ Error inserting stay request:", err2);
        return res.status(500).json({ error: "Database error while submitting stay request" });
      }
      res.json({ message: "Stay request submitted successfully" });
    });
  });
});

// ✅ Route 4: Warden views all stay requests
/*
app.get("/warden/stay-requests", (req, res) => {
  const sql = `
    SELECT 
      sr.id, sr.status, sr.reason, sr.created_at,
      s.fullName AS student_name, s.rollNumber, s.department, s.yearOfAdmission,
      h.title AS holiday_title, h.start_date, h.end_date
    FROM stay_requests sr
    JOIN students s ON sr.student_id = s.id
    JOIN holiday_periods h ON sr.holiday_id = h.id
    ORDER BY sr.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching stay requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Route 5: Warden approves/rejects stay request
app.put("/warden/update-stay-status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const sql = "UPDATE stay_requests SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error("❌ Error updating stay status:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: `Stay request ${status} successfully` });
  });
});
app.post("/students/stay-request", (req, res) => {
  const { student_id, holiday_id, reason } = req.body;

  if (!student_id || !holiday_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const checkSql = "SELECT * FROM stay_requests WHERE student_id = ? AND holiday_id = ?";
  db.query(checkSql, [student_id, holiday_id], (err, existing) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (existing.length > 0) {
      return res.status(400).json({ message: "You already submitted a stay request for this holiday" });
    }

    const sql = "INSERT INTO stay_requests (student_id, holiday_id, reason) VALUES (?, ?, ?)";
    db.query(sql, [student_id, holiday_id, reason], (err2) => {
      if (err2) return res.status(500).json({ error: "Database error while submitting stay request" });

      res.json({ message: "Stay request submitted successfully" });
    });
  });
});
app.get("/api/stay-requests", (req, res) => {
  const sql = `
    SELECT 
      sr.id, sr.status, sr.reason, sr.created_at,
      s.fullName AS student_name, s.rollNumber, s.department, s.yearOfAdmission,
      h.title AS holiday_title, h.start_date, h.end_date
    FROM stay_requests sr
    JOIN students s ON sr.student_id = s.id
    JOIN holiday_periods h ON sr.holiday_id = h.id
    ORDER BY sr.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});
app.put("/warden/update-stay-status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const sql = "UPDATE stay_requests SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: `Stay request ${status} successfully` });
  });
});

// Add new holiday period and notify all students
// Get all stay/holiday notifications
app.get("/api/student-stay-notifications", async (req, res) => {
  try {
    const sql = `
      SELECT id, title, message, type, created_at
      FROM stay_notifications
      ORDER BY created_at DESC
    `;

    const rows = await query(sql);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching stay notifications:", err);
    res.status(500).json({ message: "Failed to fetch stay notifications" });
  }
});
// Get holidays for stay request dropdown
app.get("/api/holidays", async (req, res) => {
  try {
    // Fetch holiday titles from stay_notifications OR holiday_periods
    const sql = `
      SELECT id, title, start_date, end_date
      FROM holiday_periods
      ORDER BY start_date DESC
    `;
    const holidays = await query(sql);
    res.json(holidays);
  } catch (err) {
    console.error("❌ Error fetching holidays:", err);
    res.status(500).json({ message: "Failed to fetch holidays" });
  }
});
*/
app.post("/warden/create-holiday", async (req, res) => {
  try {
    const { title, start_date, end_date, description, created_by } = req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `
      INSERT INTO holiday_periods (title, start_date, end_date, description, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [title, start_date, end_date, description, created_by]);

    const notifSql = `
      INSERT INTO stay_notifications (title, message, type)
      VALUES (?, ?, 'holiday')
    `;
    const message = `New Holiday: ${title} (${start_date} - ${end_date})${description ? ". " + description : ""}`;
    await query(notifSql, [title, message]);

    res.json({
      message: "Holiday created successfully",
      holiday: { id: result.insertId, title, start_date, end_date, description, created_by },
    });
  } catch (err) {
    console.error("❌ Error creating holiday:", err);
    res.status(500).json({ message: "Failed to create holiday" });
  }
});

/* -------------------------------------------------------------------------- */
/* 📅 2️⃣ Get All Holidays (Dropdown) */
/* -------------------------------------------------------------------------- */
app.get("/api/holidays", async (req, res) => {
  try {
    const holidays = await query("SELECT id, title, start_date, end_date FROM holiday_periods ORDER BY start_date DESC");
    res.json(holidays);
  } catch (err) {
    console.error("❌ Error fetching holidays:", err);
    res.status(500).json({ message: "Failed to fetch holidays" });
  }
});

/* -------------------------------------------------------------------------- */
/* 🧍‍♀️ 3️⃣ Student: Submit Stay Request */
/* -------------------------------------------------------------------------- */
app.post("/students/stay-request", async (req, res) => {
  try {
    let { student_id, holiday_id, reason } = req.body;

    console.log("Received stay request:", { student_id, holiday_id, reason });

    // Convert IDs to integers
    student_id = parseInt(student_id, 10);
    holiday_id = parseInt(holiday_id, 10);

    // Validate fields
    if (!student_id || !holiday_id || !reason?.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    reason = reason.trim();

    // Check if student exists
    const studentExists = await query("SELECT * FROM students WHERE id = ?", [student_id]);
    if (studentExists.length === 0) {
      return res.status(400).json({ message: "Student not found" });
    }

    // Check if holiday exists
    const holidayExists = await query("SELECT * FROM holiday_periods WHERE id = ?", [holiday_id]);
    if (holidayExists.length === 0) {
      return res.status(400).json({ message: "Holiday not found" });
    }

    // Check for existing stay request
    const existing = await query(
      "SELECT * FROM stay_requests WHERE student_id = ? AND holiday_id = ?",
      [student_id, holiday_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        message: "You already submitted a stay request for this holiday",
      });
    }

    // Insert stay request
    const result = await query(
      "INSERT INTO stay_requests (student_id, holiday_id, reason) VALUES (?, ?, ?)",
      [student_id, holiday_id, reason]
    );

    console.log("✅ Stay request inserted:", result);
    res.json({ message: "Stay request submitted successfully" });

  } catch (err) {
    console.error("❌ Error submitting stay request:", err);
    res.status(500).json({ message: "Failed to submit stay request", error: err.message });
  }
});


// <-- this adds "/api" prefix to all routes in wardenRoutes

/* -------------------------------------------------------------------------- */
/* 🧑‍🏫 4️⃣ Warden: View All Stay Requests */
/* -------------------------------------------------------------------------- */
/*app.get("/warden/stay-requests", async (req, res) => {
  try {
    const sql = `
      SELECT 
        sr.id, sr.status, sr.reason, sr.created_at,
        s.fullName AS student_name, s.rollNumber, s.department, s.currentYear,
        h.title AS holiday_title, h.start_date, h.end_date
      FROM stay_requests sr
      JOIN students s ON sr.student_id = s.id
      JOIN holiday_periods h ON sr.holiday_id = h.id
      ORDER BY sr.created_at DESC
    `;
    const results = await query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching stay requests:", err);
    res.status(500).json({ message: "Failed to fetch stay requests" });
  }
});
*/
// Fetch all stay requests (for testing without warden auth)
app.get("/warden/stay-requests/:wardenId", async (req, res) => {
  try {
    const { wardenId } = req.params;
    const stayRequests = await query(`
     SELECT sr.id, sr.reason, sr.status, sr.created_at,
             s.id AS student_id, s.fullName AS student_name, s.rollNumber, s.department,
             h.id AS holiday_id, h.title AS holiday_title, h.start_date, h.end_date
      FROM stay_requests sr
      JOIN students s ON sr.student_id = s.id
      JOIN holiday_periods h ON sr.holiday_id = h.id
      ORDER BY sr.created_at DESC
    `, [wardenId]);
    
    if (stayRequests.length === 0) return res.status(404).json({ message: "No requests found" });
    
    res.json(stayRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stay requests" });
  }
});



// Update stay request status
import QRCode from "qrcode"; // npm install qrcode

// ✅ Update stay request + attendance_records
app.put("/warden/update-stay-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("🟢 Received request:", { id, status });

    if (!["approved", "rejected"].includes(status)) {
      console.log("❌ Invalid status value:", status);
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 1️⃣ Update stay request
    const result = await query("UPDATE stay_requests SET status = ? WHERE id = ?", [status, id]);
    console.log("✅ Update result:", result);

    if (result.affectedRows === 0) {
      console.log("❌ No stay request found for ID:", id);
      return res.status(404).json({ message: "Stay request not found" });
    }

    // 2️⃣ Get student info
    const rows = await query(
      `SELECT sr.student_id, s.fullName AS student_name, h.title AS holiday_title
       FROM stay_requests sr
       JOIN students s ON sr.student_id = s.id
       JOIN holiday_periods h ON sr.holiday_id = h.id
       WHERE sr.id = ?`,
      [id]
    );

    console.log("📘 Student join query result:", rows);

    const stay = rows[0];
    if (!stay) {
      console.log("❌ No matching stay found for join result.");
      return res.status(404).json({ message: "Student not found for this stay request" });
    }

    const { student_id, student_name, holiday_title } = stay;
    console.log("✅ Student Info:", stay);

    // 3️⃣ Insert/Update attendance_records
    if (status === "approved") {
      const qrString = `STAY-${student_id}-${Date.now()}`;
      console.log("🔵 QR String:", qrString);

      const qrBase64 = await QRCode.toDataURL(qrString);
      console.log("🟢 QR Generated");

      await query(
        `INSERT INTO attendance_records (student_id, date, status, qr_scanned)
         VALUES (?, CURDATE(), 'Present', ?)
         ON DUPLICATE KEY UPDATE status='Present', qr_scanned=?`,
        [student_id, qrBase64, qrBase64]
      );

      console.log("✅ Attendance updated for approval");

      return res.json({
        message: `Stay request approved. QR code generated for ${student_name}.`,
        qr_code: qrBase64,
      });
    } else {
      await query(
        `INSERT INTO attendance_records (student_id, date, status)
         VALUES (?, CURDATE(), 'Leave')
         ON DUPLICATE KEY UPDATE status='Leave'`,
        [student_id]
      );

      console.log("✅ Attendance updated for rejection");

      return res.json({
        message: `Stay request rejected. ${student_name} marked as on Leave.`,
      });
    }
  } catch (err) {
    console.error("❌ Error updating stay request:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Failed to update stay request", error: err.message });
  }
});



// GET /students/stay-requests/:studentId
app.get("/students/stay-requests/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const stayRequests = await query(
      `SELECT sr.id, sr.reason, sr.status, sr.created_at,
              h.title AS holiday_title, h.start_date, h.end_date
       FROM stay_requests sr
       JOIN holiday_periods h ON sr.holiday_id = h.id
       WHERE sr.student_id = ?
       ORDER BY sr.created_at ASC`,
      [studentId]
    );

    res.json(stayRequests);
  } catch (err) {
    console.error("❌ Error fetching student stay requests:", err);
    res.status(500).json({ message: "Failed to fetch stay requests" });
  }
});


/* -------------------------------------------------------------------------- */
/* 🔔 6️⃣ Student Dashboard: Stay Notifications */
/* -------------------------------------------------------------------------- */
app.get("/api/student-stay-notifications", async (req, res) => {
  try {
    const rows = await query(`
     SELECT id, title, message, type, created_at
FROM stay_notifications
WHERE created_at <= NOW()
ORDER BY created_at DESC

    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching stay notifications:", err);
    res.status(500).json({ message: "Failed to fetch stay notifications" });
  }
});


app.listen(5000, () => console.log("✅ Stay Approval Backend running on port 5000"));


// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
