const express = require("express");
const contactsRouter = require("./contacts");
const usersRouter = require("./users");

const router = express.Router();

router.use('/contacts', contactsRouter);
router.use('/users', usersRouter);

module.exports = router;