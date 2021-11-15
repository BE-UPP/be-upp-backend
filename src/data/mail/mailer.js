var nodemailer = require("nodemailer");

/*  HOW TO USE
    Para Gmail, precisa habilitar envio para apps menos seguros e desabilitar Captcha
    https://myaccount.google.com/lesssecureapps
    https://accounts.google.com/b/0/DisplayUnlockCaptcha

    EXAMPLE
    const mailer = require('../data/mail/mailer')

    var mailOptions = {
        to: "paciente@mail.com",
        subject: "Olá, paciente! Isto é um teste",
        html: "<h1>Welcome to be-upp</h1>"
    }
    mailer.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Mensagem enviada: ", response);
        }
    });
*/ 

var mailer = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports = mailer;