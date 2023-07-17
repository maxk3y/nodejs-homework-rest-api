const nodemailer = require('nodemailer');

module.exports = class Email {
  _InitTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_API_KEY,
      },
    });
  }

  async _send(email, verificationUrl) {
    const emailConfig = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Email verification',
      html: `<p>Here is your verification link: <a href='${verificationUrl}'>${verificationUrl}</a></p>`,
    };

    await this._InitTransport().sendMail(emailConfig);
  }
};
