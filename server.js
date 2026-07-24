const http = require('http');
// 1. เรียกใช้งาน Pool จากไลบรารี pg สำหรับจัดการการเชื่อมต่อฐานข้อมูล
const { Pool } = require('pg');

// 2. ตั้งค่าการเชื่อมต่อ โดยดึง URL มาจาก Environment Variable ของ Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // 3. ขอเชื่อมต่อและส่งคำสั่ง SQL ไปดึงข้อมูลจากตาราง students
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM students');
    client.release(); // คืนการเชื่อมต่อเมื่อใช้งานเสร็จ

    // 4. นำข้อมูลที่ได้ (result.rows) มาประกอบเป็นตาราง HTML พร้อมดีไซน์
    let html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ระบบฐานข้อมูลนักศึกษา</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', 'Segoe UI', sans-serif;
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            padding: 20px;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .container {
            width: 90%;
            max-width: 900px;
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 35px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
          }

          h1 {
            color: #e73c7e;
            font-size: 36px;
            margin-bottom: 10px;
            text-align: center;
          }

          .subtitle {
            color: #23a6d5;
            font-size: 18px;
            text-align: center;
            margin-bottom: 30px;
          }

          .info-box {
            background: linear-gradient(135deg, #f1e9ff, #ffe6f0);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            border-left: 5px solid #e73c7e;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          th {
            background: linear-gradient(135deg, #e73c7e, #23a6d5);
            color: white;
            padding: 15px;
            text-align: left;
            font-size: 16px;
          }

          td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
            color: #333;
          }

          tr:hover {
            background-color: #f9f9f9;
          }

          .row-count {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            color: #23a6d5;
            font-weight: bold;
            margin-top: 20px;
          }

          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="cartoon" style="text-align: center; font-size: 50px; margin-bottom: 20px;">
            🐰🌸🎀
          </div>

          <h1>📚 ระบบฐานข้อมูลนักศึกษา</h1>
          <p class="subtitle">ข้อมูลจากฐานข้อมูล PostgreSQL</p>

          <div class="info-box">
            👩‍💻 จัดทำโดย นางสาวปัณฑิตา กองครบุรี<br>
            รหัสนักศึกษา 69319010623 <br>
            <strong style="color: #e73c7e;">✓ เชื่อมต่อฐานข้อมูลสำเร็จ</strong>
          </div>
    `;

    // วนลูปนำข้อมูลแต่ละแถวมาแสดง
    if (result.rows.length > 0) {
      html += `<table>`;
      html += `<tr><th>🆔 รหัสนักศึกษา</th><th>👤 ชื่อ-นามสกุล</th></tr>`;
      
      result.rows.forEach((row, index) => {
        html += `<tr>
          <td>${row.student_id}</td>
          <td>${row.student_name}</td>
        </tr>`;
      });
      
      html += `</table>`;
      html += `<div class="row-count">📊 จำนวนนักศึกษาทั้งหมด: ${result.rows.length} คน</div>`;
    } else {
      html += `<p style="text-align: center; color: #ff6b6b; font-size: 18px;">⚠️ ไม่พบข้อมูลในตาราง</p>`;
    }

    html += `
          <div class="footer">
            ✨ ขอบคุณที่เข้ามาเยี่ยมชมเว็บไซต์ของแก้มนะคะ 🥰<br>
            <small>Powered by Node.js + PostgreSQL + Railway</small>
          </div>
        </div>
      </body>
      </html>
    `;

    res.end(html);

  } catch (err) {
    // กรณีเชื่อมต่อไม่ได้หรือเขียนชื่อตารางผิด
    console.error('Database Error:', err);
    
    res.end(`
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <title>ข้อผิดพลาด</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(-45deg, #ff6b6b, #ee5a6f);
            font-family: Arial, sans-serif;
            color: white;
          }
          .error-box {
            background: rgba(0,0,0,0.3);
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 500px;
          }
          h1 { font-size: 32px; margin-bottom: 20px; }
          p { font-size: 16px; line-height: 1.6; margin-bottom: 10px; }
          code { background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; display: block; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="error-box">
          <h1>❌ เกิดข้อผิดพลาด!</h1>
          <p>ไม่สามารถเชื่อมต่อฐานข้อมูลได้</p>
          <code>${err.message}</code>
          <p style="margin-top: 20px; font-size: 14px;">
            ⚠️ โปรดตรวจสอบ:<br>
            • DATABASE_URL ในการตั้งค่า Railway<br>
            • ตารางชื่อ students มีอยู่จริง<br>
            • ฐานข้อมูล PostgreSQL ทำงานปกติ
          </p>
        </div>
      </body>
      </html>
    `);
  }
});

server.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
  console.log(`📊 Database URL: ${process.env.DATABASE_URL ? '✓ Connected' : '✗ Not set'}`);
});
