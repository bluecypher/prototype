const express = require("express");
const router = express.Router();
const dao = require("../dao/dao");
const multer = require('multer');
const upload = multer();
const axios = require("axios");
const CryptoJS = require("crypto-js");



// const checkToken = (req, res, next) => {
//     // console.log("Checking Token: ", req.query);
//     const cookies = JSON.parse(req.query.Cookies);
//     const number = req.query.number;
//     const jwt = cookies["token"];

//     if(number && cookies)
//     {

//     // console.log(jwt, " ");
//     dao.checkToken(number).then((resp) => {
//         if (resp === jwt) {
//             next();
//         }
//         else {
//             res.status(200).send('InvalidToken');
//         }
//     })
//    }
//    else{
//        res.status(200).send('Empty_Request');
//    }
// }

router.get("/getData", (req, res) => {
    const number = req.query.number;
    dao.getData(number).then((resp) => {
        console.log("Getting Data", resp)
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })
})

router.get("/getServices", (req, res) => {
    const number = req.query.number;

    dao.getServices().then((resp) => {
        var result = new Object();
        console.log("Getting Services")
        result.services = resp;
        dao.getUserType(number).then((resp) => {
            result.userType = resp;
            console.log("result", result);
            res.status(200).send(result);
        })

    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })
})

router.post("/login", (req, res) => {

    const number = req.body.number;
    console.log(number);
    if (number) {
        dao.login_new(number).then(
            (resp) => {
                console.log('message: ', resp)
                res.status(200).send(resp);
            }).catch((err) => {
                console.log(err);
                res.status(404).send(err);
            })
    }
})



router.post("/updateDetails", (req, res) => {
    const data = req.body;
    // console.log('files:',req.file);
    console.log('body', req.body);
    if (data.number) {
        dao.updateDetails(data).then((resp) => {

            console.log("Data Inserted successfully", resp);
            res.status(200).send("Success");
        }).catch((err) => {
            console.log(err);
            res.status(404).send("Error")
        })
    }
    // res.status(200).send("testing");
})




