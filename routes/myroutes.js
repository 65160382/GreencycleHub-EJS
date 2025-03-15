const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');


router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/reserve',async (req,res)=>{
    try{
        const [recycletype] = await pool.query('SELECT * FROM recycle_type');
        res.render('reserve',{recycletype}); /*ส่งข้อมูลที่ดึงมาไปยังหน้า reserve*/
    }catch(err){
        console.log(err);
        res.status(500).send('ดึงข้อมูลไม่สำเร็จ');
    }
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',async(req,res)=>{
    const user = {
        email:req.body.email,
        password:req.body.password
    };

    try{
        const [users] = await pool.query('SELECT * FROM users WHERE email =?',[user.email]);
        if(users.length ===0){
            return res.status(400).json({message:'ไม่มีผู้ใช้งานในระบบ'});
        }
        const verify = await bcrypt.compare(user.password,users[0].password);
        
        if(!verify){
            return res.status(400).json({message:'รหัสผ่านไม่ถูกต้อง'});
        }

        // สร้าง session user
        req.session.user = users[0];
        // console.log('Session ID after login:', req.session.id);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).json({message:'เข้าสู่ระบบไม่สำเร็จ'});
    }
});

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }else{
            res.clearCookie('connect.sid'); // ลบคุกกี้ session ID
            // console.log('Cookies after logout:', req.cookies);
            res.redirect('/login');
        }
    });
});

router.get('/register',(req,res)=>{
    res.render('register');
});

/* Demo ทดสอบโดยการใช้ postman */
router.post('/register',async (req,res)=>{
    const user = { 
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email , 
        password:req.body.password,
        confirmpassword:req.body.confirmpassword 
    };
    if(user.password!==user.confirmpassword){
        return res.status(400).json({ success: false, message: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' });
    }
    try {  
        // Hash the password  salt 10
        user.password = await bcrypt.hash(user.password, 10);  

        // Insert user into database users table 
        const [result] =  await pool.query('INSERT INTO users (email, password, roles_id) VALUES (?, ?, ?)', [user.email, user.password, 2]);  

        const userId = result.insertId;

        //Insert user into  database customers table 
        await pool.query('INSERT INTO customers (users_id, firstname, lastname, email) VALUES (?,?,?,?)',[ userId,user.firstname ,user.lastname ,user.email]);
        res.status(201).json({ message: 'User created' });  
    } catch (err) {  
        console.error('Error:', err);  
        res.status(500).json({ message: 'Internal server error' });  
    }  
});


module.exports = router;