const moment = require("moment-timezone");
const User = require("../Models/UserSchema");
const hash = require("../Utils/hashPass");
const mailer = require("../Utils/mailer");

const createUserWithTemporaryPass = async (userBody) => {
  const { name, email, role, sector, image, temporaryPassword } = userBody;

  const { transporter } = mailer;

  try {
    const user = await User.create({
      name,
      email,
      role,
      sector,
      image,
      pass: await hash.hashPass(temporaryPassword),
      temporaryPassword: true,
      createdAt: moment
        .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
        .toDate(),
      updatedAt: moment
        .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
        .toDate(),
    });

    transporter.sendMail({
      from: process.env.email,
      to: email,
      subject: "Senha temporária SiGeD",
      text: `A sua senha temporária é: ${temporaryPassword}`,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const createUserWithDefinitePass = async (userBody) => {
  const { name, email, role, sector, image, pass } = userBody;

  try {
    const user = await User.create({
      name,
      email,
      role,
      sector,
      image,
      pass: await hash.hashPass(pass),
      temporaryPassword: false,
      createdAt: moment
        .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
        .toDate(),
      updatedAt: moment
        .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
        .toDate(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserWithId = async (id, updatedUserBody) => {
  /**
   * Finds a user by id and updates it.
   * 
   * @param {number} id - User Id. 
   * @param {object} updatedUserBody - Object containing updated user fields.
   */

  const {
    name, email, role, sector, image,
  } = updatedUserBody

  const updateReturn = await User.findOneAndUpdate({ _id: id }, {
      name,
      email,
      role,
      sector,
      image,
      updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
    },
    { new: true }
  );
  
  return updateReturn 
}

const toggleUserStatus = async (id) => {
  /**
   * Find user by id and toggle it's status.
   * 
   * @param {number} id - User Id.
   */

  const userFound = await User.findOne({ _id: id });

  const open = !userFound.open;

  const updateStatus = await User.findOneAndUpdate(
    { _id: id },
    {
      open,
      updatedAt: moment
        .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
        .toDate(),
    },
    { new: true },
    (user) => user
  );

  return updateStatus
}

module.exports = {
  createUserWithTemporaryPass,
  createUserWithDefinitePass,
  updateUserWithId,
  toggleUserStatus
};
