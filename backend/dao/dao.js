const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
// const { download } = require("express/lib/response");

const getconnection = () => {
    const con = mysql.createConnection({
        host: "localhost",
        user: 'root',
        password: '12Mysql@34',
        database: "sahayak",
    });
    return con;
};

// const checkToken = (number) => {
//     return new Promise((resolve, reject) => {
//         const db = getconnection();

//         db.query("Select jwt from users where number=?", [number], (err, row) => {
//             if (!err) {

//                 resolve(row[0].jwt);
//             } else {

//                 reject(err);
//             }
//         });
//         db.end();
//     });
// };

const getData = (number) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        db.query("SELECT spm.user_mast_id,spm.email,spm.phone,spm.first_name,spm.last_name,spm.photo,spm.address1,spm.address2,spm.city,spm.pin,spm.state,spm.locality_of_work,spm.highlights,em.ent_name AS enterprise,spm.user_type,em.ent_logo AS ent_logo,spm.enterprise_id AS ent_id,em.ent_vpa AS vpa FROM service_provider_master spm INNER JOIN enterprise_master em ON spm.enterprise_id=em.ent_id WHERE phone =?", [number], (err, row) => {
            if (!err) {
                resolve(row);
                console.log(row[0]);
            } else reject(err);
        });
        db.end();
    });

};



const login_new = (number) => {
    return new Promise((resolve, reject) => {
        const jwToken = jwt.sign({ id: number }, 'Thisisasecretkeyforgeneratingjwt');
        const db = getconnection();
        db.query(
            "SELECT status FROM service_provider_master WHERE phone=?",
            [number],
            (err, row) => {

                if (row && row.length) {
                    try {
                        console.log('update');


                        resolve({
                            jwToken: jwToken,
                            res: "success",
                            status: row[0].status
                        });
                    } catch (e) {
                        console.log(e);
                        reject(e);
                    }
                } else {
                    try {
                        console.log('insert');


                        resolve({
                            jwToken: jwToken,
                            res: "success",
                            exists: false
                        });
                    } catch (e) {
                        console.log(e);
                        reject(e);
                    }
                }
            }
        );

        db.end();
    });
};

const updateDetails = (data) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT user_mast_id,enterprise_id,user_type FROM service_provider_master WHERE phone=?",
            [data.number],
            (err, row) => {
                if (row && row.length) {
                    if (row[0].user_type === 'O') {
                        addServices(row[0].user_mast_id, data.services);
                        db.query("UPDATE enterprise_master SET ent_name=?,ent_logo=?,last_updated=? WHERE ent_id=?",
                            [
                                data.ent,
                                data.entLogo,
                                new Date(Date.now()),
                                row[0].enterprise_id,
                                
                            ], (err, res) => {
                                if (err) {

                                    reject(err);
                                }
                            })
                    }
                    db.query(
                        "UPDATE service_provider_master SET status=?,email=?,phone=?,first_name=?,last_name=?,address1=?,address2=?,city=?,pin=?,state=?,photo=?,locality_of_work=?,highlights=?,last_updated=? where phone =?",
                        [
                            'F',
                            data.email,
                            data.number,
                            data.fname,
                            data.lname,
                            data.addr1,
                            data.addr2,
                            data.city,
                            data.pin,
                            data.state,
                            data.img,
                            data.locality,
                            data.hghlts,
                            new Date(Date.now()),
                            data.number

                        ],
                        (err, res) => {
                            if (!err) {

                                // console.log("Data updated Successfully ", data.services);

                                resolve();
                            } else reject(err);
                        }
                    );
                }
                else {
                    db.query("INSERT INTO enterprise_master(ent_name,ent_logo,created_on,last_updated) VALUES(?,?,?,?)",
                        [
                            data.ent,
                            data.entLogo,
                            new Date(Date.now()),
                            new Date(Date.now())
                        ],
                        (err, res) => {
                            if (!err) {
                                db.query("INSERT INTO service_provider_master(status,email,phone,first_name,last_name,address1,address2,city,pin,state,photo,locality_of_work,highlights,user_type,enterprise_id,created_on,last_updated) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                    [
                                        'F',
                                        data.email,
                                        data.number,
                                        data.fname,
                                        data.lname,
                                        data.addr1,
                                        data.addr2,
                                        data.city,
                                        data.pin,
                                        data.state,
                                        data.img,
                                        data.locality,
                                        data.hghlts,
                                        'O',
                                        res.insertId,
                                        new Date(Date.now()),
                                        new Date(Date.now())
                                    ],
                                    (err, res) => {
                                        if (!err) {
                                            console.log("Data inserted Successfully ", res);
                                            addServices(res.insertId, data.services);

                                            resolve();
                                        } else reject(err);
                                    }
                                )

                            }
                            else {
                                reject(err);
                            }
                        })
                }
            })
        // db.end();

    });
};



