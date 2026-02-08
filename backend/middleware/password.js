const bcrypt = require("bcrypt");
const salt = 15;

async function createPassword(password) {
  const saltedHash = await bcrypt.hash(password, salt);
  return saltedHash;
}

async function checkPassword(password, saltedHash) {
  const match = await bcrypt.compare(password, saltedHash);
  return match;
}

module.exports = {
  createPassword,
  checkPassword,
};
