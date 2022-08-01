const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_EMAIL, // generated ethereal user
  //     pass: process.env.SMTP_PASSWORD, // generated ethereal password
  //   },
  // });

  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.RESET_EMAIL,
      pass: process.env.RESET_PASSWORD,
    },
  });

  // send mail with defined transport object
  const message = {
    from: process.env.RESET_EMAIL, // sender address
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent", info.response);
  });

  // console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
