const CONSTANTS = require('../constants/constants');
const UserModel = require('../schemas/user');

async function authMiddleWare(req, res, next) {
    const authToken = req.headers["x-auth-token"];
    const doc = await UserModel.validateAuthToken(authToken);

    if(doc && doc.type == CONSTANTS.USER_TYPE.ADMIN) {
        req.user = doc;
        next();
    } else {
        res.status(400).send({ error: "Auth Token is invalid" });
    }
}

module.exports = authMiddleWare;

