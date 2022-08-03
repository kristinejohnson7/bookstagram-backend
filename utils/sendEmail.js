const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.RESET_EMAIL,
      pass: process.env.RESET_PASSWORD,
    },
  });

  const message = {
    from: process.env.RESET_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
  });
};

module.exports = sendEmail;
