// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const User = require('../Models/UserSchema');
const validation = require('../Utils/validate');
const hash = require('../Utils/hashPass');
const SignUpUser = require('../Interfaces/SignUpUser');
const AcessUser = require('../Interfaces/AcessUser');
const SignUpPut = require('../Interfaces/signUpPut');
const Recovery = require('../Interfaces/LoginUser');
// ROTAS

const access = async (req, res) => {
  const { id } = req.params;
  const user = await AcessUser.Acess(id);
  return res.json(user);
};

const signUpGet = async (req, res) => {
  const users = await User.find();

  return res.status(200).json(users);
};

const signUpPost = async (req, res) => {
  const {
    name, email, role, sector, image,
  } = req.body;

  const user = await SignUpUser.RegisterUser(name, email, role, sector, image);
  return res.json(user);
};

const signUpPut = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, role, sector, image,
  } = req.body;

  const updateReturn = await SignUpPut.Put(name, email, role, sector, image, id);
  return res.json(updateReturn);
};

const signUpDelete = async (req, res) => {
  const { id } = req.params;

  try {
    await User.deleteOne({ _id: id });
    return res.json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(404).json({ error: 'It was not possible to find an user with this id.' });
  }
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user == null) {
    return res.json({ message: 'The user does not exits.' });
  }

  if (await bcrypt.compare(req.body.pass, user.pass)) {
    const { id } = user;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 43200,
    });

    const profile = { ...user._doc };
    delete profile.pass;
    return res.json({ auth: true, token, profile });
  }

  return res.json({ message: 'Incorret password.' });
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const message = await Recovery.RecoveryPassword(email);
  return res.json(message);
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const {
    pass,
  } = req.body;

  const validateResult = validation.validatePass(pass);

  if (!validateResult) {
    return res.status(400).json({ error: 'Password too short' });
  }

  const newPass = await hash.hashPass(pass);

  try {
    const updateReturn = await User.findOneAndUpdate({ _id: id }, {
      pass: newPass,
      temporaryPassword: false,
      updatedAt: moment.utc(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate(),
    },
    { new: true });
    delete updateReturn._doc.pass;
    return res.json(updateReturn);
  } catch (error) {
    return res.status(404).json({ error: 'It was not possible to find an user with this id.' });
  }
};

const newestFourUsersGet = async (req, res) => {
  const users = await User.find().limit(4).sort({ createdAt: -1 });

  return res.status(200).json(users);
};

module.exports = {
  signUpGet,
  signUpPost,
  signUpPut,
  signUpDelete,
  login,
  access,
  recoverPassword,
  changePassword,
  newestFourUsersGet,
};
