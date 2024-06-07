const nodemailer = require('nodemailer');

class AdminMailer {
    static __transport;

    static init() {
        AdminMailer.__transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'parichaydidwaniatest@gmail.com',
              pass: process.env.MAILER_KEY
            }
        });
    }

    static async sendMail({subject, text, email}) {
        const mailOptions = {
            from: 'parichaydidwaniatest@gmail.com',
            to: email,
            subject: subject,
            text: text
        };
          
        await AdminMailer.__transport.sendMail(mailOptions);
    }
}

module.exports = AdminMailer;
