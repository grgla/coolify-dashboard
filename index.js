const express = require("express");
const os = require("os");
const app = express();

app.get("/", (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  const cpus = os.cpus().length;

  res.json({
    message: "Hello from Coolify Dashboard!",
    uptime: `${Math.floor(uptime)}s`,
    memory: {
      rss: memory.rss,
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
    },
    cpus,
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
