const app = require('./app');
const createFolderIfNotExist=require("./helpers/helpers");

app.listen(5000, () => {
  createFolderIfNotExist("./tmp");
  createFolderIfNotExist("./public");
  createFolderIfNotExist("./public/avatars");

  console.log("Server running. Use our API on port: 5000")
})
