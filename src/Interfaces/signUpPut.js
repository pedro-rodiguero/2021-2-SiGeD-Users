const moment = require('moment-timezone');
const User = require('../Models/UserSchema');
const validation = require('../Utils/validate');

class SignUpPut {
  async Put(name, email, role, sector, image, id) {
    this.errorMessage = validation.validate(name, email, role);

    if (this.errorMessage.length) {
      return { message: this.errorMessage };
    }

    try {
      this.updateReturn = await User.findOneAndUpdate({ _id: id }, {
        name,
        email,
        role,
        sector,
        image,
        updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
      },
      { new: true });
      return this.updateReturn;
    } catch (error) {
      if (error.keyValue) {
        return { duplicated: error.keyValue };
      }
      return { error: 'Invalid ID' };
    }
  }
}

module.exports = new SignUpPut();
