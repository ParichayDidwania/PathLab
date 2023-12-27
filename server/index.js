const express = require("express");
const cors = require("cors");
const multer = require("multer");
require('dotenv').config();

const app = express();
const port = 3001;
const connectDB = require("./mongoConnection");
const upload = multer({ storage: multer.memoryStorage() });

const home = require('./routes/home');
const file = require('./routes/file');

async function start() {
    connectDB();
    app.use(cors({
        origin:  "*"
    }))

    app.use('/', home);
    app.use('/file', upload.single("file"), file);
    
    app.listen(port);
} 

start();