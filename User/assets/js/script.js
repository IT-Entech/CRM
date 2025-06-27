function getSessionData() {
  fetch('./header.php')
    .then(response => response.json()) // Parse the JSON from the response
    .then(data => {
      //console.log('Session Data:', data);

      const { name, staff, level, role, position } = data;
       //console.log(`Name: ${name}, Staff: ${staff}, Level: ${level}, Role: ${role}`);
      if (staff == 0 || level < 1) {
        alert("คุณไม่ได้รับสิทธิ์ให้เข้าหน้านี้");
        window.location = "../pages-login.html";
        return;
      }
         // Set the selected option based on the role
         const channelSelect = document.getElementById('channel');
         if (role === 'MK Online') {
           channelSelect.value = 'I'; // Set "Online" as selected
         } else if (role === 'MK Offline') {
           channelSelect.value = 'O'; // Set "Offline" as selected
         } else {
           channelSelect.value = 'N'; // Default to "All"
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
      }else if(level === 1){
          permissionNav.classList.add('d-none');
        maintenanceNav.classList.add('d-none');
          selectSale.classList.add('d-none');
      }
       // Hide the "Online" option for MK Online role
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
      // Conditionally show Maintenance and Permission nav items
      if (level >= 2) {

      // Fetch staff data if needed for select options
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
      // Update hidden fields and display the user name
      document.getElementById('fetch-level').value = level;
      document.getElementById('name-display').textContent = name;
      document.getElementById('name-display1').textContent = name;
      document.getElementById('position-name').textContent = role;
      document.getElementById('fetch-staff').value = staff;

      // Now call fetchYear() to fetch year-based data
      fetchYear(); // Ensure session data is available before fetching year data
    })
    .catch(error => {
      console.error('Error fetching session data:', error);
    });
}

// Call the function to fetch session data
getSessionData();

// Fetch year data and update the dashboard based on the selected values
function fetchYear() {
  const level = document.getElementById('fetch-level').value;
  const year_no = document.getElementById('year').value;
  const month_no = document.getElementById('month').value;
  const is_new = document.getElementById('is_new').value;
  const user = document.getElementById('fetch-staff').value;  // Ensure this value is populated before fetching
  const channel = document.getElementById('channel').value;

  
  let Sales;
  if (level == 1) {
    Sales = user;
  } else if (level == 2 || level == 3) {
    Sales = document.getElementById('Sales').value;
  }

  // Construct URLs for fetching the dashboard and report chart data
  const url = `./revenue.php?year_no=${year_no}&month_no=${month_no}&channel=${channel}&Sales=${Sales}&is_new=${is_new}`;
  const url1 = `./reportchart.php?year_no=${year_no}&Sales=${Sales}&is_new=${is_new}&channel=${channel}`;
  
  //console.log('Fetching data from URL:', url1);

  // Fetch dashboard data
  fetch(url)
  .then(response => response.text())  // Use text() for debugging
  .then(data => {
    //console.log('Raw response:', data);  // Log the raw response

    if (data.trim() === '') {
      console.error('Empty response');
      return;
    }
    //console.log('Report Chart Data:', data);
    // Clean up the response (if necessary)
    const cleanedData = data.replace(/^\s*[^[{]+/, '').replace(/[^}\]]*$/, '');
    //console.log('Cleaned data:', cleanedData);  // Log cleaned data before parsing

    try {
      const jsonData = JSON.parse(cleanedData);  // Attempt to parse cleaned data

      if (!jsonData || !Array.isArray(jsonData.revenue)) {
        throw new Error('Invalid data format or missing revenueData');
      }

      // Proceed with updating the table
      updateTable(jsonData);
      updateChart(jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      //console.error('Raw response was not valid JSON:', cleanedData);
    }
  })
  .catch(error => {
    console.error('Error fetching report chart data:', error);
  });

    // Fetch report chart data
    fetch(url1)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching report chart data: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data1 => {
      //console.log('Report Chart Data:', data1);  // Log the data to check the response
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
  let totalQTnumber = 0;
  let totalSUMQT = 0;
  let totalOR = 0;
  let totalSUMOR = 0;
  let totalSoAmount = 0;
  let totalCustomerNumber = 0;
 let totalleadNumber = 0;

  // Process each revenue data and accumulate the values
  data.appointment.forEach(ap => {
    const app = parseFloat(ap.appoint_no) || 0;
    const appq = parseFloat(ap.appoint_quality) || 0;
    const appqt = parseFloat(ap.appoint_qt) || 0;
    const value_customer = parseFloat(ap.value_customer) || 0;

    totalAP += app;  // Accumulate so_amount
    totalAPQ += appq;  
    totalAPQT += appqt;  
    totalVC += value_customer;  
  });
  data.costSheets.forEach(qt => {
    const soAmount = parseFloat(qt.so_amount) || 0;
    const customerNumber = parseFloat(qt.qt_customer) || 0;
    const qtNumber = parseFloat(qt.qt_number) || 0;

    totalSUMQT += soAmount;  // Accumulate so_amount
    totalQT += customerNumber;  
    totalQTnumber = qtNumber; 
  });
  data.orders.forEach(order => {
    const soAmount = parseFloat(order.order_amount) || 0;
    const OrderNumber = parseFloat(order.order_no) || 0;

    totalSUMOR += soAmount;  // Accumulate so_amount
    totalOR += OrderNumber;  // Accumulate customer_number
  });
  let uniqueso = new Set();
  data.revenue.forEach(revenue => {
    const soAmount = parseFloat(revenue.so_amount) || 0;
    const customerNumber = parseFloat(revenue.customer_number) || 0;
    const leadnumber = parseFloat(revenue.lead) || 0;
     uniqueso.add(revenue.customer_number); 

    totalSoAmount += soAmount;  
    totalCustomerNumber += customerNumber;  
    totalleadNumber += leadnumber;  
  });

  // Update the revenue element with total customer number
  const apElement = document.getElementById('appoint');
  if (apElement) {
    apElement.textContent = totalAP.toLocaleString('en-US');
  }

  // Update the so_number element with total so amount
  const apElement2 = document.getElementById('ap_quality');
  if (apElement2) {
    apElement2.textContent = totalAPQ.toLocaleString('en-US');
  }
 // Update the revenue element with total customer number
 const qtElement = document.getElementById('qt_value');
 if (qtElement) {
  qtElement.textContent = totalSUMQT.toLocaleString('en-US');
 }

 // Update the so_number element with total so amount
 const qtElement2 = document.getElementById('qt_number');
 if (qtElement2) {
  qtElement2.textContent = totalAPQT.toLocaleString('en-US');
 }
 
 
 // Update the revenue element with total customer number
 const orderElement = document.getElementById('order_est');
 if (orderElement) {
  orderElement.textContent = totalSUMOR.toLocaleString('en-US');
 }

 // Update the so_number element with total so amount
 const orderElement2 = document.getElementById('or_number');
 if (orderElement2) {
  orderElement2.textContent = totalOR.toLocaleString('en-US');
 }
  // Update the revenue element with total customer number
  const revenueElement = document.getElementById('revenue');
  if (revenueElement) {
    revenueElement.textContent = totalSoAmount.toLocaleString('en-US');
  }

  // Update the so_number element with total so amount
  const countElement2 = document.getElementById('customer_number');
  if (countElement2) {
    countElement2.textContent = totalCustomerNumber.toLocaleString('en-US');
  }

        const ratio = totalSoAmount / totalCustomerNumber;
        const winrateratio = (totalCustomerNumber / totalQTnumber);
        const ratioElement = document.getElementById('AOV');
        const winrateElement = document.getElementById('winrate');  

        ratioElement.textContent = ratio.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        winrateElement.textContent = (winrateratio * 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}) + '%';


  const tbody = document.querySelector('#region tbody');
  tbody.innerHTML = '';

  data.regions.forEach((row, index) => {
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

 
    
  
    //*****************************pie segment chart ***************************************************//
    function updateChart(data) {
      // Prepare chart data with segment_count as the value for the pie chart
      const chartData = data.segments.map(item => ({
        value: item.segment_count, // This will be the displayed value in the pie chart
        name: item.customer_segment_name, // Segment name for the pie slices
        total_before_vat: item.total_before_vat, // Include total_before_vat for the tooltip
        aov: item.aov
      }));
    
      // Initialize chart on the element with ID 'trafficChart'
      const chart = echarts.init(document.querySelector("#trafficChart"));
    
      // Set chart options
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
 // Format total_before_vat with commas and two decimal places
 const formattedValue = params.data.total_before_vat.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const aov = params.data.aov;

// Calculate the percentage of the segment
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
          data: chartData // Use the prepared chartData
        }]
      });
    }
    let chartInstance = null; // Track the Chart.js instance
    let apexChart = null;     // Track the ApexCharts instance
    function updateReport(data1) {
      const target_revenue = data1.graphData.map(item => item.accumulated_target);
      const saleorderAccu = data1.graphData.map(item => parseFloat(item.accumulated_so).toFixed(0));
      const dateAP = data1.graphData.map(item => item.format_date);
   

      // If ApexCharts already exists, update the series
  if (apexChart !== null) {
    apexChart.updateSeries([
      { name: 'Target', data: target_revenue },
      { name: 'Revenue', data: saleorderAccu }
    ]);
  } else {
    // Initialize ApexCharts
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
    option.value = index + 1; // 1 for January, 2 for February, etc.
    option.text = month;
    monthSelect.appendChild(option);
  });
  
  // Optionally, set the current month as the selected option
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



