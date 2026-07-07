const http = require('http');

// Render จะกำหนด Port มาให้ทาง process.env.PORT
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // การตอบกลับ (Response) เมื่อมีคนคลิกเข้าลิงก์ (Request)
  res.statusCode = 200;
  
  // กำหนดประเภทของข้อมูลที่จะส่งกลับเป็น HTML และรองรับภาษาไทย
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // ข้อมูลที่จะแสดงบนหน้าเว็บ (ตกแต่งสไตล์ Modern Profile Card)
  res.end(`
    <!DOCTYPE html>
    <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Server - Student Profile</title>
        <style>
          /* รีเซ็ตค่าเริ่มต้นและตั้งค่าฟอนต์ */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }

          /* พื้นหลังแบบไล่เฉดสีสีม่วง-น้ำเงินสไตล์ Tech */
          body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          /* กล่องข้อความการ์ดนักศึกษา */
          .profile-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            padding: 40px 30px;
            width: 100%;
            max-width: 450px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          /* เอฟเฟกต์ยกตัวเมื่อเอาเมาส์มาวาง */
          .profile-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          /* วงกลมไอคอนรูปหมวกปริญญา */
          .avatar-icon {
            width: 90px;
            height: 90px;
            background: #764ba2;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            margin: 0 auto 25px;
            box-shadow: 0 8px 20px rgba(118, 75, 162, 0.3);
          }

          /* ตกแต่งชื่อ-นามสกุล */
          h1 {
            color: #2d3748;
            font-size: 24px;
            margin-bottom: 10px;
            font-weight: 700;
          }

          /* ตกแต่งรหัสนักศึกษา */
          h2 {
            color: #718096;
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 30px;
          }

          /* ป้ายสเตตัสจำลองบอกสถานะ Web Server */
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #e6fffa;
            color: #00a3c4;
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid #b2f5ea;
          }

          /* จุดกระพริบสีเขียว */
          .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #319795;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(0.9); opacity: 1; }
          }
        </style>
      </head>
      <body>

        <div class="profile-card">
          <div class="avatar-icon">🎓</div>
          <h1>นางสาว [ปัณฑิตา กองครบุรี]</h1>
          <h2>รหัสนักศึกษา: 69319010623</h2>
          <div class="status-badge">
            <div class="pulse-dot"></div>
            Web Server Response: 200 OK
          </div>
        </div>

      </body>
    </html>
  `);
});

// สั่งให้ Server เริ่มทำงานและรอรับ Request
server.listen(port, () => {
  console.log(`Web Server กำลังทำงานที่ Port ${port}`);
});
