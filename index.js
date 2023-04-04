const express = require('express');
const { connection } = require('./db');
require('dotenv').config();
const { userRouter } = require('./routes/userRoutes');
const { authenticate } = require('./middlewares/authenticate.middleware');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');

const app = express();
app.use(express.json());
// app.use(cors());

// app.use(bodyParser.json());

app.use('/users', userRouter);
app.use(authenticate);

app.listen(process.env.PORT, async() => {
    try{
        await connection
        console.log('Connected to DB');
    }
    catch(err){
        console.log("err");
    }
    console.log('listening on port ' + process.env.PORT);
})