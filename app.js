const bodyParser = require("body-parser");
const express = require("express");

const router = require("./src/routes/routes");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(router);
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
