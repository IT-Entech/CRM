function getSessionData() {
  fetch('./header.php')
    .then(response => response.json()) // Parse the JSON from the response
    .then(data => {
      //console.log('Session Data:', data);

      const { name, staff, level, role, position } = data;
       //console.log(`Name: ${name}, Staff: ${staff}, Level: ${level}, Role: ${role}`);
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
    const eliminateSelect = document.getElementById("eliminate_code");
    const wasteCodeSelect = document.getElementById("waste_code");
    const segmentSelect = document.getElementById("segment");

    if (!wasteCodeSelect || !segmentSelect || !eliminateSelect) {
      console.error("Required element(s) not found: 'waste_code' or 'segment'");
      return;
    }

    // เคลียร์ตัวเลือกเดิม (ยกเว้น placeholder)
    eliminateSelect.innerHTML = '<option value="">Select eliminate code</option>';
    wasteCodeSelect.innerHTML = '<option value="">Select waste code</option>';

    const wastename = wasteNameInput.value.trim();
    const segment = segmentSelect.value.trim();


 if (wastename.length > 0 && segment.length > 0) {
      const data = new FormData();
      data.append("waste_name", wastename);
      data.append("segment", segment);

      fetch("../fetch_eliminate.php", {
        method: "POST",
        body: data,
      })
        .then(response => response.json())
        .then(data => {
          //console.log("Received Data:", data);

          if (data.eliminate_codes && data.eliminate_codes.length > 0) {
            const uniqueCodes = new Set();

            data.eliminate_codes.forEach(eliminate => {
              if (!uniqueCodes.has(eliminate.eliminate_code)) {
                uniqueCodes.add(eliminate.eliminate_code);

                const option = document.createElement("option");
                option.value = eliminate.eliminate_code;
                option.textContent = `${eliminate.eliminate_code}: ${eliminate.eliminate_name}`;
                eliminateSelect.appendChild(option);
              }
            });
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No results found";
            eliminateSelect.appendChild(option);
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          alert("Error fetching data. Please try again.");
        });
    }

  }, 500) // ปรับเวลา debounce ได้ตามต้องการ
);


document.getElementById("eliminate_code").addEventListener("change", function () {
  const eliminate = this.value.trim();
  const wasteName = document.getElementById("waste_name").value.trim();
  const segment = document.getElementById("segment").value.trim();
  const wasteCodeSelect = document.getElementById("waste_code");

  if (wasteName && segment && eliminate) {
    const data = new FormData();
    data.append("waste_name", wasteName);
    data.append("segment", segment);
    data.append("eliminate", eliminate);

    fetch("../fetch_cal_cost.php", {
      method: "POST",
      body: data,
    })
      .then(response => response.json())
      .then(data => {
        wasteCodeSelect.innerHTML = '<option value="">Select waste code</option>';
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
        console.error("Error fetching waste codes:", error);
        alert("Error fetching waste codes.");
      });
  }
});
// Event: เมื่อเปลี่ยนค่า segment
document.getElementById("segment").addEventListener("change", function () {
  const wasteNameInput = document.getElementById("waste_name");
  const wasteCodeSelect = document.getElementById("waste_code");
   const eliminateCodeSelect = document.getElementById("eliminate_code");

  if (wasteNameInput) {
    wasteNameInput.value = ""; // ล้างค่าในช่อง waste_name
  }

  if (wasteCodeSelect) {
    wasteCodeSelect.innerHTML = '<option value="">เลือกรหัสของเสีย</option>'; // ล้าง options เดิม
  }

   if (eliminateCodeSelect) {
    eliminateCodeSelect.innerHTML = '<option value="">เลือกรหัสกำจัด</option>'; // ล้าง options เดิม
  }
});


