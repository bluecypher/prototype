const { Router } = require('express');
const db = require('../database');
const cors = require('cors');

const router = Router();


// router.use((req,res,next) => {
//     console.log('Request made to /users');
//     next();
// })
router.use((req,res,next)=>{
    res.append('Access-Control-Allow-Origin',['*']);
    res.append('Access-Control-Allow-Headers',['*']);

    next();
})
router.use(cors());

router.get('/',async(req,res)=>{
    const results = await db.promise().query(`SELECT * FROM USERS`);
    res.status(200).send(results[0]);
})


router.post('/login',(req,res)=>{
    const { number } = req.body;
    if(number)
    {
        try{
            db.promise().query(`INSERT INTO USERS(number) VALUES('${number}')`);
            res.status(200).send('Success');
            
        }
        catch(e){
            
            console.log(e);
            res.status(404).send('Error');
        }
    }
    
})

module.exports= router;
