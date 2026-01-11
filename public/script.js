const uptimeEl = document.getElementById("uptime");
const memoryCtx = document.getElementById("memoryChart").getContext("2d");
const cpuCtx = document.getElementById("cpuChart").getContext("2d");

const memoryChart = new Chart(memoryCtx, {
  type: "bar",
  data: {
    labels: ["RSS", "Heap Used", "Heap Total"],
    datasets: [{
      label: "Memory (bytes)",
      data: [0, 0, 0],
      backgroundColor: ["#4caf50","#2196f3","#ff9800"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

const cpuChart = new Chart(cpuCtx, {
  type: "bar",
  data: {
    labels: ["CPUs"],
    datasets: [{
      label: "CPU cores",
      data: [0],
      backgroundColor: ["#f44336"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

async function fetchStats() {
  try {
    const res = await fetch("/api/stats");
    const stats = await res.json();

    uptimeEl.textContent = Math.floor(stats.uptime);

    const rssM = (stats.memory.rss / 1024 / 1024).toFixed(2);
    const heapUsedM = (stats.memory.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotalM = (stats.memory.heapTotal / 1024 / 1024).toFixed(2);

    memoryChart.data.datasets[0].data = [rssM, heapUsedM, heapTotalM];
    memoryChart.update();

    cpuChart.data.datasets[0].data = [stats.cpus];
    cpuChart.update();
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}

fetchStats();
setInterval(fetchStats, 2000);
