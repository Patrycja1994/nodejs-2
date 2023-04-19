const express = require('express');
const { userSchema } = require("../models/contacts.js");
const { auth } = require("../auth/auth");
const loginHandler = require("../auth/loginHandler");

const {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserToken,
} = require("../controllers/users");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
      const { password, email, subscription } = req.body;
      const emailOccupied = await getUserByEmail(email);
      if (emailOccupied) {
        return res.status(409).send(`Email ${email} is already in use...`);
    }
    const user = await createUser(password, email, subscription);
    return res.status(200).json(user);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required!!");
    }
    const user = await getUserByEmail(email);
    
    if (!user) {
       return res.status(400).send("User not found!!!");
    }
    try {
        const token = await loginHandler(email, password);
        return res.status(200).send(token);
    } catch (err) {
        return res.status(401).send("Email or password are wrong");
    }
});

router.get("/logout", auth, async (req, res) => {
    try {
        const { _id } = await req.user;
        const user = await getUserById({ _id });
        if (!user) {
            return res.status(401).send("Not authorized");
        }
        await updateUserToken(_id);
        res.sendStatus(204);
    } catch {
    res.status(500).send("Server error");
    }
});

router.get("/current", auth, async (req, res) =>  {
  const { id } = req.user;
  const user = await getUserById(id);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  } else {
    const userData = {
      email: user.email,
      subscription: user.subscription,
    };
    res.status(200).json(userData);
  }
});

module.exports = router;