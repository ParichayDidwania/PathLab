const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

const home = require('./routes/home');

app.use(cors({
    origin:  "*"
}))
app.use('/', home);

app.listen(port);