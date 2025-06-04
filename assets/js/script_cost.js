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
