const bcrypt = require('bcrypt');

exports.genPass = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};
exports.validatePass = async (password, hashedPassword) => {
    console.log(password, hashedPassword);
    const state = await bcrypt.compare(password, hashedPassword);
    return state;
};
