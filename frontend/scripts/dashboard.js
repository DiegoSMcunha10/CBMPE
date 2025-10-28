// ===== BUBBLE CHART =====
const bubbleCtx = document.getElementById('bubbleChart').getContext('2d');
new Chart(bubbleCtx, {
  type: 'bubble',
  data: {
    datasets: [
      {
        label: 'Incêndio',
        data: [{ x: 15, y: 90, r: 12 }],
        backgroundColor: '#7b68ee'
      },
      {
        label: 'Atendimento Pré-Hospitalar',
        data: [{ x: 40, y: 70, r: 10 }],
        backgroundColor: '#ffb6c1'
      },
      {
        label: 'Salvamento',
        data: [{ x: 60, y: 40, r: 8 }],
        backgroundColor: '#20b2aa'
      },
      {
        label: 'Produtos Perigosos',
        data: [{ x: 80, y: 60, r: 14 }],
        backgroundColor: '#ffa500'
      },
      {
        label: 'Prevenção',
        data: [{ x: 90, y: 30, r: 16 }],
        backgroundColor: '#4169e1'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Tempo (dias)' } },
      y: { title: { display: true, text: 'Ocorrências' } }
    },
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
      
        formatter: function(value, ctx) {
          return ''; 
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});


// ===== DOUGHNUT CHART =====
const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
new Chart(doughnutCtx, {
  type: 'doughnut',
  data: {
    labels: ['Incêndio', 'Atendimento Pré-Hospitalar', 'Salvamento', 'Produtos Perigosos', 'Prevenção'],
    datasets: [{
      data: [66.45, 61.87, 20.13, 48.06, 81.25],
      backgroundColor: ['#7b68ee', '#ffb6c1', '#20b2aa', '#ffa500', '#4169e1'],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '45%',
    plugins: {
      legend: { position: 'right' },
      title: { display: false },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 13 },
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return `${value}\n(${percentage})`;
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});
