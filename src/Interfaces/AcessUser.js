const User = require('../Models/UserSchema');

class AcessUser {
  async Acess(id) {
    try {
      this.user = await User.findOne({ _id: id });
      return this.user;
    } catch (error) {
      return { error: 'Invalid ID' };
    }
  }
}

module.exports = new AcessUser();
