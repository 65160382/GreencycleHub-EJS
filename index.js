const express = require('express');
const path = require('path');
const router = require('./routes/myroutes')

const app = express();
const port = 3000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); //อ้างอิง views ที่อยู่ใน floder views

app.use(express.static(path.join(__dirname,'public'))); //อ้างอิงไฟล์ static ใน floder public
app.use(express.urlencoded({extended:true}));


// ใช้ router
app.use(router);

/* test แบบเก่า
app.get('/',(req,res)=>{
    res.send('Hello Worlds')
});*/

app.listen(port,()=>{
    console.log(`Server is runing at http://localhost:${port}`)
});