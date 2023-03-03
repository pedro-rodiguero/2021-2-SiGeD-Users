const crypto = require('crypto');
const moment = require("moment-timezone");
const User = require("../Models/UserSchema");
const hash = require("../Utils/hashPass");
const mailer = require("../Utils/mailer");

const createUserWithPass = async (userInfo, temporaryPass = true) => {
  const { name, email, role, sector, image } = userInfo;

  const password = userInfo.password || crypto.randomBytes(8).toString('hex');

  try {
    const user = await User.create({
      name,
      email,
      role,
      sector,
      image,
      pass: await hash.hashPass(password),
      temporaryPassword: temporaryPass,
      createdAt: moment
        .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
        .toDate(),
      updatedAt: moment
        .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
        .toDate(),
    });

    if (temporaryPass) {
      mailer.transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: "Senha temporária SiGeD",
        text: `A sua senha temporária é: ${password}`,
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserWithId = async (id, updatedUserBody) => {
  const {
    name, email, role, sector, image,
  } = updatedUserBody

  return await User.findOneAndUpdate({_id: id}, {
        name,
        email,
        role,
        sector,
        image,
        updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
      },
      {new: true}
  )
}

const toggleUserStatus = async (id) => {

  const userFound = await User.findOne({ _id: id });

  const open = !userFound.open;

  return await User.findOneAndUpdate(
      {_id: id},
      {
        open,
        updatedAt: moment
            .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
            .toDate(),
      },
      {new: true},
      (user) => user
  )
}

module.exports = {
  createUserWithPass,
  updateUserWithId,
  toggleUserStatus
};
