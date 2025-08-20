function getSessionData() {
  fetch('../../header.php')
    .then(response => response.json())
    .then(data => {
      const { name, staff, level, role } = data;

      if (staff == 0 || level < 1) {
        alert("คุณไม่ได้รับสิทธิ์ให้เข้าหน้านี้");
        window.location = "../../pages-login.html";
        return;
      }

      const permissionNav = document.getElementById('permission-nav');
      const maintenanceNav = document.getElementById('maintanance-nav');
      if (role === 'MK Online' || role === 'MK Offline') {
        permissionNav.classList.add('d-none');
        maintenanceNav.classList.add('d-none');
      } else {
        permissionNav.classList.remove('d-none');
        maintenanceNav.classList.remove('d-none');
      }

      const allOption = document.getElementById('all-select-channel');
      const onlineOption = document.getElementById('OnL');
      const offlineOption = document.getElementById('OfL');
      if (role === 'MK Online') {
        offlineOption.classList.add('d-none');
        allOption.classList.add('d-none');
      } else if (role === 'MK Offline') {
        onlineOption.classList.add('d-none');
        allOption.classList.add('d-none');
      }

      document.getElementById('fetch-level').value = level;
      document.getElementById('name-display').textContent = name;
      document.getElementById('name-display1').textContent = name;
      document.getElementById('position-name').textContent = role;
      document.getElementById('fetch-staff').value = staff;
    })
    .catch(error => {
      console.error('Error fetching session data:', error);
    });
}

getSessionData();

function fetchData() {
  fetch('Query_permission.php')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      Table(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function Table(data) {
  const tbody = document.querySelector('#tablepm tbody');
  tbody.innerHTML = '';

  data.permission.forEach((row, index) => {
    const tr = document.createElement('tr');

    // Level select
    const levelSelect = document.createElement('select');
    levelSelect.id = `level${index + 1}`;
    levelSelect.name = `level${index + 1}`;
    levelSelect.className = 'form-select';
    levelSelect.style.cursor = 'pointer';

    const levelOptions = [
      { text: 'User', value: 1 },
      { text: 'Admin', value: 2 },
      { text: 'Super Admin', value: 3 }
    ];
    const currentLevelText = row.level === 1 ? 'User' : row.level === 2 ? 'Admin' : row.level === 3 ? 'Super Admin' : 'Other';
    levelOptions.unshift({ text: currentLevelText, value: row.level });

    levelOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      levelSelect.appendChild(option);
    });

    // Role select
    const roleSelect = document.createElement('select');
    roleSelect.id = `Role${index + 1}`;
    roleSelect.name = `Role${index + 1}`;
    roleSelect.className = 'form-select';
    roleSelect.style.cursor = 'pointer';

    let roleOptions = [
      { text: 'Unknown', value: 'Unknown' },
      { text: 'MK Online', value: 'MK Online' },
      { text: 'MK Offline', value: 'MK Offline' },
      { text: 'MK', value: 'MK' },
      { text: 'Super Admin', value: 'SUPER ADMIN' },
      { text: 'OPL', value: 'OPL' }
    ];

    const currentRoleText = ['MK', 'MK Online', 'SUPER ADMIN', 'MK Offline', 'OPL'].includes(row.Role) ? row.Role : 'Unknown';
    const currentRoleOption = { text: currentRoleText, value: row.Role };
    roleOptions = roleOptions.filter(opt => opt.value !== currentRoleOption.value);
    roleOptions.unshift(currentRoleOption);

    roleOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.text;
      roleSelect.appendChild(option);
    });

    tr.innerHTML = `
      <th scope='row'>
        <input type="text" class="form-control" id="id${index + 1}" name="id${index + 1}" value="${row.id}" readonly>
      </th>
      <td>${row.Name}</td>
      <td>${levelSelect.outerHTML}</td>
      <td>${roleSelect.outerHTML}</td>
      <td style="text-align: center;">
        <input type="hidden" name="active${index + 1}" value="N">
        <input class="form-check-input" type="checkbox" id="active${index + 1}" name="active${index + 1}" value="Y" ${row.active === 'Y' ? 'checked' : ''}>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', fetchData);