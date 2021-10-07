const User = require('../Models/UserSchema');
const hash = require('../Utils/hashPass');
const mailer = require('../Utils/mailer');
const crypto = require('./Criptografia');

class Recovery {
  async RecoveryPassword(email) {
    this.transporter = mailer.transporter;
    let user = null;
    this.temporaryPassword = await crypto.getPassword();
    try {
      user = await User.findOneAndUpdate({ email }, {
        pass: await hash.hashPass(this.temporaryPassword),
        temporaryPassword: true,
      }, { new: true });

      if (!user) {
        return { error: 'It was not possible to find an user with this email.' };
      }
      this.transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: 'Senha temporária SiGeD',
        text: `A sua senha temporária é: ${this.temporaryPassword}`,
      });
      return { message: 'Email sent.' };
    } catch {
      return { error: 'It was not possible to send the email.' };
    }
  }
}

module.exports = new Recovery();
