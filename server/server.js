// Install first: npm install express body-parser cors fs
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Endpoint to receive suggestion
app.post("/submit", (req, res) => {
  const suggestion = req.body.message;

  if (!suggestion || suggestion.trim() === "") {
    return res.status(400).json({ message: "Please write something." });
  }

  // Save to suggestions.json
  const newSuggestion = {
    id: Date.now(),
    message: suggestion.trim(),
    date: new Date().toLocaleString()
  };

  let suggestions = [];
  if (fs.existsSync("suggestions.json")) {
    suggestions = JSON.parse(fs.readFileSync("suggestions.json", "utf8"));
  }

  suggestions.push(newSuggestion);
  fs.writeFileSync("suggestions.json", JSON.stringify(suggestions, null, 2));

  res.json({ message: "Thank you! Your suggestion has been received." });
});

// Admin route to view all suggestions (simple version)
app.get("/admin/view", (req, res) => {
  if (fs.existsSync("suggestions.json")) {
    const suggestions = JSON.parse(fs.readFileSync("suggestions.json", "utf8"));
    res.send(`
      <h2>All Suggestions</h2>
      <ul>
        ${suggestions.map(s => `<li><b>${s.date}</b>: ${s.message}</li>`).join("")}
      </ul>
    `);
  } else {
    res.send("<h2>No suggestions yet.</h2>");
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
