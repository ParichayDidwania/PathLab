const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true, index: true },
    password: { type: String, require: true },
    activationId: { type: String },
    activated: { type: Boolean, default: false },
    authToken: { type: String }
}, { timestamps: true })

class UserModelClass {
    static async addUser(userObject, generatedLink) {
        await UserModel.create({
            name: userObject.name,
            email: userObject.email,
            password: userObject.password,
            activationId: generatedLink
        })
    }

    static async findInactiveAccountByActivationId(id) {
        const doc = UserModel.findOne({ activationId: id, activated: false });
        return doc;
    }

    static async activateAccount(email) {
        await UserModel.updateOne({ email: email }, { $set: { activated: true }, $unset: { activationId: "" } });
    }

    static async findByEmail(email) {
        return await UserModel.findOne({ email: email });
    }

    static async setAuthToken(email, authToken) {
        await UserModel.updateOne({ email: email }, { $set: { authToken: authToken } });
    }

    static async validateAuthToken(authToken) {
        return await UserModel.findOne({ authToken: authToken });
    }
}

UserSchema.loadClass(UserModelClass);
const UserModel = mongoose.model("user", UserSchema, "users");

module.exports = UserModel;