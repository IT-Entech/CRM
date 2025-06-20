function toggleMaintenanceNav(isVisible) {
  var selectSale = document.getElementById('select-sale');
  if (isVisible) {
     // Show the item
    
    selectSale.classList.remove('d-none');
  } else {
      // Hide the item

    selectSale.classList.add('d-none');
  }
}
function fetchYear() {
const year_no = document.getElementById('year').value;
const month_no = document.getElementById('month').value;
const channel = document.getElementById('channel').value;
const staff = document.getElementById('staff').value;
const is_new = document.getElementById('is_new').value;
let url;

  url = `revenue.php?year_no=${year_no}&month_no=${month_no}&is_new=${is_new}&staff=${staff}`;
  const url1 = `./reportchart.php?year_no=${year_no}&Sales=${staff}&is_new=${is_new}&channel=${channel}`;

fetch(url)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log('Data:', data); // Log the data to check the response
  updateTable(data);
  updateChart(data.segmentData);

})
.catch(error => console.error('Error fetching data:', error));
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
        let totalSum = 0;
        let uniqueso = new Set();
        data.revenueData.forEach(revenue => {
            totalSum += parseFloat(revenue.total_before_vat);
            uniqueso.add(revenue.so_no); 
        });

        const revenueElement = document.getElementById('revenue');
        revenueElement.textContent = totalSum.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }); 

        
        const countElement2 = document.getElementById('so_number');
        countElement2.textContent = uniqueso.size; 




        let totalSum1 = 0;
        data.costsheetData.forEach(qt => {
          totalSum1 += parseFloat(qt.amount);
        });


        // Process appointment data for 2024
        let totalAP = 0;
        let totalappointQT = 0;
        let totalappointQTamount = 0;
        data.appointData.forEach(ap => {
           const appoint = parseFloat(ap.appoint_no) || 0;
           const appointQT = parseFloat(ap.appoint_qt) || 0;
           const appointQTamount = parseFloat(ap.qt_amount) || 0;
           totalAP += appoint;
           totalappointQT += appointQT;
           totalappointQTamount += appointQTamount;
        });
        
        const appointElement = document.getElementById('appoint');
        if (appointElement) {
        appointElement.textContent = totalAP.toLocaleString('en-US');
        }

        const appointQTElement = document.getElementById('qt_number');
         if (appointQTElement) { 
        appointQTElement.textContent = totalappointQT.toLocaleString('en-US');
         }

        const appointQTamountElement = document.getElementById('qt_value');
         if (appointQTamountElement) { 
        appointQTamountElement.textContent = totalappointQTamount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }); 
      }
        let uniqueqt = new Set();
        data.costsheetData.forEach(qt => {
          uniqueqt.add(qt.qt_no); 
        });

        

                // Calculate and display the ratio (revenue per sales order)

        const winrateP = (uniqueso.size / uniqueqt.size) * 100;
        const winratePElement = document.getElementById('winrate');
        winratePElement.textContent = winrateP.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' %';
                // Calculate and display the ratio (revenue per sales order)
        const ratio = totalSum / uniqueso.size;
        const ratioElement = document.getElementById('AOV');
        ratioElement.textContent = ratio.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

const percentage = (ratio / totalSum) * 100;
const percentageElement = document.getElementById('AOV_percent');
percentageElement.textContent = percentage.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}) + ' %';

const tbody = document.querySelector('#region tbody');
  tbody.innerHTML = '';

  data.regionData.forEach((row, index) => {
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
    function updateChart(segmentData) {
      const chartData = segmentData.map(item => ({
        value: item.segment_count,
        name: item.customer_segment_name,
        total_before_vat: item.total_before_vat, // Include total_before_vat for the tooltip
        aov: item.aov
      }));
    
      const chart = echarts.init(document.querySelector("#trafficChart"));
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
                         Ratio: ${percentage} %<br>
                         Value: ${formattedValue}<br>
                         AOV: ${aov}<br>
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

  /*  document.addEventListener('DOMContentLoaded', (event) => {
      fetch('staff_id.php')
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
                  option.textContent = item.fname_e || item.nick_name || item.staff_id; 
                  selectElement.appendChild(option);
              });
          })
          .catch(error => console.error('Error fetching data:', error));
  });*/

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


