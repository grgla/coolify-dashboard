const express = require("express");
const os = require("os");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/stats", (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  const cpus = os.cpus().length;

  res.json({
    uptime,
    memory,
    cpus,
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
