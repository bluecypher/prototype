const mysql = require('mysql2');

module.exports = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'12Mysql@34',
        database:'sahayak'
    }
)