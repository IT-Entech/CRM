document.addEventListener('DOMContentLoaded', () => {
  populateMonthYearSelectors();
  document.getElementById('month').addEventListener('change', fetchData);
  document.getElementById('year').addEventListener('change', fetchData);
});

function showPopup() {
  document.getElementById('popupModal').style.display = 'block';
  fetchData();
}

function closePopup() {
  document.getElementById('popupModal').style.display = 'none';
}

function getSessionData() {
  fetch('./header.php')
    .then(response => response.json())
    .then(data => {
      const { name, staff, level, role } = data;
      if (staff == 0 || level < 1) {
        alert("คุณไม่ได้รับสิทธิ์ให้เข้าหน้านี้");
        window.location = "../pages-login.html";
        return;
      }

      const permissionNav = document.getElementById('permission-nav');
      const maintenanceNav = document.getElementById('maintanance-nav');
      if (level < 3) {
        permissionNav.classList.add('d-none');
        maintenanceNav.classList.add('d-none');
      } else {
        permissionNav.classList.remove('d-none');
        maintenanceNav.classList.remove('d-none');
      }

      if (level === 3) {
        fetch('../staff_id.php')
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
          })
          .then(staffData => {
            const selectElement = document.getElementById('Sales');
            staffData.forEach(item => {
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
      document.getElementById('inputSales').value = staff;

      fetchData();
    })
    .catch(error => console.error('Error fetching session data:', error));
}
getSessionData();
function fetchData() {
  const year_no = document.getElementById('year').value;
  const month_no = document.getElementById('month').value;
  const staff = document.getElementById('fetch-staff').value;
  const url = `edit_appoint.php?year_no=${year_no}&month_no=${month_no}&staff=${staff}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => showTableData(data))
    .catch(error => console.error('Error fetching data:', error));
}

function showTableData(data) {
  const tableBody = document.getElementById('dataTableBody');
  tableBody.innerHTML = '';
  const APData = data.ap_data || [];

  APData.forEach(item => {
    const row = document.createElement('tr');

    const cell1 = document.createElement('td');
    cell1.textContent = item.appoint_no;
    cell1.style.cursor = 'pointer';
    cell1.addEventListener('click', () => handleCellClick(item.appoint_no));

    const cell2 = document.createElement('td');
    cell2.textContent = item.appoint_date;

    const cell3 = document.createElement('td');
    cell3.textContent = item.SName;

    const cell4 = document.createElement('td');
    cell4.textContent = item.customer_name;

    row.append(cell1, cell2, cell3, cell4);
    tableBody.appendChild(row);
  });
}

function handleCellClick(appoint_no) {
  fetch(`fetch_ap.php?appoint_no=${appoint_no}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('Data received from server:', data);
      // Optionally update the UI with the new data
    })
    .catch(error => console.error('Error fetching data:', error));
}

function populateMonthYearSelectors() {
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

  monthSelect.value = new Date().getMonth() + 1;

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
