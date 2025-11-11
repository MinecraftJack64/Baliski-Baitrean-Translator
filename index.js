// server.js
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 8211;

app.use(bodyParser.json());
app.use("/web", express.static(path.join(__dirname, "web")));

// Helper function to load JSON
function loadJson(JSON_FILE) {
  if (!fs.existsSync(JSON_FILE)) {
    fs.writeFileSync(JSON_FILE, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));
}

// GET route to serve the JSON file
app.get("/roots", (req, res) => {
  const jsonData = loadJson("roots.json");
  res.json(jsonData);
});

// POST route to update a string at a given key
app.post("/update", (req, res) => {
  const { key, value } = req.body;

  if (typeof key !== "string" || typeof value !== "string") {
    return res.status(400).json({ error: "Key and value must be strings" });
  }

  let jsonData = loadJson();
  jsonData[key] = value;

  fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2));

  res.json({ message: "Updated successfully", data: jsonData });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
