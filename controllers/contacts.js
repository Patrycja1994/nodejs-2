const { Contact } = require("../models/contacts.js");

const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (_id) => {
  const contact = await Contact.findOne({ _id });
  return contact;
};

const removeContact = async (_id) => {
  await Contact.findOneAndDelete({ _id });
};

const addContact = async (name, email, phone, favorite) => {
  const contact = new Contact({ name, email, phone, favorite });
  contact.save();
  return contact;
};

const updateContact = async (_id, newContact) => {
  const updatedContact = await Contact.findByIdAndUpdate(_id, newContact);
  return updatedContact;
};

const updateContactStatus = async (_id, favorite) => {
  const update = { favorite };
  const updatedContact = await Contact.findByIdAndUpdate(_id, update, {
    new: true,
  });
  return updatedContact;
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
};
