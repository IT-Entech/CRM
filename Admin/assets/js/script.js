function getSessionData() {
  fetch('./header.php')
    .then(response => response.json())
    .then(data => {
      const { name, staff, level, role } = data;
      if (staff == 0 || level < 1) {
        alert("คุณไม่ได้รับสิทธิ์ให้เข้าหน้านี้");
        window.location = "../../pages-login.html";
        return;
      }
      const channelSelect = document.getElementById('channel');
      if (role === 'MK Online') {
        channelSelect.value = 'I';
      } else if (role === 'MK Offline') {
        channelSelect.value = 'O';
      } else {
        channelSelect.value = 'N';
      }
      var permissionNav = document.getElementById('permission-nav');
      var maintenanceNav = document.getElementById('maintanance-nav');
      var selectSale = document.getElementById('select-sale');
      if(level === 3){
        permissionNav.classList.remove('d-none');
        maintenanceNav.classList.remove('d-none');
        selectSale.classList.remove('d-none');
      }else if(level === 2){
        permissionNav.classList.add('d-none');
        maintenanceNav.classList.add('d-none');
        selectSale.classList.remove('d-none');
      }else{
        permissionNav.classList.remove('d-none');
        maintenanceNav.classList.remove('d-none');
      }
      const AllOption = document.getElementById('all-select-channel');
      const onlineOption = document.getElementById('OnL');
      const offlineOption = document.getElementById('OfL');
      if (role === 'MK Online') {
        offlineOption.classList.add('d-none');
        AllOption.classList.add('d-none');
      }else if(role === 'MK Offline'){
        onlineOption.classList.add('d-none');
        AllOption.classList.add('d-none');
      }
      if (level >= 2) {
        fetch('../staff_id.php')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            const selectElement = document.getElementById('Sales');
            data.forEach(item => {
              const option = document.createElement('option');
              option.value = item.staff_id;
              option.textContent = item.fname_e;
              selectElement.appendChild(option);
            });
          })
          .catch(error => console.error('Error fetching staff data:', error));
      }
      document.getElementById('fetch-level').value = level;
      document.getElementById('name-display').textContent = name;
      document.getElementById('name-display1').textContent = name;
      document.getElementById('position-name').textContent = role;
      document.getElementById('fetch-staff').value = staff;
      fetchYear();
    })
    .catch(error => {
      console.error('Error fetching session data:', error);
    });
}

getSessionData();

function fetchYear() {
  const level = document.getElementById('fetch-level').value;
  const year_no = document.getElementById('year').value;
  const month_no = document.getElementById('month').value;
  const is_new = document.getElementById('is_new').value;
  const user = document.getElementById('fetch-staff').value;
  const channel = document.getElementById('channel').value;

  let Sales;
  if (level == 1) {
    Sales = user;
  } else if (level == 2 || level == 3) {
    Sales = document.getElementById('Sales').value;
  }

  const url = `./revenue.php?year_no=${year_no}&month_no=${month_no}&channel=${channel}&Sales=${Sales}&is_new=${is_new}`;
  const url1 = `./reportchart.php?year_no=${year_no}&Sales=${Sales}&is_new=${is_new}&channel=${channel}`;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      if (data.trim() === '') {
        console.error('Empty response');
        return;
      }
      const cleanedData = data.replace(/^\s*[^[{]+/, '').replace(/[^}\]]*$/, '');
      try {
        const jsonData = JSON.parse(cleanedData);
        if (!jsonData || !Array.isArray(jsonData.revenue)) {
          throw new Error('Invalid data format or missing revenueData');
        }
        updateTable(jsonData);
        updateChart(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    })
    .catch(error => {
      console.error('Error fetching report chart data:', error);
    });

  fetch(url1)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching report chart data: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data1 => {
      updateReport(data1);
    })
    .catch(error => console.error('Error fetching report chart data:', error));
}

