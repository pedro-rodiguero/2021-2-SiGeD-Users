const isEmailValid = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email) && email;
};

const isNameValid = (name) => /^[a-zA-Z ]{2,50}$/.test(name) && name;

const isRoleValid = (role) => ['admin', 'professional', 'receptionist'].includes(role);

const isPassValid = (pass) => pass && pass.length >= 6;

const validate = (fields) => {
  const err = [];
  Object.keys(fields).forEach((field) => {
    const validationFunction = validators[field];
    if (!validationFunction(fields[field])) { err.push(`invalid ${field}`); }
  })
  return err;
};

const validators = {
  name: isNameValid,
  email: isEmailValid,
  role: isRoleValid,
};

module.exports = { validate, isPassValid };
