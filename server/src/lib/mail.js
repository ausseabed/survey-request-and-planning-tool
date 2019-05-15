import _ from 'lodash'
import nodemailer from 'nodemailer'


var pjson = require('../../package.json')

const emailService = process.env['EMAIL_SERVICE']
const emailHost = process.env['EMAIL_HOST']
const emailPort = process.env['EMAIL_PORT']
const emailSecure = (process.env['EMAIL_SECURE'] != 'false')
const emailIgnoreTls = (process.env['EMAIL_IGNORE_TLS'] == 'true')
const emailUser = process.env['EMAIL_USER']
const emailPassword = process.env['EMAIL_PASSWORD']
const emailFrom = process.env['EMAIL_FROM']

const fromName = pjson.productName

const transportOptions = {
  service: emailService,
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  ignoreTLS: emailIgnoreTls,
}

if (
  !_.isNil(emailUser) &&
  !_.isNil(emailPassword) &&
  emailUser.length != 0 &&
  emailPassword.length != 0) {

    transportOptions.auth = {
      user: emailUser,
      pass: emailPassword,
    }
}

const transporter = nodemailer.createTransport(transportOptions)

export default async function sendTestEmail() {

    let mailDetails = {
      from: `"${fromName}" <${emailFrom}>`, // sender address
      to: "qa4mbes@example.com", // list of receivers
      subject: "Test email", // Subject line
      text: "Hello from QA4MBES?", // plain text body
      html: "<b>Hello from QA4MBES?</b>" // html body
    };
    console.log(transportOptions);
    console.log(mailDetails);
    let info = await transporter.sendMail(mailDetails);

}
