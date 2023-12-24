const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = 3001;
const connectDB = require("./mongoConnection");
const home = require('./routes/home');

async function start() {
    connectDB();
    app.use(cors({
        origin:  "*"
    }))
    app.use('/', home);
    
    app.listen(port);
} 

start();