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

const authMiddleWare = require('./middlewares/authMW');

const home = require('./routes/home');
const file = require('./routes/file');
const auth = require('./routes/auth');
const cart = require('./routes/cart');
const booking = require('./routes/booking');
const details = require('./routes/details');
const cashfree = require('./routes/cashfree');
const ProductCatalogue = require("./helpers/productCatalogue");

async function start() {
    await connectDB();
    AdminMailer.init();
    ProductCatalogue.init();
    app.use(cors({
        origin:  "*"
    }))

    app.use('/', home);
    app.use('/file', upload.single("file"), file);
    app.use('/auth', auth);
    app.use('/cart', cart);
    app.use('/booking', authMiddleWare, booking);
    app.use('/cashfree', cashfree);
    app.use('/details', authMiddleWare, details);
    
    app.listen(port);
} 

start();