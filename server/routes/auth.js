const express = require('express');
const UserModel = require('../schemas/user');
const router = express.Router();
const HelperClass = require('../helpers/helper');
const AdminMailer = require('../helpers/adminMailer');
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../constants/constants');

router.post('/register', async (req, res) => {
    try {
        const generatedLink = HelperClass.generateRandomString(40);
        await AdminMailer.sendMail({
            subject: "PathLab Account Activation",
            text: `Please click on the following link to activate your pathlab account ${process.env.WEBSITE_URL}/activate/${generatedLink}`,
            email: req.body.email
        })
        await UserModel.addUser(req.body, generatedLink);
        res.send({ message: "success" });
    } catch (err) {
        if(err.name === 'MongoServerError' && err.code === 11000) {
            res.status(400).send({ error: "Username already exists, please choose a different username" });
        } else {
            res.status(500).send({ error: "Internal Server Error" });
        }
    }
})

router.get('/activate/:id', async (req, res) => {
    const doc = await UserModel.findInactiveAccountByActivationId(req.params.id);
    if(doc) {
        await UserModel.activateAccount(doc.email);
        res.send({ message: "success" });
    } else {
        res.status(400).send({ error: "The link has been used already or is expired" });
    }
})

router.post('/login', async(req, res) => {
    const doc = await UserModel.findByEmail(req.body.email);

    if(!doc) {
        res.status(400).send({ error: "No account is linked with provided email" });
        return;
    }

    if(!bcrypt.compareSync(req.body.password, doc.password)) {
        res.status(400).send({ error: "Password is incorrect" });
        return;
    }

    let authToken = "";
    if(!doc.authToken) {
        authToken = HelperClass.generateRandomString(40);
        await UserModel.setAuthToken(doc.email, authToken);
    } else {
        authToken = doc.authToken;
    }

    res.send({ message: "success", data: {
        name: doc.name,
        authToken: authToken,
        isAdmin: doc.type == CONSTANTS.USER_TYPE.ADMIN
    }})
})

router.get('/authToken', async (req, res) => {
    const authToken = req.headers["x-auth-token"];
    const doc = await UserModel.validateAuthToken(authToken);

    if(doc) {
        res.send({ message: "success", data: {
            name: doc.name,
            authToken: doc.authToken,
            isAdmin: doc.type == CONSTANTS.USER_TYPE.ADMIN
        }})
    } else {
        res.status(400).send({ error: "Auth Token is invalid" });
    }
})

module.exports = router;
