const express = require('express');
const path = require('path');
const session = require('express-session');
const router = require('./routes/myroutes')

const app = express();
const port = 3000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); //อ้างอิง views ที่อยู่ใน floder views

app.use(express.static(path.join(__dirname,'public'))); //อ้างอิงไฟล์ static ใน floder public
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // เพิ่มการตั้งค่าเพื่อรับข้อมูล JSON จาก body ของ request

// ตั้งค่า session
app.use(session({
    secret: 'my-session', // ใช้สำหรับการเข้ารหัส session
    resave: false,  // ถ้าเป็น false จะไม่ทำการบันทึก session ทุกครั้งที่ request มา
    saveUninitialized: true, // ถ้าเป็น true จะทำให้เกิดการสร้าง session ใหม่ทุกครั้งที่ request มา
    cookie: { secure: false } // ตั้งค่า secure เป็น true หากใช้ https
}));

// ใช้ router
app.use('/', router);

app.listen(port,()=>{
    console.log(`Server is runing at http://localhost:${port}`)
});