const addServices = (user_id, serv_ids) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("DELETE FROM service_provider_detail WHERE user_mast_id=?", [
            user_id
        ],
            (err, row) => {
                if (!err) {
                    for (var i = 0; i < serv_ids.length; i++) {
                        db.query("INSERT INTO service_provider_detail(user_mast_id,serv_id,created_on,last_updated) VALUES(?,?,?,?)",
                            [
                                user_id,
                                serv_ids[i],
                                new Date(Date.now()),
                                new Date(Date.now())
                            ])
                    }
                    resolve();
                }
                else {
                    console.log(err);
                    reject(err);
                }
            })

        // db.end();
    });

};
const addMembers = (name, number, pNumber, ent_id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        db.query("SELECT user_mast_id,user_type FROM service_provider_master WHERE phone=?", [number], (err, row) => {
            if (row && row.length) {
                try {
                    if (err) {
                        console.log(err);
                        resolve("error");
                    }
                    else {
                        // if (row[0].user_type === 'M') {
                        //     console.log("row[0].user-mast_id: ", row[0].user_mast_id)

                        //     mapOwnertoTeam(name, pNumber, number, row[0].user_mast_id);

                        //     resolve("success");
                        // }
                        // else {
                        //     resolve("user_is_owner")
                        // }
                        resolve("user_exists");
                    }
                } catch (err) {
                    console.log(err);
                    reject("err");
                }
            } else {
                db.query("INSERT INTO service_provider_master(first_name,status,phone,user_type,enterprise_id,created_on,last_updated) VALUES(?,?,?,?,?,?,?)", [
                    name,
                    'U',
                    number,
                    'M',
                    ent_id,
                    new Date(Date.now()),
                    new Date(Date.now())
                ], (err, row) => {
                    if (!err) {
                        console.log('insert member ', row)
                        db.query("SELECT spd.serv_id FROM service_provider_detail spd INNER JOIN service_provider_master spm USING(user_mast_id) WHERE spm.phone=?", [pNumber], (err, prow) => {
                            let servIds = [];
                            prow.forEach(element => {
                                servIds.push(element.serv_id);
                            });

                            addServices(row.insertId, servIds);
                        })
                        mapOwnertoTeam(name, pNumber, number, row.insertId);
                    }
                    else {
                        console.log(err);
                        resolve(err.sqlMessage);
                    }
                    resolve("success");
                });

                // console.log("No Such User Exists");
            }
        });
        // db.end();
    });
};

const mapOwnertoTeam = (name, pNumber, number, member_id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT user_mast_id FROM service_provider_master WHERE phone=?", [
            pNumber
        ],
            (err, row) => {
                if (row && row.length) {
                    try {
                        db.query("INSERT INTO service_provider_team_detail(owner_id,team_member_id,status,team_member_phone,team_member_first_name,created_on,last_updated) VALUES(?,?,?,?,?,?,?)", [
                            row[0].user_mast_id,
                            member_id,
                            'A',
                            number,
                            name,
                            new Date(Date.now()),
                            new Date(Date.now())
                        ])
                        resolve();
                    }
                    catch (err) {
                        console.log('error in om mapping');
                        reject(err);

                    }
                }
                if (err) {
                    reject(err);
                }
            })
        // db.end();
    });
};

