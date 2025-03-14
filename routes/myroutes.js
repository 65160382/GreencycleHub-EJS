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
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).json({message:'เข้าสู่ระบบไม่สำเร็จ'});
    }
});

/* Demo ทดสอบโดยการใช้ postman */
router.post('/register',async (req,res)=>{
    const user = { 
        email:req.body.email , 
        password:req.body.password 
    };

    try {  
        // Hash the password  
        user.password = await bcrypt.hash(user.password, 10);  

        // Insert user into database  
        await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password]);  
        res.status(201).json({ message: 'User created' });  
    } catch (err) {  
        console.error('Error:', err);  
        res.status(500).json({ message: 'Internal server error' });  
    }  

});


module.exports = router;