const express = require('express');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactStatus,
} = require("../controllers/contacts");

const { userSchema } = require("../models/contacts.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      return res.status(400).send("Wrong id provided");
    }
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).send("Contact not found");
    }
    res.status(200).json(contact);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.post('/', async (req, res) => {
     const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const { id, name, email, phone, favorite } = req.body;
        const user = addContact(id, name, email, phone, favorite);
        return res.status(201).json(user);
    } catch {
        return res.status(500).send("Something went wrong");
    }
});

router.delete('/:contactId', async (req, res) => {
  const contactId = req.params.contactId;
  try {
    const contactRemove = removeContact(contactId);
    if (contactRemove) {
      res.status(200).send("Contact was delete");
    } else {
      res.status(404).send("Not found");
    }
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  if (!contactId) {
    return res.status(400).send("Id is required to perform update")
  }
  
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const contact = getContactById(contactId);
  if (!contact) {
    return res.status(404).send("contact not found");
  }
  try {
    updateContact(contactId, req.body);
    return res.status(200).send("contact sucesfully update");
  } catch {
    return res.status(500).send("Something went wrong");
  }
});
router.patch("/:contactId/favorite", async (req, res) => {
  try {
    const { contactId: _id } = req.params;
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).send("Missing field favorite");
    }
    const favoriteValue = Boolean(favorite);
    const updatedContact = await updateContactStatus(_id, favoriteValue);
    return res.status(200).send(updatedContact);
  } catch (err) {
    return res.status(404).send("Contact not found");
  }
});


module.exports = router;