const getMembers = (id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT team_member_id AS memberId, team_member_first_name AS name,team_member_phone AS number FROM service_provider_team_detail WHERE owner_id=?", [id], (err, row) => {
            if (!err) {
                resolve(row);
                // console.log(row);
            } else reject(err);
        });
        db.end();
    });
};

const getServices = () => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("select serv_id,serv_name from service_master", (err, row) => {
            if (!err) {
                resolve(row);
                // console.log(row);
            } else reject(err);
        });
        db.end();
    });
};

const deleteMembers = (oID, tID) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        db.query("DELETE FROM service_provider_team_detail WHERE owner_id=? AND team_member_id=?", [
            oID,
            tID,
        ],
            (err, res) => {
                if (!err) {
                    resolve("success");
                }
                else {
                    reject(err);
                }
            });


        db.end();
    });
};

const addCustomers = (name, number, id, add) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        db.query("INSERT INTO service_provider_customer_master(user_mast_id,cust_phone,cust_name,address1,created_on,last_updated) VALUES(?,?,?,?,?,?)", [
            id,
            number,
            name,
            add,
            new Date(Date.now()),
            new Date(Date.now())
        ], (err, row) => {
            if (!err) {
                console.log('Added customer');
                resolve("Success");

            }
            else {
                console.log('ins cust error', err)
                resolve(err);
            }

        });
        db.end();
    });
};

const getCustomersList = (id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT cust_mast_id AS custId, cust_name AS name,cust_phone AS number,address1 FROM service_provider_customer_master WHERE user_mast_id=?", [id], (err, row) => {
            if (!err) {
                resolve(row);
                // console.log(row);
            } else {
                console.log(err);
                reject(err);
            }
        });
        db.end();
    });
};

const addWork = (spId, custId, date, todos, servId, asgnTo) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        console.log(date);
        db.query("INSERT INTO service_provider_work_list(service_provider_id,work_type,work_plan_date,cust_mast_id,work_desc,assign_to,status,created_on,last_updated) VALUES(?,?,?,?,?,?,?,?,?)", [
            spId,
            servId,
            new Date(date),
            custId,
            todos,
            asgnTo ? asgnTo : spId,
            'O',
            new Date(Date.now()),
            new Date(Date.now())
        ], (err, row) => {
            if (!err) {

                resolve("Success");
            }
            else {
                console.log('error add work:', err);
                reject(err);
            }
        }
        );

    });
};

const getTodaysWork = (id, date) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        const dateObj = new Date(date);

        // console.log('typeof', dateObj)
        db.query("SELECT spwl.work_list_id AS work_id, spcm.cust_name AS name, spcm.address1 AS addr, spcm.cust_phone, spwl.status, spwl.work_plan_date AS callDate, spwl.work_comp_date AS compDate, spwl.assign_to AS user_id, sm.serv_name FROM service_provider_work_list spwl INNER JOIN service_provider_customer_master spcm USING(cust_mast_id) INNER JOIN service_provider_master spm ON spwl.assign_to=spm.user_mast_id INNER JOIN service_master sm ON spwl.work_type=sm.serv_id WHERE (spwl.service_provider_id=? OR spwl.assign_to=?) AND (DATE(spwl.work_plan_date)=DATE(?) OR DATE(spwl.work_comp_date)=DATE(?))", [id, id, dateObj,dateObj], (err, row) => {
            if (!err) {
                console.log('row', row);
                resolve(row);
                // console.log(row);
            } else {
                console.log('err', err);
                reject(err);
            }
        });
        db.end();
    });
};

