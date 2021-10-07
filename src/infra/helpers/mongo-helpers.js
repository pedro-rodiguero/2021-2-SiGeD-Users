const mongoose = require('mongoose');

module.exports = {
  async connect(uri) {
    this.uri = uri;
    this.client = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
};
