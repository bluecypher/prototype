const { Router } = require('express');
const db = require('../database');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const e = require('express');
var cookieParser = require('cookie-parser')

const router = Router();


// router.use((req,res,next) => {
//     console.log('Request made to /users');
//     next();
// })

router.use(cookieParser())
router.use((req,res,next)=>{
    res.append('Access-Control-Allow-Origin',['*']);
    res.append('Access-Control-Allow-Headers',['*']);

    next();
})
router.use(cors());

const checkToken = async (req,res,next) => {
    // const cookies = req.query.Cookies;
    // console.log(cookies["token"]);
    // const jwt = req.query.Cookies['token'];
    // const results = await db.promise().query(`SELECT jwt FROM USERS WHERE number='${req.query.number}'`);
    // if(results === jwt)
    // {
    next();
    // }
    // res.status(404).send('Invalid access token');
} 

router.get('/getData',checkToken,async(req,res)=>{
    // console.log('params:',req.query.number)
    const results = await db.promise().query(`SELECT * FROM USERS WHERE number='${req.query.number}'`);
    res.status(200).send(results[0]);
})


router.post('/login',(req,res)=>{
    const { number } = req.body;
    

    
    if(number)
    {
        const result=db.promise().query(`SELECT number FROM USERS WHERE number='${number}'`);
        const jwToken = jwt.sign({id:number},'Thisisasecretkeyforgeneratingjwt');
        if(!result)
        {
        
        try{
            db.promise().query(`INSERT INTO USERS(number,jwt) VALUES('${number}','${jwToken}')`);
            // res.cookie('session',jwToken,{
            //         expires: new Date(Date.now() + 1000*60),
            //         httpOnly:true
            //     });
            res.status(200).send({
                jwToken: jwToken,
                res:'success'
            }); 
            
        }
        catch(e){
            
            console.log(e);
            res.status(404).send('Error');
        }
    }
    else{
        try{
            db.promise().query(`UPDATE USERS SET jwt='${jwToken}' WHERE number='${number}'`);
            // res.cookie('session',jwToken,{
            //         expires: new Date(Date.now() + 1000*60),
            //         httpOnly:true
            //     });
            res.status(200).send({
                jwToken: jwToken,
                res:'success'
            }); 
            
        }
        catch(e){
            
            console.log(e);
            res.status(404).send('Error');
        }
    }
    }
    
})
router.get('/logout',(req,res)=>{
    const number = req.query.number;
    // const jwt='';
    db.promise().query(`UPDATE USERS SET jwt=NULL WHERE number='${number}'`);
    res.status(200).send('success');

})
router.post('/updateDetails',(req,res)=>{
    const { name,number,img,addr,locality,city,pin,area,service,hghlts } = req.body;
    if(number)
    {
        try{
            db.promise().query(`UPDATE USERS SET name='${name}',img='${img}',addr='${addr}',locality='${locality}',city='${city}',pin='${pin}',area='${area}',service='${service}',hghlts='${hghlts}' WHERE number='${number}' `);
            res.status(200).send('Success');
            
        }
        catch(e){
            
            console.log(e);
            res.status(404).send('Error');
        }
    }
    
})

module.exports= router;