const updateWork = (workId, name, serv, amnt, wDetails, pmtMethod, nxtDate, nxtWork, wrnt, custId, spId, servId, date, todos, asgnTo) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        if (pmtMethod) {
            db.query("UPDATE service_provider_work_list SET work_desc=?,payment_mode=?,amount=?,gaurantee=?,work_comp_date=?,last_updated=?,status=? WHERE work_list_id=?", [

                wDetails,
                pmtMethod[0],
                parseFloat(amnt),
                wrnt,
                new Date(Date.now()),
                new Date(Date.now()),
                'C',
                workId
            ], (err, row) => {
                if (!err) {
                    db.query("SELECT service_provider_id,cust_mast_id,assign_to FROM service_provider_work_list WHERE work_list_id=?", [workId]
                        , ((err, row) => {
                            if (!err) {
                                // console.log('result',row[0]);
                                console.log('update work')
                                if (nxtDate) {
                                    addWork(row[0].service_provider_id, row[0].cust_mast_id, nxtDate, nxtWork,serv,row[0].assign_to);
                                }
                            }
                            else {
                                console.log('error', err);
                                reject(err);
                            }
                        }));


                    resolve("Success");
                }
                else {
                    console.log('error add work:', err);
                    reject(err);
                }
            }
            );
        }
        else {
            db.query("UPDATE service_provider_work_list SET service_provider_id=?,work_type=?,work_plan_date=?,cust_mast_id=?,work_desc=?,assign_to=?,last_updated=?,status=? WHERE work_list_id=?", [
                spId,
                servId,
                new Date(date),
                custId,
                todos,
                asgnTo,
                new Date(Date.now()),
                'O',
                workId
            ], (err, row) => {
                if (!err) {
                    console.log('edit call')
                    resolve("Success");
                }
                else {
                    console.log('edit call error', err);
                    reject(err);
                }
            }
            );
        }
        // db.end();
    });
};

const getUserServices = (id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT sm.serv_id,sm.serv_name FROM service_master sm INNER JOIN service_provider_detail spd ON sm.serv_id=spd.serv_id WHERE spd.user_mast_id=?", [
            id
        ],
            (err, row) => {
                if (!err) {
                    console.log(row);
                    resolve(row);

                } else reject(err);
            });
        db.end();
    });
};

const getWorkDetails = (workId) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT spcm.cust_name,spcm.cust_phone,sm.serv_name,spwl.work_desc,spwl.work_type,spwl.cust_mast_id,spwl.assign_to,spwl.work_plan_date,spwl.gaurantee,spwl.payment_mode,spwl.amount,spwl.work_type AS serv_id,spm.first_name FROM service_provider_work_list spwl INNER JOIN service_master sm ON spwl.work_type=sm.serv_id INNER JOIN service_provider_customer_master spcm ON spwl.cust_mast_id=spcm.cust_mast_id Inner Join service_provider_master spm ON spm.user_mast_id=spwl.assign_to WHERE spwl.work_list_id=?", [
            workId
        ],
            (err, row) => {
                if (!err) {
                    console.log('work Details:',row);


                    resolve(row);

                } else reject(err);
            });
        db.end();
    });
};

const getPaymentDetails = (id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT user_type FROM service_provider_master WHERE user_mast_id=?", [
            id
        ],
            (err, row) => {
                if (!err) {
                    console.log(row);
                    if (row[0].user_type === 'O') {
                        resolve(getQRCode(id));
                    }
                    else {
                        db.query("SELECT owner_id FROM service_provider_team_detail WHERE team_member_id=?", [
                            id
                        ],
                            (err, row) => {
                                if (!err) {
                                    console.log('ownerid', row);
                                    resolve(getQRCode(row[0].owner_id));
                                }
                                else {
                                    reject(err);
                                }
                            });
                    }
                }
                else {
                    reject(err)
                }
            });
        // db.end();
    });
};

const getAmount = (id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT amount FROM service_provider_work_list WHERE work_list_id=?", [
            id
        ],
            (err, row) => {
                if (!err) {
                    console.log(row);
                    resolve(row);
                }
                else {
                    reject(err);
                }
            }
        );
    });
}

const getQRCode = (id) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT qr_code,phone FROM service_provider_master WHERE user_mast_id=?", [
            id
        ],
            (err, row) => {
                if (!err) {
                    resolve([row[0].qr_code, row[0].phone]);
                }
                else {
                    reject(err);
                }
            });
        // db.end();
    });
}

