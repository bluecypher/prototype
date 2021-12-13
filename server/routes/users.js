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
router.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Headers', ['*']);

    next();
})
router.use(cors());

const checkToken = async (req, res, next) => {
    try {
        const cookies = JSON.parse(req.query.Cookies);
        // console.log(cookies['token'])
        const jwt = cookies['token'];
        const results = await db.promise().query(`SELECT jwt FROM USERS WHERE number='${req.query.number}'`);
        // console.log('reslt: ',results[0][0]['jwt']);
        if (results[0][0]['jwt'] === jwt) {
            // console.log('jwt succes')
            next();
        }
        else {
            res.status(404).send('Invalid access token');
        }
    }
    catch (e) {

        console.log('err: ', e)

    }

}

router.get('/getData', checkToken, async (req, res) => {
    // console.log('params:',req.query.number)
    const results = await db.promise().query(`SELECT * FROM USERS WHERE number='${req.query.number}'`);
    res.status(200).send(results[0]);
})


router.post('/login', async (req, res) => {
    const { number } = req.body;

    if (number) {
        const result = await db.promise().query(`SELECT number FROM USERS WHERE number='${number}'`);
        // console.log('result: ',result[0][0]);
        const jwToken = jwt.sign({ id: number }, 'Thisisasecretkeyforgeneratingjwt');
        if (!result[0][0]) {

            try {
                db.promise().query(`INSERT INTO USERS(number,jwt) VALUES('${number}','${jwToken}')`);
                
                res.status(200).send({
                    jwToken: jwToken,
                    res: 'success'
                });

            }
            catch (e) {

                console.log(e);
                res.status(404).send('Error');
            }
        }
        else {
            try {
                db.promise().query(`UPDATE USERS SET jwt='${jwToken}' WHERE number='${number}'`);
                
                res.status(200).send({
                    jwToken: jwToken,
                    res: 'success'
                });

            }
            catch (e) {

                console.log(e);
                res.status(404).send('Error');
            }
        }
    }

})
router.get('/logout', (req, res) => {
    const number = req.query.number;
    
    db.promise().query(`UPDATE USERS SET jwt=NULL WHERE number='${number}'`);
    res.status(200).send('success');

})
router.post('/updateDetails', (req, res) => {
    const { name, number, img, addr, locality, city, pin, area, service, hghlts } = req.body;
    if (number) {
        try {
            db.promise().query(`UPDATE USERS SET name='${name}',img='${img}',addr='${addr}',locality='${locality}',city='${city}',pin='${pin}',area='${area}',service='${service}',hghlts='${hghlts}' WHERE number='${number}' `);
            res.status(200).send('Success');

        }
        catch (e) {

            console.log(e);
            res.status(404).send('Error');
        }
    }

})

module.exports = router;
