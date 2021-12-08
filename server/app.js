const express = require('express');
const app = express();
const cors = require('cors');
const usersRoutes  = require('./routes/users');

var port=5000;


app.use((req,res,next)=>{
    res.append('Access-Control-Allow-Origin',['*']);
    res.append('Access-Control-Allow-Headers',['*']);

    next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/', (req, res) => {
    res.send('Hello2');
});


app.use('/users', usersRoutes);
app.listen(port, ()=>{
    console.log('server is running at port',port);
})