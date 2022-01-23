const express = require("express");
const router = express.Router();
const dao = require("../dao/dao");



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

router.get("/getData",  (req, res) => {
    const number = req.query.number;
    dao.getData(number).then((resp) => {
        console.log("Getting Data")
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })
})

router.get("/getServices",  (req, res) => {
    const number = req.query.number;
    
    dao.getServices().then((resp) => {
        var result =new Object();
        console.log("Getting Services")
        result.services = resp;
        dao.getUserType(number).then((resp)=>{
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
                console.log('message: ',resp)
                res.status(200).send(resp);
            }).catch((err) => {
                console.log(err);
                res.status(404).send(err);
            })
    }
})



router.post("/updateDetails", (req, res) => {
    const data = req.body;
    if (data.number) {
        dao.updateDetails(data).then((resp) => {
            
            console.log("Data Inserted successfully",resp);
            res.status(200).send("Success");
        }).catch((err) => {
            console.log(err);
            res.status(404).send("Error")
        })
    }
})




router.post("/addMembers",  (req, res) => {
    const number = req.body.number;
    const pNumber = req.body.pNumber;
    const name = req.body.name;

    if (pNumber) {
        dao.addMembers(name, number, pNumber).then((resp) => {
            console.log("Members details updated")
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }



});

router.get("/getMembers",  (req, res) => {
    const id = req.query.id;
    
    dao.getMembers(id).then((resp) => {
        console.log("Getting Members")
        res.status(200).send(resp);
    }).catch((err) => {
        console.log("Error", err)
        res.status(404).send({ "Error": err });
    })


})

router.post("/deleteMembers",  (req, res) => {
    const oID = req.body.parent_id;
    const tID = req.body.member_id;
    dao.deleteMembers(oID,tID).then((resp) => {
        console.log("Deleting Members")
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })


})

router.post("/addCustomers",  (req, res) => {
    const number = req.body.number;
    const id = req.body.id;
    const name = req.body.name;
    const add = req.body.add;

    if (id) {
        dao.addCustomers(name, number, id,add).then((resp) => {
            
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/getCustomersList",  (req, res) => {
    const id = req.body.id;
    if(id)
    {
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

router.post("/addWork",  (req, res) => {
    const custId = req.body.custId;
    const spId = req.body.spId;
    const servId = req.body.servId;
    const date = req.body.date;
    const todos = req.body.todos;

    
    if (spId && custId) {
        dao.addWork(spId,custId,date,todos,servId).then((resp) => {
            
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/getTodaysWork",  (req, res) => {
    const spId = req.body.id;
    
    
    if (spId) {
        
        dao.getTodaysWork(spId).then((resp) => {
            
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/updateWork",  (req, res) => {
    const workId = req.body.workId;
    const name = req.body.name;
    const serv = req.body.serv;
    const wrnt = req.body.wrnt;
    const amnt = req.body.amnt;
    const wDetails = req.body.wDetails;
    const pmtMethod = req.body.pmtMethod;
    const nxtDate = req.body.nxtDate;
    const nxtWork = req.body.nxtWork;
    
    if (workId) {
        dao.updateWork(workId,name,serv,amnt,wDetails,pmtMethod,nxtDate,nxtWork,wrnt).then((resp) => {
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/getUserServices",  (req, res) => {
    id = req.body.id;
    dao.getUserServices(id).then((resp) => {
        console.log("Getting Services", resp)
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })
})

router.post("/getWorkDetails",  (req, res) => {
    const workId = req.body.workId;
    
    
    if (workId) {
        
        dao.getWorkDetails(workId).then((resp) => {
            
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/getPaymentDetails",  (req, res) => {
    const id = req.body.id;
    
    
    if (id) {
        
        dao.getPaymentDetails(id).then((resp) => {
           
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/uploadQR",  (req, res) => {
    const id = req.body.id;
    const qr = req.body.qr;
    
    if (id && qr) {
        
        dao.uploadQR(id,qr).then((resp) => {
            
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send(err);
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/getCustomerDetails",  (req, res) => {
    const spId = req.body.spId;
    const custId = req.body.custId;
    if(spId && custId)
    {
       var result =new Object();
    dao.getCustomerInfo(spId,custId).then((resp) => {
        // console.log("Getting Customers")
        result.info = resp;
        dao.getCustomerWork(spId,custId).then((resp) => {
            // console.log("Getting Customers")
            result.work = resp;
            dao.getCustomerWorkHistory(spId,custId).then((resp) => {
                // console.log("Getting Customers")
                result.history = resp;
                console.log("customer details:",result)
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
    dao.getCustomerWork(spId,custId).then((resp) => {
        // console.log("Getting Customers")
        result.work = resp;
        
        
    }).catch((err) => {
        console.log("Error", err)
        res.status(404).send({ "Error": err });
    })
    
}


});

router.post("/workDoneToday",  (req, res) => {
    const id = req.body.id;
    
    
    if (id) {
        
        dao.workDoneToday(id).then((resp) => {
            
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/workTillToday",  (req, res) => {
    const id = req.body.id;
    
    
    if (id) {
        
        dao.workTillToday(id).then((resp) => {
            
            res.status(200).send(resp);
        }).catch((err) => {
            res.status(404).send("Error");
        })
    }
    else{
        res.status(404).send('Not valid ID');
    }



});

router.post("/deleteCustomers",  (req, res) => {
    const oID = req.body.parent_id;
    const tID = req.body.member_id;
    dao.deleteCustomers(oID,tID).then((resp) => {
        console.log("Deleting Customers")
        res.status(200).send(resp);
    }).catch((err) => {
        res.status(404).send({ "Error": err });
    })


})
module.exports = router;
