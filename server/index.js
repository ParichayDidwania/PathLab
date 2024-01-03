const express = require("express");
const cors = require("cors");
const multer = require("multer");
const AdminMailer = require("./helpers/adminMailer");
require('dotenv').config();

const app = express();
const port = 3001;
const connectDB = require("./mongoConnection");
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

const home = require('./routes/home');
const file = require('./routes/file');
const auth = require('./routes/auth');
const cart = require('./routes/cart');
const ProductCatalogue = require("./helpers/productCatalogue");

async function start() {
    connectDB();
    AdminMailer.init();
    ProductCatalogue.init();
    app.use(cors({
        origin:  "*"
    }))

    app.use('/', home);
    app.use('/file', upload.single("file"), file);
    app.use('/auth', auth);
    app.use('/cart', cart);
    
    app.listen(port);
} 

start();