const express = require("express");
const fs = require("fs");
const multer = require("multer");
const Jimp = require("jimp");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const { userSchema } = require("../models/contacts.js");
const { auth } = require("../auth/auth");
const loginHandler = require("../auth/loginHandler");

const {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserToken,
    updateAvatar,
} = require("../controllers/users");

const uploadDirAvatar = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirAvatar);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});
const upload = multer({ storage });

require("dotenv").config();
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
            return res.status(401).send("Not authorized!!");
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
    return res.status(401).json({ message: "Not authorized!" });
  } else {
    const userData = {
      email: user.email,
      subscription: user.subscription,
    };
    res.status(200).json(userData);
  }
});

router.patch("/avatars", auth, upload.single("avatar",
  async (req, res, next) => {
    try {
      const { email } = req.user;

      const { path: temporaryName, originalname } = req.file;

      const fileName = path.join(uploadDirAvatar, originalname);

      await fs.rename(temporaryName, fileName);
      console.log(fileName);
      const img = await Jimp.read(fileName);
      await img.autocrop().resize(250, 250).quality(60).write(fileName);

      await fs.rename(
        fileName,
        path.join(process.cwd(), "public/avatars", originalname)
      );

      const avatarURL = path.join(
        process.cwd(),
        "public/avatars",
        originalname
      );
      const cleanAvatarURL = avatarURL.replace(/\s/g, "/");

      const user = await updateAvatar(email, cleanAvatarURL);
      res.status(200).json(user);
    } catch (error) {
      next(error);
      return res.status(500).json({ message: "Server error" });
    }

    return res.status(200).send("plik załadowany pomyślnie");
  })
);

module.exports = router;