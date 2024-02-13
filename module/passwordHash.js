const bcrypt = require("bcrypt");

async function HashPass(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

module.exports = HashPass;