const uploadQR = (id, vpa) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("UPDATE service_provider_master SET qr_code=?,last_updated=? WHERE user_mast_id=?", [
            vpa,
            new Date(Date.now()),
            id
        ],
            (err, row) => {
                if (!err) {
                    console.log('qr row', row)
                    db.query("UPDATE enterprise_master SET ent_vpa=?,last_updated=? WHERE ent_id=(SELECT enterprise_id FROM service_provider_master WHERE user_mast_id=?)", [
                        vpa,
                        new Date(Date.now()),
                        id
                    ],
                        (err, row) => {
                            if (!err) {
                                console.log('qr row', row)
                                
                                resolve("Success");
                            }
                            else {
                                console.log('qr err', err)
                                reject(err);
                            }
                        });
                    
                }
                else {
                    console.log('qr err', err)
                    reject(err);
                }
            });
        // db.end();
    });
}

const getCustomerInfo = (spId, custId) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query('SELECT cust_name as name,cust_phone as number,address1 as add1 FROM service_provider_customer_master WHERE cust_mast_id=? AND user_mast_id=?', [
            custId,
            spId
        ], (err, row) => {
            if (!err) {
                console.log('cust details', row);
                resolve(row);
            }
            else {
                reject(err);
            }
        })
        db.end();
    })
}

const getCustomerWork = (spId, custId) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query('SELECT spwl.work_list_id,spwl.work_plan_date as plan, spwl.work_desc, sm.serv_name FROM service_provider_work_list spwl INNER JOIN service_master sm ON spwl.work_type=sm.serv_id WHERE spwl.cust_mast_id=? AND spwl.service_provider_id=? AND Date(spwl.work_plan_date)>=curdate()', [
            custId,
            spId
        ], (err, row) => {
            if (!err) {
                console.log('cust details', row);
                resolve(row);
            }
            else {
                reject(err);
            }
        })
        db.end();
    })
}

const getCustomerWorkHistory = (spId, custId) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query('SELECT spwl.work_list_id,spwl.work_plan_date as plan, spwl.work_desc, sm.serv_name, spwl.amount AS amnt, spwl.payment_mode AS mode FROM service_provider_work_list spwl INNER JOIN service_master sm ON spwl.work_type=sm.serv_id WHERE spwl.cust_mast_id=? AND spwl.service_provider_id=? AND work_comp_date IS NOT NULL', [
            custId,
            spId
        ], (err, row) => {
            if (!err) {
                console.log('cust details', row);
                resolve(row);
            }
            else {
                reject(err);
            }
        })
        db.end();
    })
}

const workDoneToday = (id,date) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        const dateObj = new Date(date);

        db.query('SELECT amount AS amnt, payment_mode AS mode, assign_to, sm.serv_id, sm.serv_name FROM service_provider_work_list spwl INNER JOIN service_master sm ON spwl.work_type=sm.serv_id WHERE (spwl.service_provider_id=? OR spwl.assign_to=?) AND Date(work_comp_date)=Date(?)', [
            id,
            id,
            dateObj
        ], (err, row) => {
            if (!err) {

                resolve(row);
            }
            else {
                reject(err);
            }
        })
        db.end();
    })
}

const workDoneMonthly = (id,date) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        const dateObj = new Date(date);
        db.query('SELECT amount AS amnt, payment_mode AS mode, assign_to, sm.serv_id, sm.serv_name FROM service_provider_work_list spwl INNER JOIN service_master sm ON spwl.work_type=sm.serv_id WHERE (spwl.service_provider_id=? OR spwl.assign_to=?) AND (MONTH(work_comp_date)=MONTH(?) AND YEAR(work_comp_date)=YEAR(?))', [
            id,
            id,
            dateObj,
            dateObj
        ], (err, row) => {
            if (!err) {

                resolve(row);
            }
            else {
                reject(err);
            }
        })
        db.end();
    })
}

