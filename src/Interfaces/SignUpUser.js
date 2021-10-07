const moment = require('moment-timezone');
const User = require('../Models/UserSchema');
const validation = require('../Utils/validate');
const hash = require('../Utils/hashPass');
const mailer = require('../Utils/mailer');
const crypto = require('./Criptografia');

class SignUpUser {
  async RegisterUser(name, email, role, sector, image) {
    this.transporter = mailer.transporter;
    this.temporaryPassword = await crypto.getPassword();
    this.errorMessage = validation.validate(name, email, role, sector, image);
    if (this.errorMessage.length) {
      return { error: this.errorMessage };
    }
    try {
      this.user = await User.create({
        name,
        email,
        role,
        sector,
        image,
        pass: await hash.hashPass(this.temporaryPassword),
        temporaryPassword: true,
        createdAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
        updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
      });

      this.transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: 'Senha temporária SiGeD',
        text: `A sua senha temporária é: ${this.temporaryPassword}`,
      });
      return this.user;
    } catch (error) {
      return { duplicated: error.keyValue };
    }
  }
}

module.exports = new SignUpUser();
