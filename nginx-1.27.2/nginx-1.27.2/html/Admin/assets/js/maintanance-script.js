document.addEventListener('DOMContentLoaded', () => {
  populateMonthSelect();
  populateYearSelect();
  fetchYear();
});

function fetchYear() {
  const year_no = document.getElementById('year').value;
  const month_no = document.getElementById('month').value;
  const url = `maintanance.php?year_no=${year_no}&month_no=${month_no}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      updateTable(data);
      BarChart(data);
      updateReport(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function updateTable(data) {
  let totals = {
    ct_amount: 0, CT: 0, tp_amount: 0, TP: 0,
    oc_amount: 0, OC: 0, cl_amount: 0, CL: 0
  };

  data.boxData.forEach(box => {
    totals.ct_amount += parseFloat(box.ct_amount) || 0;
    totals.CT += parseFloat(box.CT) || 0;
    totals.tp_amount += parseFloat(box.tp_amount) || 0;
    totals.TP += parseFloat(box.TP) || 0;
    totals.oc_amount += parseFloat(box.oc_amount) || 0;
    totals.OC += parseFloat(box.OC) || 0;
    totals.cl_amount += parseFloat(box.cl_amount) || 0;
    totals.CL += parseFloat(box.CL) || 0;
  });

  setText('container_value', totals.ct_amount, 2);
  setText('container_number', totals.CT);
  setText('tp_value', totals.tp_amount, 2);
  setText('tp_number', totals.TP);
  setText('oc_value', totals.oc_amount, 2);
  setText('oc_number', totals.OC);
  setText('cl_value', totals.cl_amount, 2);
  setText('cl_number', totals.CL);
}

function setText(id, value, fractionDigits = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
}

function BarChart(data) {
  const names = data.graphpieData.map(bar => bar.repair_name);
  const values = data.graphpieData.map(bar => bar.total_amount);

  echarts.init(document.querySelector("#barChart")).setOption({
    title: { text: 'List' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {},
    grid: { left: '2%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', boundaryGap: [0, 0.01] },
    yAxis: { type: 'category', data: names },
    series: [{
      name: 'Amount',
      type: 'bar',
      data: values
    }]
  });
}

function updateReport(data) {
  const formatDate = data.graphData.map(item => item.format_date);
  const total_amount_2024 = data.graphData.map(item => item.total_amount);
  const target = data.graphData.map(item => item.target_ma);

  new ApexCharts(document.querySelector("#reportsChart"), {
    series: [
      { name: 'เป้าหมายค่าซ่อม', data: target },
      { name: 'ค่าซ่อมจริง', data: total_amount_2024 }
    ],
    chart: {
      height: 350,
      type: 'bar',
      toolbar: { show: false }
    },
    markers: { size: 4 },
    colors: ['#0d6efd', '#ff771d', '#2eca6a'],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { type: 'category', categories: formatDate },
    tooltip: {
      y: {
        formatter: value =>
          value.toLocaleString(undefined, { style: 'currency', currency: 'THB' })
      }
    }
  }).render();
}

function populateMonthSelect() {
  const monthSelect = document.getElementById('month');
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthNames.forEach((month, i) => {
    const option = document.createElement('option');
    option.value = i + 1;
    option.text = month;
    monthSelect.appendChild(option);
  });
  monthSelect.value = new Date().getMonth() + 1;
}

function populateYearSelect() {
  const yearSelect = document.getElementById('year');
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
  }
}