const getUserType = (number) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query('SELECT user_type, first_name FROM service_provider_master WHERE phone=?', [
            number
        ], (err, row) => {
            if (!err) {
                console.log('getusertype', row);
                resolve(row[0]);
            }
            else {
                reject(err);
            }
        })
        db.end();
    })
}
const deleteCustomers = (oID, tID) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        db.query("DELETE FROM service_provider_customer_master WHERE user_mast_id=? AND cust_mast_id=?",
            [oID, tID,],
            (err, row) => {
                if (!err) {
                    console.log(row);
                    resolve("success");
                }
                else {
                    console.log(err);
                    reject(err);
                }
            });


    });
};

const editMembers = (id, name, number) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        db.query("UPDATE service_provider_master SET first_name=?,phone=? WHERE user_mast_id=?",
            [ name, number,id],
            (err, row) => {
                if (!err) {
                    console.log(row);
                    db.query("UPDATE service_provider_team_detail SET team_member_first_name=?,team_member_phone=? WHERE team_member_id=?",
                        [ name, number, id],
                        (err, row) => {
                            if (!err) {
                                console.log(row);

                                resolve("success");
                            }
                            else {
                                console.log(err);
                                resolve(err.sqlMessage);
                            }
                        });

                   
                }
                else {
                    console.log(err);
                    resolve(err.sqlMessage);
                }
            });


    });
};

const editCustomers = (id, name, number,add) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();

        db.query("UPDATE service_provider_customer_master SET cust_name=?,cust_phone=?,address1=? WHERE cust_mast_id=?",
            [ name, number,add,id],
            (err, row) => {
                if (!err) {
                    console.log(row);
                    resolve("success");
                   
                }
                else {
                    console.log(err);
                    resolve(err);
                }
            });


    });
};

const getComplaints = () => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("select sf.cid as id,sf.type, sf.desc from service_feedback sf", (err, row) => {
            if (!err) {
                resolve(row);
            }
            else reject(err);
        })

        
    });
};

const postFeedback = (selected, value, flag, workId) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();


        db.query("update service_provider_work_list set feedback=?,rating=?,status=? where work_list_id=?", [selected, value, flag, workId], (err, row) => {
            if (!err) {
                console.log('postfeedback', row);
                resolve("success");
            }
            else {
                console.log('postfeedback error', err);
                reject(err);
            }
        })
        
    })
}

const getFeedbacks = (workId) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT feedback, rating FROM service_provider_work_list WHERE work_list_id=?",[workId], (err, row) => {
            if (!err) {
                resolve(row);
            }
            else reject(err);
        })

        
    });
};

const getCallbacks = (spId) => {
    return new Promise((resolve, reject) => {
        const db = getconnection();
        db.query("SELECT spwl.work_list_id AS work_id, spcm.cust_name AS name, spcm.address1 AS addr, spcm.cust_phone, spwl.work_comp_date AS callDate, spwl.assign_to AS user_id, sm.serv_name FROM service_provider_work_list spwl INNER JOIN service_provider_customer_master spcm USING(cust_mast_id) INNER JOIN service_provider_master spm ON spwl.assign_to=spm.user_mast_id INNER JOIN service_master sm ON spwl.work_type=sm.serv_id WHERE (spwl.service_provider_id=? OR spwl.assign_to=?) AND spwl.status=?",[spId, spId, 'N'], (err, row) => {
            if (!err) {
                resolve(row);
            }
            else reject(err);
        })

        
    });
};

module.exports = {
    getconnection,
    updateDetails,
    login_new,
    addMembers,

    getData,
    addServices,
    getServices,

    getMembers,
    deleteMembers,
    addCustomers,
    getCustomersList,
    addWork,
    getTodaysWork,
    updateWork,
    getUserServices,
    getWorkDetails,
    getPaymentDetails,
    uploadQR,
    getCustomerInfo,
    getCustomerWork,
    getCustomerWorkHistory,
    workDoneToday,
    workDoneMonthly,
    getUserType,
    deleteCustomers,
    getAmount,
    editMembers,
    editCustomers,
    getComplaints,
    postFeedback,
    getFeedbacks,
    getCallbacks
};
