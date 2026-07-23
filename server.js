const http = require('http');
const { Pool } = require('pg');

// ตั้งค่าการเชื่อมต่อ PostgreSQL โดยดึง URL จาก Environment Variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // เชื่อมต่อฐานข้อมูลและดึงข้อมูลนักศึกษา
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM students');
    client.release();

    // สร้าง HTML โดยรวมข้อมูลจากฐานข้อมูล
    let studentRows = '';
    result.rows.forEach(row => {
      studentRows += `<tr><td>${row.student_id}</td><td>${row.student_name}</td></tr>`;
    });

    const totalRecords = result.rows.length;

    res.end(`
      <!DOCTYPE html>
      <html lang="th">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Web Server - Student Database</title>
          <link href="https://googleapis.com" rel="stylesheet">
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
              overflow-x: hidden;
              color: var(--text);
              padding: 24px;
            }

            /* Animated background layer */
            .animated-bg{
              position: fixed;
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

            /* Container */
            .container{
              position: relative;
              z-index: 1;
              width: 100%;
              max-width: 900px;
              padding: 36px;
              border-radius: 18px;
              background: var(--card-bg);
              border: 1px solid var(--card-border);
              box-shadow: 0 10px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
              backdrop-filter: blur(6px) saturate(120%);
            }

            h1{
              font-size: 28px;
              margin-bottom: 24px;
              font-weight: 700;
              color: var(--text);
              text-align: center;
            }

            .status-badge{
              display: inline-flex;
              align-items: center;
              gap: 10px;
              padding: 10px 20px;
              border-radius: 999px;
              background: linear-gradient(90deg, rgba(52,211,153,0.2), rgba(52,211,153,0.1));
              color: #34d399;
              border: 1px solid rgba(52,211,153,0.3);
              font-weight: 700;
              font-size: 14px;
              margin-bottom: 24px;
              text-align: center;
              width: 100%;
              justify-content: center;
            }

            .pulse-dot{
              width: 10px; 
              height: 10px; 
              border-radius: 50%; 
              background: #34d399;
              box-shadow: 0 0 12px rgba(52,211,153,0.6);
              position: relative;
            }

            .pulse-dot::after{
              content: '';
              position: absolute; 
              inset: -8px; 
              border-radius: 50%; 
              background: rgba(52,211,153,0.12); 
              animation: pulse 1.8s infinite;
            }

            @keyframes pulse{
              0% { transform: scale(0.9); opacity: 1; }
              50% { transform: scale(1.5); opacity: 0.2; }
              100% { transform: scale(0.9); opacity: 1; }
            }

            /* Table Styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }

            th, td {
              padding: 14px 16px;
              text-align: left;
              border-bottom: 1px solid rgba(255,255,255,0.1);
              font-weight: 500;
              color: rgba(255,255,255,0.9);
            }

            th {
              background: linear-gradient(90deg, rgba(123,97,255,0.15), rgba(79,209,197,0.1));
              font-weight: 700;
              color: var(--text);
              font-size: 15px;
            }

            tr:hover {
              background: rgba(123,97,255,0.08);
              transition: background 0.2s ease;
            }

            tr:last-child td {
              border-bottom: none;
            }

            .record-count {
              text-align: center;
              color: rgba(255,255,255,0.65);
              font-size: 14px;
              margin-top: 20px;
              padding-top: 16px;
              border-top: 1px solid rgba(255,255,255,0.1);
            }

            @media (max-width: 520px) {
              .container { padding: 24px; }
              h1 { font-size: 22px; }
              th, td { padding: 10px 12px; font-size: 13px; }
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

          <div class="container" role="main">
            <h1>ฐานข้อมูลนักศึกษา</h1>
            
            <div class="status-badge">
              <div class="pulse-dot" aria-hidden="true"></div>
              เชื่อมต่อกับฐานข้อมูลสำเร็จ
            </div>

            <table>
              <thead>
                <tr>
                  <th>รหัสนักศึกษา</th>
                  <th>ชื่อ-นามสกุล</th>
                </tr>
              </thead>
              <tbody>
                ${studentRows || '<tr><td colspan="2" style="text-align:center;">ไม่พบข้อมูลนักศึกษา</td></tr>'}
              </tbody>
            </table>

            <div class="record-count">
              จำนวนนักศึกษาทั้งหมด: ${totalRecords} คน
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Database connection error:', error);
    res.statusCode = 500;
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Database Error</title>
          <style>
            body { background: #0f172a; color: #f43f5e; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .error-box { padding: 30px; border: 1px solid #f43f5e; border-radius: 8px; background: rgba(244,63,94,0.1); max-width: 500px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h2>เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล</h2>
            <p>โปรดตรวจสอบ DATABASE_URL ใน Environment Variable</p>
          </div>
        </body>
      </html>
    `);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
