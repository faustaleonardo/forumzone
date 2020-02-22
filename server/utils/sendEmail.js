const nodemailer = require('nodemailer');

module.exports = async ({ email, subject, text }) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const message = {
    from: 'admin@forumzone.com',
    to: email,
    subject,
    text
  };

  await transport.sendMail(message);
};
