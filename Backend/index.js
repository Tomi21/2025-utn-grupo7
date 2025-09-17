// backend/index.js
const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
