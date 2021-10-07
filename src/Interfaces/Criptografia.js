const crypto = require('crypto');

class Criptografia {
  async getPassword() {
    try {
      this.senhaCrypto = await crypto.randomBytes(8).toString('hex');
      return this.senhaCrypto;
    } catch (error) {
      return { status: 400, message: 'Erro ao criptografar' };
    }
  }
}

module.exports = new Criptografia();
