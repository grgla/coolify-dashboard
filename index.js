const express = require("express");
const os = require("os");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/stats", (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  const cpus = os.cpus().length;

  // Get disk info for root filesystem
  const diskStats = {
    total: 0,
    used: 0,
    free: 0,
  };

  try {
    // For Linux/Unix systems, use df command or os.statfs equivalent
    const stats = fs.statfsSync("/");
    diskStats.total = stats.blocks * stats.bsize;
    diskStats.free = stats.bfree * stats.bsize;
    diskStats.used = diskStats.total - diskStats.free;
  } catch (e) {
    console.warn("Could not read disk stats:", e.message);
  }

  res.json({
    uptime,
    memory,
    cpus,
    disk: diskStats,
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
