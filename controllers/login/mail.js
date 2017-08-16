const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.live.com',
    port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'neuromacielapp@hotmail.com',
        pass: 'V4NmYt;qy<RfJg\\2'
    }
})

exports.sendMail = function(to, subject, body) {
  // setup email data with unicode symbols
  const mailOptions = {
      from: '"Neuro.IO 👻" <neuromacielapp@hotmail.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: body + '\nEste es un correo automatico, por favor no lo respondas!' // plain text body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error)
      }

      console.log('Message %s sent: %s', info.messageId, info.response)
  })
}
