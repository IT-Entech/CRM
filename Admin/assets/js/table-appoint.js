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

      var permissionNav = document.getElementById('permission-nav');
      var maintenanceNav = document.getElementById('maintanance-nav');
      if(level < 3){
        permissionNav.classList.add('d-none');
        maintenanceNav.classList.add('d-none'); 
      }else{
        permissionNav.classList.remove('d-none');
        maintenanceNav.classList.remove('d-none');
      }

      if (level === 3) { 
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

      fetchData();
    })
    .catch(error => {
      console.error('Error fetching session data:', error);
    });
}

getSessionData();

function fetchData() {
  const year_no = document.getElementById('year').value;
  const month_no = document.getElementById('month').value;
  const Sales = document.getElementById('sales').value;
  
  const url = `fetch-appoint.php?year_no=${year_no}&month_no=${month_no}&Sales=${Sales}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      updateTable(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function updateTable(data) {
  const tbody = document.querySelector('#tableAP tbody');
  tbody.innerHTML = '';

  data.tableData.forEach((row, index) => {
    if (!row || !row.appoint_no) {
      console.error(`Row ${index + 1} is invalid:`, row);
      return;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <th scope='row'>${index+1}</th>
      <td>${row.format_date ? row.format_date : ''}</td>
      <td>${row.format_qtdate ? row.format_qtdate : ''}</td>
      <td>${row.customer_name}</td>
      <td><input type="text" class="form-control" id="appoint_no${index + 1}" name="appoint_no${index + 1}" value="${row.appoint_no}" readonly></td>
      <td id="status-${row.appoint_no}" name="status${index+1}" class="form-control text-center ${row.status == '-' ? 'bg-secondary text-white' : row.status == 'pre quotation' ? 'bg-warning text-muted' : ''}" onchange="handleSelectChange('${row.appoint_no}')">${row.status}</td> 
      <td>
        <input type="text" name="remark${index+1}" class="form-control" value="${row.remark ? row.remark : ''}" id="remark-${row.appoint_no}"${row.is_status == 0 ? 'disabled' : ''}>
      </td>
      <td class="form-control text-center ${row.update_time <= 3 ? 'bg-warning text-white' : row.update_time >= 4 ? 'bg-danger text-white' : row.update_time < 10 ? ' text-muted' : ''}">${row.update_time}</td>
    `;
    tbody.appendChild(tr);
  });
}

function handleSelectChange(appointNo) {                              
  const selectElement = document.getElementById(`status-${appointNo}`);
  const inputElement = document.getElementById(`remark-${appointNo}`);
  const selectedValue = selectElement.value;

  inputElement.disabled = (selectedValue == 0);

  selectElement.classList.remove('bg-secondary', 'bg-warning', 'bg-danger', 'text-white', 'text-muted');

  if (selectedValue == 0) {
    selectElement.classList.add('bg-secondary', 'text-white');
  } else if (selectedValue == 2 || selectedValue == 4) {
    selectElement.classList.add('bg-danger', 'text-white');
  } else if (selectedValue == 3) {
    selectElement.classList.add('bg-warning', 'text-muted');
  }
}

document.addEventListener('DOMContentLoaded', fetchData);

document.addEventListener('DOMContentLoaded', () => {
  fetch('staff_id.php')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const selectElement = document.getElementById('sales');
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.staff_id;
        option.textContent = item.fname_e || item.nick_name || item.staff_id; 
        selectElement.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
});

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

function confirmUpdate() {
  return confirm("Are you sure you want to update the records?");
}
