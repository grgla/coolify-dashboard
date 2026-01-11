const uptimeEl = document.getElementById("uptime");
const memoryCtx = document.getElementById("memoryChart").getContext("2d");
const cpuCtx = document.getElementById("cpuChart").getContext("2d");
const diskCtx = document.getElementById("diskChart").getContext("2d");

const memoryChart = new Chart(memoryCtx, {
  type: "bar",
  data: {
    labels: ["RSS", "Heap Used", "Heap Total"],
    datasets: [{
      label: "Memory (MB)",
      data: [0, 0, 0],
      backgroundColor: ["#4caf50","#2196f3","#ff9800"]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(ctx) {
            const value = ctx.parsed.y ?? ctx.parsed; // support different chart versions
            return `${ctx.dataset.label || 'Memory'}: ${value} MB`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback(value) { return value + ' MB'; }
        },
        title: { display: true, text: 'Megabytes (MB)' }
      }
    }
  }
});

// CPU chart: add tooltip callback to clarify units (cores)
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
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(ctx) {
            const v = ctx.parsed.y ?? ctx.parsed;
            return `Cores: ${v}`;
          }
        }
      }
    },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Cores' } } }
  }
});

// disk chart with gradient (used vs free)
const gradDiskUsed = diskCtx.createLinearGradient(0, 0, 0, 220);
gradDiskUsed.addColorStop(0, '#ff6b9d'); // warm coral
gradDiskUsed.addColorStop(1, '#c41e3a'); // deep red

const gradDiskFree = diskCtx.createLinearGradient(0, 0, 0, 220);
gradDiskFree.addColorStop(0, '#4ecdc4'); // teal
gradDiskFree.addColorStop(1, '#056b74'); // deep teal

const diskChart = new Chart(diskCtx, {
  type: "bar",
  data: {
    labels: ["Used", "Free"],
    datasets: [{
      label: "Disk (GB)",
      data: [0, 0],
      backgroundColor: [gradDiskUsed, gradDiskFree],
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(ctx) {
            const value = ctx.parsed.y ?? ctx.parsed;
            return `${ctx.label}: ${value} GB`;
          }
        },
        backgroundColor: '#0b2430',
        titleColor: '#f6d37a',
        bodyColor: '#e6fff8'
      }
    },
    scales: {
      x: {
        ticks: { color: '#cfeee8' },
        grid: { color: 'transparent' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#cfeee8',
          callback(value) { return value + ' GB'; }
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
        title: { display: true, text: 'Gigabytes (GB)', color: '#9be7d3' }
      }
    }
  }
});

async function fetchStats() {
  try {
    const res = await fetch("/api/stats");
    const stats = await res.json();

    uptimeEl.textContent = Math.floor(stats.uptime);

    // Convert bytes to MB (numbers)
    const rssM = parseFloat((stats.memory.rss / 1024 / 1024).toFixed(2));
    const heapUsedM = parseFloat((stats.memory.heapUsed / 1024 / 1024).toFixed(2));
    const heapTotalM = parseFloat((stats.memory.heapTotal / 1024 / 1024).toFixed(2));

    memoryChart.data.datasets[0].data = [rssM, heapUsedM, heapTotalM];
    memoryChart.update();

    cpuChart.data.datasets[0].data = [stats.cpus];
    cpuChart.update();

    // Update disk chart (convert bytes to GB)
    const diskUsedGB = parseFloat((stats.disk.used / 1024 / 1024 / 1024).toFixed(2));
    const diskFreeGB = parseFloat((stats.disk.free / 1024 / 1024 / 1024).toFixed(2));

    diskChart.data.datasets[0].data = [diskUsedGB, diskFreeGB];
    diskChart.update();
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}

fetchStats();
setInterval(fetchStats, 2000);
