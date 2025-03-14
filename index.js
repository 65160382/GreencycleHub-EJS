const express = require('express');
const path = require('path');
const router = require('./routes/myroutes')

const app = express();
const port = 3000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); //อ้างอิง views ที่อยู่ใน floder views

app.use(express.static(path.join(__dirname,'public'))); //อ้างอิงไฟล์ static ใน floder public
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // เพิ่มการตั้งค่าเพื่อรับข้อมูล JSON จาก body ของ request

// ใช้ router
app.use('/', router);

app.listen(port,()=>{
    console.log(`Server is runing at http://localhost:${port}`)
});