const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contacts = new Schema ({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
});

const Contact = mongoose.model("contact", contacts);
  
const userSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().required(),
    favorite: Joi.boolean().optional(),
})

module.exports = { Contact, userSchema };