router.post("/addMembers", (req, res) => {
    const number = req.body.number;
    const pNumber = req.body.pNumber;
    const name = req.body.name;
    const ent_id = req.body.ent_id;

    if (pNumber) {
        dao.addMembers(name, number, pNumber, ent_id).then((resp) => {
            console.log("Members details updated", resp)
            // if(resp === "success")
            // {
            //         axios.post("https://api.msg91.com/api/v5/flow/", {
            //             "flow_id": "6283774ee1c07d702138b3f4",
            //             "mobiles": `91${number}`,
            //             "name": "Raju",
            //             "servname":"AC",
            //             "dt":"17/05/2022",
            //             "url":"http://sahayakscom"
            //     },
            //         {
            //             headers: {
            //                 // "Content-Type": "application/json",
            //                 // "Access-Control-Allow-Origin": true,
            //                 "authkey": "375887AvOeC9dKi625e4a8cP1",
            //             }
            //         },
            //     )
            //         .then((res) => {
            //             console.log("OTP success");

            //         })
            //         .catch((err) => {
            //             console.log("OTP error", err);
            //         })
            // }
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }



});

router.get("/getMembers", (req, res) => {
    const id = req.query.id;

    dao.getMembers(id).then((resp) => {
        console.log("Getting Members")
        res.status(200).send(resp);
    }).catch((err) => {
        console.log("Error", err)
        res.status(404).send({ "Error": err });
    })


})

router.post("/deleteMembers", (req, res) => {
    const oID = req.body.parent_id;
    const tID = req.body.member_id;
    dao.deleteMembers(oID, tID).then((resp) => {
        console.log("Deleting Members")
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })


})

router.post("/addCustomers", (req, res) => {
    const number = req.body.number;
    const id = req.body.id;
    const name = req.body.name;
    const add = req.body.add;

    if (id) {
        dao.addCustomers(name, number, id, add).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/getCustomersList", (req, res) => {
    const id = req.body.id;
    if (id) {
        console.log('here')
        dao.getCustomersList(id).then((resp) => {
            console.log("Getting Customers")
            res.status(200).send(resp);
        }).catch((err) => {
            console.log("Error", err)
            res.status(404).send({ "Error": err });
        })
    }


});

router.post("/addWork", (req, res) => {
    const custId = req.body.custId;
    const spId = req.body.spId;
    const servId = req.body.servId;
    const date = req.body.date;
    const todos = req.body.todos;
    const asgnTo = req.body.asgnTo;

    if (spId && custId) {
        dao.addWork(spId, custId, date, todos, servId, asgnTo).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/getTodaysWork", (req, res) => {
    const spId = req.body.id;
    const date = req.body.date;

    if (spId && date) {
        console.log(date)
        dao.getTodaysWork(spId, date).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send(err);
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/updateWork", (req, res) => {
    const workId = req.body.workId;
    const name = req.body.name;
    const spName = req.body.spName;
    const custPhone = req.body.custPhone;
    const serv = req.body.serv;
    const servName = req.body.servName;
    const wrnt = req.body.wrnt;
    const amnt = req.body.amnt;
    const wDetails = req.body.wDetails;
    const pmtMethod = req.body.pmtMethod;
    const nxtDate = req.body.nxtDate;
    const nxtWork = req.body.nxtWork;

    const custId = req.body.custId;
    const spId = req.body.spId;
    const servId = req.body.servId;
    const date = req.body.date;
    const todos = req.body.todos;
    const asgnTo = req.body.asgnTo;

    if (workId) {
        dao.updateWork(workId, name, serv, amnt, wDetails, pmtMethod, nxtDate, nxtWork, wrnt, custId, spId, servId, date, todos, asgnTo).then((resp) => {
            if (resp === "Success") {
                const baseWorkId = Buffer.from(workId).toString('base64');
                console.log('cipher', baseWorkId);
                const originalText = Buffer.from(baseWorkId, "base64").toString();

                console.log('original', originalText);
                let dt = new Date().toDateString();
                dt = dt.slice(4);
                let tm = new Date().toLocaleTimeString();
                tm = `${tm.slice(0, -6)} ${tm.slice(-2)}`;
                dt = `${dt} ${tm}`;
                console.log('date', dt, 'teim', tm);
                const link = `https://sahayaks.com/feedback/${baseWorkId}`;
                axios.post("https://api.msg91.com/api/v5/flow/", {
                    "flow_id": "6283774ee1c07d702138b3f4",
                    "mobiles": `91${custPhone}`,
                    "name": spName,
                    "servname": servName,
                    "dt": dt,
                    "url": link
                },
                    {
                        headers: {
                            "authkey": "375887AvOeC9dKi625e4a8cP1",
                        }
                    },
                )
                    .then((res) => {
                        console.log("OTP success");

                    })
                    .catch((err) => {
                        console.log("OTP error", err);
                    })

            }
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/getUserServices", (req, res) => {
    id = req.body.id;
    dao.getUserServices(id).then((resp) => {
        console.log("Getting Services", resp)
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })
})

router.post("/getWorkDetails", (req, res) => {
    const workId = req.body.workId;


    if (workId) {

        dao.getWorkDetails(workId).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            console.log(err)
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/getPaymentDetails", (req, res) => {
    const id = req.body.id;


    if (id) {

        dao.getPaymentDetails(id).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/uploadQR", (req, res) => {
    const id = req.body.id;
    const vpa = req.body.vpa;

    if (id && vpa) {

        dao.uploadQR(id, vpa).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send(err);
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/getCustomerDetails", (req, res) => {
    const spId = req.body.spId;
    const custId = req.body.custId;
    if (spId && custId) {
        var result = new Object();
        dao.getCustomerInfo(spId, custId).then((resp) => {
            // console.log("Getting Customers")
            result.info = resp;
            dao.getCustomerWork(spId, custId).then((resp) => {
                // console.log("Getting Customers")
                result.work = resp;
                dao.getCustomerWorkHistory(spId, custId).then((resp) => {
                    // console.log("Getting Customers")
                    result.history = resp;
                    console.log("customer details:", result)
                    res.status(200).send(result);

                }).catch((err) => {
                    console.log("Error", err)
                    res.status(404).send({ "Error": err });
                })


            }).catch((err) => {
                console.log("Error", err)
                res.status(404).send({ "Error": err });
            })


        }).catch((err) => {
            console.log("Error", err)
            res.status(404).send({ "Error": err });
        })
        dao.getCustomerWork(spId, custId).then((resp) => {
            // console.log("Getting Customers")
            result.work = resp;


        }).catch((err) => {
            console.log("Error", err)
            res.status(404).send({ "Error": err });
        })

    }


});

router.post("/workDoneToday", (req, res) => {
    const id = req.body.id;
    const date = req.body.date;

    if (id) {

        dao.workDoneToday(id, date).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/workDoneMonthly", (req, res) => {
    const id = req.body.id;
    const date = req.body.date;

    if (id) {

        dao.workDoneMonthly(id, date).then((resp) => {

            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }



});

router.post("/deleteCustomers", (req, res) => {
    const oID = req.body.parent_id;
    const tID = req.body.member_id;
    dao.deleteCustomers(oID, tID).then((resp) => {
        console.log("Deleting Customers")
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })


})
router.post("/getAmount", (req, res) => {
    const id = req.body.id;
    if (id) {
        dao.getAmount(id).then((resp) => {
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }
});
router.post("/editMembers", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const number = req.body.number;
    if (id) {
        dao.editMembers(id, name, number).then((resp) => {
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }
});
router.post("/editCustomers", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const number = req.body.number;
    const add = req.body.add
    if (id) {
        dao.editCustomers(id, name, number, add).then((resp) => {
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }
});

router.post("/postFeedback", (req, res) => {
    const selected = req.body.selected;
    const value = req.body.rating;
    const workId = req.body.workId;
    const flag = req.body.flag
    if (workId) {
        dao.postFeedback(selected, value, flag, workId).then((resp) => {
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else {
        res.status(404).send('Not valid ID');
    }
});

router.get("/getComplaints", (req, res) => {


    dao.getComplaints().then((resp) => {
        console.log("Getting complaints")
        res.status(200).send(resp);
    }).catch((err) => {
        console.log("Error", err)
        res.status(404).send({ "Error": err });
    })


})

router.post("/getFeedbacks", (req, res) => {

    const workId = req.body.workId;
    if (workId) {
        dao.getFeedbacks(workId).then((resp) => {
            console.log("Getting Feedbacks")
            res.status(200).send(resp);
        }).catch((err) => {
            console.log("Error", err)
            res.status(404).send({ "Error": err });
        })
    }
    else {
        console.log("No work Id")
        res.status(404).send("No work Id");
    }


})

router.post("/getCallbacks", (req, res) => {

    const spId = req.body.spId;
    if (spId) {
        dao.getCallbacks(spId).then((resp) => {
            console.log("Getting Callbacks")
            res.status(200).send(resp);
        }).catch((err) => {
            console.log("Error", err)
            res.status(404).send({ "Error": err });
        })
    }
    else {
        console.log("No work Id")
        res.status(404).send("No work Id");
    }


})

router.post("/getLogin", (req, res) => {

    const number = req.body.number;
    if (number) {
        dao.getLogin(number).then((resp) => {
            console.log("Getting Login", resp);

            var result = new Object();
            result.otp = null;
            result.password = null;
            if (resp === "insert" || resp[0].password === null) {


                const temp = Math.floor(100000 + Math.random() * 900000).toString();
                const ciphertext = CryptoJS.AES.encrypt(temp, 'sahayak2').toString();
                result.otp = ciphertext;
                // result.resp = resp;

                //     axios.post("https://api.msg91.com/api/v5/flow/", {
                //         "flow_id": "6283736936461a612128aca6",
                //         "mobiles": `91${number}`,
                //         "otp": temp
                //     },
                //         {
                //             headers: {
                //                 // "Content-Type": "application/json",
                //                 // "Access-Control-Allow-Origin": true,
                //                 "authkey": "375887AvOeC9dKi625e4a8cP1",
                //             }
                //         },
                //     )
                //         .then((res) => {
                //             console.log("OTP success");

                //         })
                //         .catch((err) => {
                //             console.log("OTP error", err);
                //         })
            }
            else {
                result.password = resp[0].password;
            }

            console.log('resp update', result);
            res.status(200).send(result);


        }).catch((err) => {
            console.log("Error", err)
            res.status(404).send({ "Error": err });
        })
    }
    else {
        console.log("No number")
        res.status(404).send("No number");
    }


})

router.post("/setPIN", (req, res) => {

    const number = req.body.number;
    const pin = req.body.pin;
    if (number) {
        dao.setPIN(number, pin).then((resp) => {
            console.log("Set PIN")
            res.status(200).send("Success");
        }).catch((err) => {
            console.log("Error", err)
            res.status(404).send({ "Error": err });
        })
    }
    else {
        console.log("No number")
        res.status(404).send("No number");
    }


})

router.post("/saveToken", (req, res) => {
    const data = req.body.token;
    const id = req.body.id;
    // console.log('files:',req.file);
    console.log('body', req.body);
    if (data && id) {
        dao.saveToken(data, id).then((resp) => {

            console.log("Token Inserted successfully", resp);
            res.status(200).send("Success");
        }).catch((err) => {
            console.log(err);
            res.status(404).send("Error")
        })
    }
    // res.status(200).send("testing");
})
module.exports = router;