function updateTable(data) {
  let totalAP = 0;
  let totalAPQ = 0;
  let totalAPQT = 0;
  let totalVC = 0;
  let totalQT = 0;
  let totalSUMQT = 0;
  let totalOR = 0;
  let totalSUMOR = 0;
  let totalSoAmount = 0;
  let totalCustomerNumber = 0;
  let totalleadNumber = 0;

  data.appointment.forEach(ap => {
    const app = parseFloat(ap.appoint_no) || 0;
    const appq = parseFloat(ap.appoint_quality) || 0;
    const appqt = parseFloat(ap.appoint_qt) || 0;
    const value_customer = parseFloat(ap.value_customer) || 0;

    totalAP += app;
    totalAPQ += appq;
    totalAPQT += appqt;
    totalVC += value_customer;
  });

  data.costSheets.forEach(qt => {
    const soAmount = parseFloat(qt.so_amount) || 0;
    const customerNumber = parseFloat(qt.qt_customer) || 0;
    const qtNumber = parseFloat(qt.qt_number) || 0;

    totalSUMQT += soAmount;
    totalQT += customerNumber;
  });

  data.orders.forEach(order => {
    const soAmount = parseFloat(order.order_amount) || 0;
    const OrderNumber = parseFloat(order.order_no) || 0;

    totalSUMOR += soAmount;
    totalOR += OrderNumber;
  });

  data.revenue.forEach(revenue => {
    const soAmount = parseFloat(revenue.so_amount) || 0;
    const customerNumber = parseFloat(revenue.customer_number) || 0;
    const leadnumber = parseFloat(revenue.lead) || 0;

    totalSoAmount += soAmount;
    totalCustomerNumber += customerNumber;
    totalleadNumber += leadnumber;
  });

  const apElement = document.getElementById('appoint');
  if (apElement) {
    apElement.textContent = totalAP.toLocaleString('en-US');
  }

  const apElement2 = document.getElementById('ap_quality');
  if (apElement2) {
    apElement2.textContent = totalAPQ.toLocaleString('en-US');
  }

  const qtElement = document.getElementById('qt_value');
  if (qtElement) {
    qtElement.textContent = totalVC.toLocaleString('en-US');
  }

  const qtElement2 = document.getElementById('qt_number');
  if (qtElement2) {
    qtElement2.textContent = totalAPQT.toLocaleString('en-US');
  }

  const orderElement = document.getElementById('order_est');
  if (orderElement) {
    orderElement.textContent = totalSUMOR.toLocaleString('en-US');
  }

  const orderElement2 = document.getElementById('or_number');
  if (orderElement2) {
    orderElement2.textContent = totalOR.toLocaleString('en-US');
  }

  const revenueElement = document.getElementById('revenue');
  if (revenueElement) {
    revenueElement.textContent = totalSoAmount.toLocaleString('en-US');
  }

  const countElement2 = document.getElementById('customer_number');
  if (countElement2) {
    countElement2.textContent = totalleadNumber.toLocaleString('en-US');
  }

  const ratio = totalSoAmount / totalleadNumber;
  const winrateratio = (totalleadNumber / totalAPQT);
  const winrateratioV = (totalSoAmount / totalVC);
  const ratioElement = document.getElementById('AOV');
  const winrateElement = document.getElementById('winrate');
  const winrateElementV = document.getElementById('winrateV');

  ratioElement.textContent = ratio.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  winrateElement.textContent = (winrateratio * 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '%';
  winrateElementV.textContent = (winrateratioV * 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '%';

  const tbody = document.querySelector('#region tbody');
  tbody.innerHTML = '';

  data.regions.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.segment}</td>
      <td>${row.North}</td>
      <td>${row.Central}</td>
      <td>${row.East}</td>
      <td>${row.North_East}</td>
      <td>${row.West}</td>
      <td>${row.South}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateChart(data) {
  const chartData = data.segments.map(item => ({
    value: item.segment_count,
    name: item.customer_segment_name,
    total_before_vat: item.total_before_vat,
    aov: item.aov
  }));

  const chart = echarts.init(document.querySelector("#trafficChart"));
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const formattedValue = params.data.total_before_vat.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        const aov = params.data.aov;
        const percentage = params.percent.toFixed(2);
        return `
          <b>${params.name}</b><br>
          Product qty: ${params.value}<br>
          Winrate: ${percentage} %<br>
          Value: ${formattedValue}<br>
          AOV: ${aov}
        `;
      }
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [{
      name: 'Product',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: chartData
    }]
  });
}

let apexChart = null;

function updateReport(data1) {
  const target_revenue = data1.graphData.map(item => item.accumulated_target);
  const saleorderAccu = data1.graphData.map(item => parseFloat(item.accumulated_so).toFixed(0));
  const dateAP = data1.graphData.map(item => item.format_date);

  if (apexChart !== null) {
    apexChart.updateSeries([
      { name: 'Target', data: target_revenue },
      { name: 'Revenue', data: saleorderAccu }
    ]);
  } else {
    apexChart = new ApexCharts(document.querySelector("#reportsChart"), {
      series: [
        { name: 'Target', data: target_revenue },
        { name: 'Revenue', data: saleorderAccu }
      ],
      chart: {
        type: 'area',
        height: 350,
        zoom: { enabled: false }
      },
      markers: { size: 4 },
      colors: ['#0d6efd', '#2eca6a'],
      dataLabels: { enabled: false },
      stroke: { curve: 'straight', width: 2 },
      subtitle: { text: 'Revenue Movement', align: 'left' },
      xaxis: { type: 'category', categories: dateAP },
      yaxis: {
        opposite: true,
        labels: {
          formatter: function(value) {
            return value.toLocaleString(undefined, { style: 'currency', currency: 'THB' });
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return value.toLocaleString(undefined, { style: 'currency', currency: 'THB' });
          }
        }
      }
    });
    apexChart.render();
  }
}

document.addEventListener('DOMContentLoaded', fetchYear);

const monthSelect = document.getElementById('month');
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

monthNames.forEach((month, index) => {
  const option = document.createElement('option');
  option.value = index + 1;
  option.text = month;
  monthSelect.appendChild(option);
});

const currentMonth = new Date().getMonth() + 1;
monthSelect.value = currentMonth;

const yearSelect = document.getElementById('year');
const currentYear = new Date().getFullYear();
const startYear = 2023;

for (let year = currentYear; year >= startYear; year--) {
  const option = document.createElement('option');
  option.value = year;
  option.text = year;
  yearSelect.appendChild(option);
}
