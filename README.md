# ไปไหนดี — Thai Transit Graph Planner

โครงงานเดี่ยว: Interactive Web Application ด้วยแนวคิด Graph Theory และ Tree  
รายวิชา Discrete Mathematics for IT

## เปิดใช้งาน
เปิด `index.html` ใน Chrome/Edge ได้ทันที หรืออัปโหลดโฟลเดอร์นี้ขึ้น GitHub Pages

## 4 หน้า
1. `index.html` — ค้นหาเส้นทาง + Tree Picker
2. `routes.html` — เปรียบเทียบ + Graph + Adjacency List + Dijkstra
3. `itinerary.html` — Path และรายละเอียดทีละ Edge
4. `ticket.html` — e-Ticket ตัวอย่าง + Total Weight + QR แบบสาธิต

## Graph Theory
- Vertex: สถานี MRT
- Edge: ช่วงเชื่อมระหว่างสถานี
- Weighted Graph: Weight = เวลาเดินทางโดยประมาณ (นาที)
- มี Vertex มากกว่า 6 จุด และ Edge มากกว่า 7 เส้น
- ใช้ Adjacency List ใน `app.js`
- ใช้ Dijkstra หา Shortest Path

## Tree
โครงสร้าง 4 ระดับ:
Root: ทุกระบบขนส่ง
→ Parent: รถไฟฟ้า MRT
→ Parent: สายสีน้ำเงิน / สายสีม่วง
→ Leaf: สถานี

## ค่าโดยสารจริง
เว็บไซต์แสดงค่าโดยสาร “อ้างอิงจริง” เฉพาะคู่สถานีที่ตรวจสอบไว้ใน `VERIFIED_FARES` ของ `app.js` และติดป้ายว่า “ประมาณ” สำหรับคู่ที่ยังไม่ได้ตรวจสอบ

ข้อมูลที่ตรวจสอบจากเว็บไซต์ BEM (MRT) วันที่ 28 ก.ย. 2569 เช่น:
- สวนจตุจักร ↔ สามย่าน: 44 บาท, ประมาณ 28 นาที
- ท่าพระ ↔ สวนจตุจักร: 44 บาท, ประมาณ 25 นาที
- ท่าพระ ↔ เตาปูน: 37 บาท
- ท่าพระ ↔ ลาดพร้าว: 44 บาท, ประมาณ 30 นาที
- ท่าพระ ↔ สุทธิสาร: 44 บาท, ประมาณ 32 นาที
- สุขุมวิท ↔ ศูนย์ราชการนนทบุรี: 58 บาท

สำคัญ: ค่าโดยสารสามารถเปลี่ยนได้ และเว็บไซต์นี้เป็นโครงงานสาธิต ไม่ใช่ระบบจำหน่ายตั๋วจริง

## ภาพ
ภาพรถไฟฟ้าและสถานที่เป็นภาพถ่ายจริงจาก Wikimedia Commons:
- MRT-BLUELINE-BLE.jpg — Phornlert.gp — CC BY-SA 4.0
- Wat Arun in Bangkok (1).jpg — Krzysztof Golik — CC BY-SA 4.0
- Grand Palace, Bangkok-101.jpg — Immanuelle — CC BY-SA 4.0

ใน HTML ใช้ URL ของ Wikimedia Commons โดยตรง จึงต้องมีอินเทอร์เน็ตเมื่อเปิดเว็บ

## Prompt AI ตัวอย่างสำหรับรายงาน
1. “ออกแบบ Interactive Web Application 4 หน้า สำหรับวางแผนการเดินทางในกรุงเทพฯ โดยใช้ Graph Theory และ Tree”
2. “เขียน JavaScript แทน Weighted Graph ด้วย Adjacency List และหา Shortest Path ด้วย Dijkstra”
3. “ออกแบบ Tree อย่างน้อย 3 ระดับสำหรับระบบเลือกสถานี และอธิบาย Root, Parent, Child, Leaf และ Path”

## โครงสร้างคะแนนที่งานนี้รองรับ
- UI / การทำงาน: 4 คะแนน
- Graph Theory: 5 คะแนน
- Tree: 5 คะแนน
- JavaScript + การอธิบาย: 3 คะแนน
- รายงาน / การนำเสนอ: เตรียมเนื้อหาไว้ใน README และ `รายงาน_สรุป.txt`
