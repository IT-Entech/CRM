// Function to debounce fetch calls
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

document.getElementById("waste_name").addEventListener(
  "input",
  debounce(function () {
    const wasteNameInput = this;
    const wasteCodeSelect = document.getElementById("waste_code");

    if (!wasteCodeSelect) {
      console.error("Element with ID 'waste_code' not found.");
      return;
    }

    // Clear previous options, keeping the placeholder
    wasteCodeSelect.innerHTML = '<option value="">Select waste code</option>';

    const wastename = wasteNameInput.value.trim();

    if (wastename.length > 0) {
      const data = new FormData();
      data.append("waste_name", wastename);

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
  }, 500) // Adjust debounce delay (e.g., 500ms)
);
