const { User, hashPassword } = require("../models/user");
const gravatar = require("gravatar");

const createUser = async (password, email, subscription, token) => {
  const hashedPassword = hashPassword(password);
  const avatarURL = gravatar.url(email, {s: "250", d: "404" });

    const user = new User({
    password: hashedPassword,
    email,
    subscription,
    token,
    avatarURL
    });
    
  user.save();
  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (_id) => {
  const user = await User.findOne({ _id });
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const addUserToken = async (id, token) => {
  return User.findByIdAndUpdate(id, { token });
};

const updateUserToken = async (_id) => {
  return User.findOneAndUpdate(_id, { token: null });
};

const updateAvatar = async (email, avatarURL) => {
  const user = await User.findOneAndUpdate({ email }, { avatarURL }, { new: true });
 return user;
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    addUserToken,
    updateUserToken,
    updateAvatar,
};