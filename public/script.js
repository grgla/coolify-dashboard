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

// Chart.js para CPU
const cpuChart = new Chart(cpuCtx, {
  type: "bar",
  data: {
    labels: ["CPUs"],
    datasets: [{
      label: "CPU cores",
      data: [0],
      backgroundColor: ["#f44336"]
