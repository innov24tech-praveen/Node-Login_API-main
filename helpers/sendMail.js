const nodemailer = require("nodemailer");
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

const sendMail = async (email, mailSubject, content) => {

      try {
            const transport = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  secure: false,
                  requireTLS: true,
                  auth: {
                        user: process.env.SMTP_MAIL,
                        pass: process.env.SMTP_PASSWORD
                  }
            });
            const mailOption = {
                  from: SMTP_MAIL,
                  to: email,
                  subject: mailSubject,
                  html: content
            }

            transport.sendMail(mailOption, function (error, info) {
                  if (error) {
                        console.log(error)
                  }
                  else {
                        console.log("Mail  Sent Successfully:-", info.response,);
                  }
            });
      } catch (error) {
            console.log(error.message)
            throw error
      }
}
module.exports = sendMail
