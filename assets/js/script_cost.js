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

      var permissionNav = document.getElementById('permission-nav');
      var maintenanceNav = document.getElementById('maintanance-nav');
      if(level < 3){
        
        permissionNav.classList.add('d-none');
        maintenanceNav.classList.add('d-none'); 
      }else{
        permissionNav.classList.remove('d-none');
        maintenanceNav.classList.remove('d-none');
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
      if (level === 3) { 
        var maintenanceNav = document.getElementById('maintanance-nav');
      selectSale.classList.remove('d-none'); // แสดง select-sale เฉพาะ level 3
  toggleMaintenanceNav(true);

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

    })
    .catch(error => {
      console.error('Error fetching session data:', error);
    });
}

// Call the function to fetch session data
getSessionData();
// Function to debounce fetch calls
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Event: เมื่อพิมพ์ในช่อง waste_name
document.getElementById("waste_name").addEventListener(
  "input",
  debounce(function () {
    const wasteNameInput = this;
    const wasteCodeSelect = document.getElementById("waste_code");
    const segmentSelect = document.getElementById("segment");

    if (!wasteCodeSelect || !segmentSelect) {
      console.error("Required element(s) not found: 'waste_code' or 'segment'");
      return;
    }

    // เคลียร์ตัวเลือกเดิม (ยกเว้น placeholder)
    wasteCodeSelect.innerHTML = '<option value="">Select waste code</option>';

    const wastename = wasteNameInput.value.trim();
    const segment = segmentSelect.value.trim();

    // ตรวจสอบว่าทั้ง waste_name และ segment มีค่า
    if (wastename.length > 0 && segment.length > 0) {
      const data = new FormData();
      data.append("waste_name", wastename);
      data.append("segment", segment);

      fetch("../fetch_cal_cost.php", {
        method: "POST",
        body: data,
      })
        .then(response => response.json())
        .then(data => {
          console.log("Received Data:", data);

          if (data.waste_codes && data.waste_codes.length > 0) {
            const uniqueCodes = new Set();

            data.waste_codes.forEach(waste => {
              if (!uniqueCodes.has(waste.waste_code)) {
                uniqueCodes.add(waste.waste_code);

                const option = document.createElement("option");
                option.value = waste.waste_code;
                option.textContent = `${waste.waste_code}: ${waste.waste_name}`;
                wasteCodeSelect.appendChild(option);
              }
            });
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No results found";
            wasteCodeSelect.appendChild(option);
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          alert("Error fetching data. Please try again.");
        });
    }
  }, 500) // ปรับเวลา debounce ได้ตามต้องการ
);

// Event: เมื่อเปลี่ยนค่า segment
document.getElementById("segment").addEventListener("change", function () {
  const wasteNameInput = document.getElementById("waste_name");
  const wasteCodeSelect = document.getElementById("waste_code");

  if (wasteNameInput) {
    wasteNameInput.value = ""; // ล้างค่าในช่อง waste_name
  }

  if (wasteCodeSelect) {
    wasteCodeSelect.innerHTML = '<option value="">Select waste code</option>'; // ล้าง options เดิม
  }
});
