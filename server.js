const http = require('http');

// Render จะกำหนด Port มาให้ทาง process.env.PORT
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // การตอบกลับ (Response) เมื่อมีคนคลิกเข้าลิงก์ (Request)
  res.statusCode = 200;
  
  // กำหนดประเภทของข้อมูลที่จะส่งกลับเป็น HTML และรองรับภาษาไทย
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // ข้อมูลที่จะแสดงบนหน้าเว็บ (ตกแต่งสไตล์ Modern Profile Card พร้อมภาพพื้นหลังเคลื่อนไหว)
  res.end(`
    <!DOCTYPE html>
    <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Server - Student Profile</title>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        <style>
          :root{
            --accent-1: #7b61ff;
            --accent-2: #4fd1c5;
            --card-bg: rgba(255,255,255,0.08);
            --card-border: rgba(255,255,255,0.12);
            --text: #ffffff;
          }

          *{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }

          html,body{
            height: 100%;
          }

          body{
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #0b1220 100%);
            overflow: hidden;
            color: var(--text);
            padding: 24px;
          }

          /* Animated background layer */
          .animated-bg{
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
          }

          /* moving gradient overlay */
          .gradient-move{
            position: absolute;
            inset: 0;
            background: linear-gradient(120deg, rgba(123,97,255,0.16), rgba(79,209,197,0.12), rgba(99,102,241,0.10));
            background-size: 200% 200%;
            animation: gradientShift 8s ease-in-out infinite;
            mix-blend-mode: screen;
            filter: blur(20px);
          }

          @keyframes gradientShift{
            0%{background-position:0% 50%}
            50%{background-position:100% 50%}
            100%{background-position:0% 50%}
          }

          /* floating blurred blobs */
          .blob{ 
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.9;
            transform: translate3d(0,0,0);
            animation: float 14s ease-in-out infinite;
            mix-blend-mode: screen;
          }

          .blob:nth-child(1){
            width: 420px; height: 420px; left: -80px; top: -60px;
            background: radial-gradient(circle at 30% 30%, rgba(123,97,255,0.95), rgba(123,97,255,0.25));
            animation-duration: 18s;
          }
          .blob:nth-child(2){
            width: 360px; height: 360px; right: -100px; top: -30px;
            background: radial-gradient(circle at 70% 30%, rgba(79,209,197,0.85), rgba(79,209,197,0.18));
            animation-duration: 16s; animation-delay: -3s;
          }
          .blob:nth-child(3){
            width: 520px; height: 520px; left: 30%; bottom: -200px;
            background: radial-gradient(circle at 40% 60%, rgba(255,123,123,0.18), rgba(123,97,255,0.06));
            animation-duration: 20s; animation-delay: -6s;
          }

          @keyframes float{
            0% { transform: translateY(0) translateX(0) scale(1); }
            50% { transform: translateY(-40px) translateX(30px) scale(1.03); }
            100% { transform: translateY(0) translateX(0) scale(1); }
          }

          /* Profile card */
          .profile-card{
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 480px;
            padding: 36px;
            border-radius: 18px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            box-shadow: 0 10px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
            text-align: center;
            backdrop-filter: blur(6px) saturate(120%);
            transition: transform 0.32s cubic-bezier(.2,.9,.3,1), box-shadow 0.32s ease;
          }

          .profile-card:hover{
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 20px 50px rgba(2,6,23,0.7);
          }

          .avatar-wrap{
            width: 110px;
            height: 110px;
            margin: 0 auto 18px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
            border: 1px solid rgba(255,255,255,0.06);
            box-shadow: 0 8px 22px rgba(2,6,23,0.6);
            font-size: 48px;
          }

          h1{
            font-size: 22px;
            margin-bottom: 6px;
            font-weight: 700;
            color: var(--text);
            letter-spacing: 0.2px;
          }

          h2{
            font-size: 15px;
            margin-bottom: 18px;
            font-weight: 600;
            color: rgba(255,255,255,0.85);
          }

          .meta-row{
            display:flex;
            align-items:center;
            justify-content:center;
            gap:12px;
            margin-bottom: 20px;
          }

          .status-badge{
            display:inline-flex;
            align-items:center;
            gap:10px;
            padding: 8px 18px;
            border-radius: 999px;
            background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
            color: var(--text);
            border: 1px solid rgba(255,255,255,0.06);
            font-weight: 700;
            font-size: 13px;
            box-shadow: 0 6px 18px rgba(2,6,23,0.5);
          }

          .pulse-dot{
            width:10px; height:10px; border-radius:50%; background: linear-gradient(180deg, #34d399, #059669); box-shadow: 0 0 12px rgba(52,211,153,0.6);
            position: relative;
          }

          .pulse-dot::after{
            content: '';
            position:absolute; inset:-8px; border-radius:50%; background: rgba(52,211,153,0.12); animation: pulse 1.8s infinite;
          }

          @keyframes pulse{
            0% { transform: scale(0.9); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.2; }
            100% { transform: scale(0.9); opacity: 1; }
          }

          .info-list{
            margin-top: 12px;
            display:flex; flex-direction:column; gap:10px; align-items:center;
          }

          .info-item{
            display:flex; gap:10px; align-items:center; color: rgba(255,255,255,0.9); font-weight:600; font-size:14px;
          }

          .small-muted{ color: rgba(255,255,255,0.65); font-weight:400; font-size:13px }

          /* Responsive */
          @media (max-width:520px){
            .profile-card{ padding: 28px; }
            .avatar-wrap{ width:96px; height:96px; font-size:40px }
          }
        </style>
      </head>
      <body>

        <div class="animated-bg" aria-hidden="true">
          <div class="gradient-move"></div>
          <div class="blob"></div>
          <div class="blob"></div>
          <div class="blob"></div>
        </div>

        <div class="profile-card" role="main">
          <div class="avatar-wrap">🎓</div>
          <h1>นางสาว ปัณฑิตา กองครบุรี</h1>
          <h2 class="small-muted">รหัสนักศึกษา: 69319010623</h2>

          <div class="meta-row">
            <div class="status-badge">
              <div class="pulse-dot" aria-hidden="true"></div>
              Web Server Response: 200 OK
            </div>
          </div>

          <div class="info-list">
            <div class="info-item">สาขา: วิทยาการคอมพิวเตอร์</div>
            <div class="info-item">ชั้นปี: 3</div>
            <div class="small-muted">ออกแบบ UI ใหม่ + พื้นหลังเคลื่อนไหว (CSS blobs & gradient)</div>
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
