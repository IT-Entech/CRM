// Global variables
var map;
var marker1, marker2, marker3 = null, marker4;
var directionsService;
var directionsRenderer;
var suppliers = [];
var selectedSupplierIndex = 0;
var supplierCosts = [];
var wasteItems = [{ id: 1 }]; // Initialize with one waste item
var nextWasteId = 2;



// Initialize the map
window.initMap = function() {
  const samutPrakarn = { lat: 13.605, lng: 100.5653 };
  const Entech = { lat: 13.5619, lng: 100.653328 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: samutPrakarn,
    zoom: 12,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Create draggable marker for start point
  marker1 = new google.maps.Marker({
    position: Entech,
    map: map,
    draggable: true,
    title: "Start Point",
  });

  // Update marker1 position when start_point select changes
  document.getElementById("start_point").addEventListener("change", function() {
    var coordinates = this.value.split(",");
    var latLng = new google.maps.LatLng(
      Number.parseFloat(coordinates[0]), 
      Number.parseFloat(coordinates[1])
    );
    marker1.setPosition(latLng);
    map.setCenter(latLng);
    calculateDistanceForAllSuppliers();
  });

  google.maps.event.addListener(marker1, "dragend", () => {
    calculateDistanceForAllSuppliers();
  });

  // Add click listener to map to create customer marker
  map.addListener("click", (event) => {
    if (marker2) {
      marker2.setMap(null);
    }

    marker2 = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
      title: "Customer",
    });

    google.maps.event.addListener(marker2, "dragend", () => {
      calculateDistanceForAllSuppliers();
    });

    calculateDistanceForAllSuppliers();
  });

  // Create draggable marker for end point
  marker4 = new google.maps.Marker({
    position: Entech,
    map: map,
    draggable: true,
    title: "End Point",
  });

  // Update marker4 position when finish_point select changes
  document.getElementById("finish_point").addEventListener("change", function() {
    var coordinates = this.value.split(",");
    var latLng = new google.maps.LatLng(
      Number.parseFloat(coordinates[0]), 
      Number.parseFloat(coordinates[1])
    );
    marker4.setPosition(latLng);
    map.setCenter(latLng);
    calculateDistanceForAllSuppliers();
  });

  google.maps.event.addListener(marker4, "dragend", () => {
    calculateDistanceForAllSuppliers();
  });

  // Add search box functionality
  const input = document.getElementById("search-box");
  if (input) {
    const searchBox = new google.maps.places.SearchBox(input);

    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      if (marker2) {
        marker2.setMap(null);
      }

      const place = places[0];

      marker2 = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        draggable: true,
        title: place.name,
      });

      map.setCenter(place.geometry.location);
      map.setZoom(15);

      google.maps.event.addListener(marker2, "dragend", () => {
        calculateDistanceForAllSuppliers();
      });

      calculateDistanceForAllSuppliers();
    });
  }

  // Add event listeners for supplier selection radio buttons
  document.getElementById("selected1").addEventListener("change", function() {
    if (this.checked && supplierCosts.length > 0) {
      const supplier = supplierCosts[0].supplier;
      updateMarker3(supplier);
      selectedSupplierIndex = 0;

      if (supplier && supplier.latitude && supplier.longitude) {
        const supplierPosition = {
          lat: Number.parseFloat(supplier.latitude),
          lng: Number.parseFloat(supplier.longitude),
        };
        calculateRouteForSupplier(supplierPosition);
      }
    }
  });

  document.getElementById("selected2").addEventListener("change", function() {
    if (this.checked && supplierCosts.length > 1) {
      const supplier = supplierCosts[1].supplier;
      updateMarker3(supplier);
      selectedSupplierIndex = 1;

      if (supplier && supplier.latitude && supplier.longitude) {
        const supplierPosition = {
          lat: Number.parseFloat(supplier.latitude),
          lng: Number.parseFloat(supplier.longitude),
        };
        calculateRouteForSupplier(supplierPosition);
      }
    }
  });

  document.getElementById("selected3").addEventListener("change", function() {
    if (this.checked && supplierCosts.length > 2) {
      const supplier = supplierCosts[2].supplier;
      updateMarker3(supplier);
      selectedSupplierIndex = 2;

      if (supplier && supplier.latitude && supplier.longitude) {
        const supplierPosition = {
          lat: Number.parseFloat(supplier.latitude),
          lng: Number.parseFloat(supplier.longitude),
        };
        calculateRouteForSupplier(supplierPosition);
      }
    }
  });

  setupWasteCodeChangeListeners();
};


// Function to update waste code dropdown based on waste name
function updateWasteCodeOptions(wasteNameInput, wasteCodeSelect) {
  const wasteName = wasteNameInput.value;
  fetch("../fetch_cal_cost.php", {
    method: "POST",
    body: data,
  })
  .then(response => response.json())
        .then(data => {
          console.log("Received Data:", data);
          if (data.waste_codes && data.waste_codes.length > 0) {
            const uniqueCodes = new Set();
  const wasteData = mockWasteData.find(w => w.name === wasteName);
  
  // Clear existing options
  wasteCodeSelect.innerHTML = "";
  
  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "กรุณาเลือก...";
  wasteCodeSelect.appendChild(defaultOption);
  
  // Add waste code options if waste name is found
  if (wasteData) {
    data.waste_codes.codes.forEach(code => {
      const option = document.createElement("option");
      option.value = code.code;
      option.textContent = `${code.code}: ${code.description}`;
      wasteCodeSelect.appendChild(option);
    });
  }
}
})
}

// Function to set up waste code change listeners
function setupWasteCodeChangeListeners() {
  document.querySelectorAll('.waste-code').forEach(select => {
    select.addEventListener('change', function() {
      fetchSuppliers(this.value);
    });
  });
}

// Function to add waste item
function addWasteItem() {
  const wasteId = nextWasteId++;
  wasteItems.push({ id: wasteId });
  
  const wasteItemsContainer = document.getElementById('wasteItemsContainer');
  const wasteItemDiv = document.createElement('div');
  wasteItemDiv.className = 'waste-item';
  wasteItemDiv.dataset.id = wasteId;
  
  wasteItemDiv.innerHTML = `
  <div class="row">
      <div class="col-md-5">
        <label for="waste_name_${wasteId}" class="form-label">Waste Name:</label>
        <input type="text" class="form-control waste-name" id="waste_name_${wasteId}" required>
      </div>
      <div class="col-md-5">
        <label for="waste_code_${wasteId}" class="form-label">Waste Code:</label>
        <select class="form-select waste-code" id="waste_code_${wasteId}">
          <option value="">กรุณาเลือก...</option>
        </select>
      </div>
      <div class="col-md-2">
        <button type="button" class="remove-waste-btn">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `;
  
  wasteItemsContainer.appendChild(wasteItemDiv);
  
  // Enable all remove buttons when there's more than one waste item
  if (wasteItems.length > 1) {
    document.querySelectorAll('.remove-waste-btn').forEach(btn => {
      btn.disabled = false;
    });
  }
  
  // Add event listener for waste name input
  const wasteNameInput = wasteItemDiv.querySelector('.waste-name');
  const wasteCodeSelect = wasteItemDiv.querySelector('.waste-code');
  
  wasteNameInput.addEventListener('input', function() {
    updateWasteCodeOptions(this, wasteCodeSelect);
  });
  
  // Add event listener for waste code select
  wasteCodeSelect.addEventListener('change', function() {
    fetchSuppliers(this.value);
  });
  
  // Add event listener for remove button
  const removeBtn = wasteItemDiv.querySelector('.remove-waste-btn');
  removeBtn.addEventListener('click', function() {
    removeWasteItem(wasteId);
  });
}

// Function to remove waste item
function removeWasteItem(id) {
  if (wasteItems.length <= 1) return;
  
  wasteItems = wasteItems.filter(item => item.id !== id);
  const wasteItemDiv = document.querySelector(`.waste-item[data-id="${id}"]`);
  if (wasteItemDiv) {
    wasteItemDiv.remove();
  }
  
  // Disable remove button if only one waste item remains
  if (wasteItems.length === 1) {
    document.querySelectorAll('.remove-waste-btn').forEach(btn => {
      btn.disabled = true;
    });
  }
}

// Function to fetch suppliers based on waste code
function fetchSuppliers(wasteCode) {
  if (!wasteCode) return;
  
  // For demonstration, we'll use mock supplier data
  // In a real implementation, you would make an API call to fetch suppliers
  
  const formData = new FormData()
  formData.append("waste_code", wasteCode)

  fetch("../calculate_supplier.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.details && data.details.length > 0) {
        // Store all suppliers
        suppliers = data.details

        // Reset supplier costs array
        supplierCosts = []

        // Calculate distances for all suppliers
        calculateDistanceForAllSuppliers()
      } else {
        console.log("No suppliers found for this waste code")
      }
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error)
    })
}

// Function to update marker3 with supplier data
function updateMarker3(supplier) {
  if (!supplier || !supplier.latitude || !supplier.longitude) return;

  const supplierPosition = {
    lat: Number.parseFloat(supplier.latitude),
    lng: Number.parseFloat(supplier.longitude),
  };

  // If marker3 doesn't exist, create it
  if (!marker3) {
    marker3 = new google.maps.Marker({
      position: supplierPosition,
      map: map,
      draggable: true,
      title: supplier.supplier_name || "Supplier",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
    });

    google.maps.event.addListener(marker3, "dragend", () => {
      calculateDistanceForAllSuppliers();
    });
  } else {
    // Update existing marker3
    marker3.setPosition(supplierPosition);
    marker3.setTitle(supplier.supplier_name || "Supplier");
    marker3.setMap(map);
  }

  // Pan the map to show the marker
  map.panTo(supplierPosition);
}

// Function to calculate route for the selected supplier
function calculateRouteForSupplier(supplierPosition) {
  if (!marker1 || !marker2 || !marker4) {
    console.log("Missing required markers");
    return;
  }

  const origin = marker1.getPosition();
  const customer = marker2.getPosition();
  const setpoint = marker4.getPosition();

  const request = {
    origin: origin,
    destination: setpoint,
    waypoints: [
      { location: customer, stopover: true },
      { location: supplierPosition, stopover: true },
    ],
    travelMode: "DRIVING",
  };

  // Calculate route for this supplier
  directionsService.route(request, (response, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(response);
    } else {
      console.error("Error calculating route: " + status);
    }
  });
}

// Function to calculate distances for all suppliers
function calculateDistanceForAllSuppliers() {
  if (!marker1 || !marker2 || !marker4 || suppliers.length === 0) {
    console.log("Missing required markers or suppliers");
    return;
  }

  // Reset supplier costs array
  supplierCosts = [];

  // Counter for tracking completed calculations
  let completedCalculations = 0;

  // Calculate for each supplier
  for (let i = 0; i < suppliers.length; i++) {
    const supplier = suppliers[i];
    if (!supplier || !supplier.latitude || !supplier.longitude) {
      completedCalculations++;
      continue;
    }

    const supplierPosition = {
      lat: Number.parseFloat(supplier.latitude),
      lng: Number.parseFloat(supplier.longitude),
    };

    calculateDistanceAndCostForSupplier(supplierPosition, supplier, i, () => {
      completedCalculations++;

      // If all calculations are done, sort and update UI
      if (completedCalculations === suppliers.length) {
        // Sort suppliers by total cost (cheapest first)
        supplierCosts.sort((a, b) => a.totalCost - b.totalCost);

        // Update UI with sorted data
        updateSupplierUI();
        
        // Show calculation results
        document.getElementById('calculationResults').style.display = 'block';
      }
    });
  }
}

// Function to calculate distance and cost for a specific supplier
function calculateDistanceAndCostForSupplier(supplierPosition, supplier, index, callback) {
  if (!marker1 || !marker2 || !marker4) {
    console.log("Missing required markers");
    if (callback) callback();
    return;
  }

  const origin = marker1.getPosition();
  const customer = marker2.getPosition();
  const setpoint = marker4.getPosition();

  const request = {
    origin: origin,
    destination: setpoint,
    waypoints: [
      { location: customer, stopover: true },
      { location: supplierPosition, stopover: true },
    ],
    travelMode: "DRIVING",
  };

  // Calculate route for this supplier
  directionsService.route(request, (response, status) => {
    if (status === "OK") {
      var totalDistance = 0;

      // Calculate total distance
      response.routes[0].legs.forEach((leg) => {
        totalDistance += leg.distance.value;
      });

      // Calculate transport cost
      calculateTransportCostForSupplier(totalDistance, supplier, index, callback);
    } else {
      console.error("Error calculating route for supplier " + index + ": " + status);
      if (callback) callback();
    }
  });
}

// Function to calculate transport cost for a specific supplier
function calculateTransportCostForSupplier(totalDistance, supplier, index, callback) {
    fetch("../transport_cost.php")
    .then((response) => response.json())
    .then((data) => {
    const Config = data
    const truckConfig = {
        truckSmall: {
          fuelRate: Config.truckSmall.fuelRate,
          divisor: Config.truckSmall.divisor,
          maintanance: Config.truckSmall.maintanance,
          fixcost: Config.truckSmall.fixcost,
        },
        truck: {
          fuelRate: Config.truck.fuelRate,
          divisor: Config.truck.divisor,
          maintanance: Config.truck.maintanance,
          fixcost: Config.truck.fixcost,
        },
      };

  let selectedTruck = "";
  const truckSmallRadio = document.getElementById("gridRadios1");
  const truckLargeRadio = document.getElementById("gridRadios2");

  if (truckSmallRadio && truckSmallRadio.checked) {
    selectedTruck = "truckSmall";
  } else if (truckLargeRadio && truckLargeRadio.checked) {
    selectedTruck = "truck";
  } else {
    selectedTruck = "truckSmall"; // fallback
  }

  const truck = Config[selectedTruck];
  const fixcost = truck.fixcost;

  // Extract fixed costs safely
  const fixDriver = fixcost.Driver || fixcost.Tech || 0;
  const fixAssist = fixcost.Assist || fixcost.TechAssist || 0;
  const fixBase = fixcost.bigtrans || fixcost.smalltrans || 0;
  const fixTotal = fixDriver + fixAssist + fixBase;

  const distanceInKm = totalDistance / 1000;
  const maintananceCost = distanceInKm * truck.maintanance;
  const transportCost = (distanceInKm / truck.divisor) * truck.fuelRate;
  const fullTransportCost = transportCost + fixTotal + maintananceCost;

  // Calculate disposal cost
  const disposalCost = supplier.cost_rate ? Number.parseFloat(supplier.cost_rate) : 0;

  // Calculate total cost
  const totalCost = fullTransportCost + disposalCost;

  // Store the calculated costs with the supplier data
  supplierCosts.push({
    supplier: supplier,
    Distance: distanceInKm,
    transportCost: fullTransportCost,
    disposalCost: disposalCost,
    totalCost: totalCost,
    originalIndex: index,
  });

  if (callback) callback();
})
.catch((error) => {
    console.error("Error fetching API data:", error)
    if (callback) callback()
  })
}
// Function to update UI with sorted supplier data
function updateSupplierUI() {
  // Clear existing data in all boxes first
  for (let i = 1; i <= 3; i++) {
    const supplierEl = document.getElementById(`supplier${i}`);
    const supplierCodeEl = document.getElementById(`supplier_code${i}`);
    const accountEl = document.getElementById(`account${i}`);
    const distanceEl = document.getElementById(`distance${i}`);
    const disposalCodeEl = document.getElementById(`disposal_code${i}`);
    const disposalCostEl = document.getElementById(`disposal_cost${i}`);
    const transportCostEl = document.getElementById(`transport_cost${i}`);
    const totalCostEl = document.getElementById(`total_cost${i}`);

    if (supplierEl) supplierEl.textContent = "No data";
    if (accountEl) accountEl.textContent = "(0)";
    if (distanceEl) distanceEl.textContent = "-";
    if (supplierCodeEl) supplierCodeEl.textContent = "-";
    if (disposalCodeEl) disposalCodeEl.textContent = "-";
    if (disposalCostEl) disposalCostEl.textContent = "-";
    if (transportCostEl) transportCostEl.textContent = "-";
    if (totalCostEl) totalCostEl.textContent = "-";
  }

  // Now populate with sorted supplier data
  for (let i = 0; i < Math.min(supplierCosts.length, 3); i++) {
    const supplierData = supplierCosts[i];
    if (!supplierData || !supplierData.supplier) continue;

    const supplier = supplierData.supplier;
    const boxIndex = i + 1;

    const supplierEl = document.getElementById(`supplier${boxIndex}`);
    const supplierCodeEl = document.getElementById(`supplier_code${boxIndex}`);
    const accountEl = document.getElementById(`account${boxIndex}`);
    const distanceEl = document.getElementById(`distance${boxIndex}`);
    const disposalCodeEl = document.getElementById(`disposal_code${boxIndex}`);
    const disposalCostEl = document.getElementById(`disposal_cost${boxIndex}`);
    const transportCostEl = document.getElementById(`transport_cost${boxIndex}`);
    const totalCostEl = document.getElementById(`total_cost${boxIndex}`);

    if (supplierEl) supplierEl.textContent = supplier.supplier_name || "No data";
    if (supplierCodeEl) supplierCodeEl.textContent = supplier.supplier_code || "-";
    if (accountEl) accountEl.textContent = `(${supplier.supplier_account_no || 0})`;
    if (distanceEl) distanceEl.textContent = supplierData.Distance.toFixed(2) + " km";
    if (disposalCodeEl) disposalCodeEl.textContent = supplier.eliminate_code || "-";
    if (disposalCostEl) disposalCostEl.innerText = supplierData.disposalCost.toFixed(2) + " ฿";
    if (transportCostEl) transportCostEl.innerText = supplierData.transportCost.toFixed(2) + " ฿";
    if (totalCostEl) totalCostEl.innerText = supplierData.totalCost.toFixed(2) + " ฿";
  }

  // Set the first supplier as active if we have suppliers
  if (supplierCosts.length > 0) {
    updateMarker3(supplierCosts[0].supplier);
    selectedSupplierIndex = 0;
    document.getElementById("selected1").checked = true;

    // Render directions for the selected supplier
    if (supplierCosts[0].supplier && supplierCosts[0].supplier.latitude && supplierCosts[0].supplier.longitude) {
      const supplierPosition = {
        lat: Number.parseFloat(supplierCosts[0].supplier.latitude),
        lng: Number.parseFloat(supplierCosts[0].supplier.longitude),
      };
      calculateRouteForSupplier(supplierPosition);
    }
  }
}

// Function to reset the form
function resetForm() {
  // Reset waste items
  const wasteItemsContainer = document.getElementById('wasteItemsContainer');
  wasteItemsContainer.innerHTML = `
    <div class="waste-item" data-id="1">
      <div class="row">
        <div class="col-md-5">
          <label for="waste_name_1" class="form-label">Waste Name:</label>
          <input type="search" class="form-control waste-name" id="waste_name_1" list="wasteOptions" required>
        </div>
        <div class="col-md-5">
          <label for="waste_code_1" class="form-label">Waste Code:</label>
          <select class="form-select waste-code" id="waste_code_1">
            <option value="">กรุณาเลือก...</option>
          </select>
        </div>
        <div class="col-md-2">
          <button type="button" class="remove-waste-btn" disabled>
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Reset waste items array
  wasteItems = [{ id: 1 }];
  nextWasteId = 2;
  
  // Reset truck type
  document.getElementById('gridRadios1').checked = true;
  
  // Hide calculation results
  document.getElementById('calculationResults').style.display = 'none';
  
  // Reset map if needed
  if (marker2) {
    marker2.setMap(null);
    marker2 = null;
  }
  
  if (marker3) {
    marker3.setMap(null);
    marker3 = null;
  }
  
  if (directionsRenderer) {
    directionsRenderer.setDirections({ routes: [] });
  }
  
  // Reset suppliers and costs
  suppliers = [];
  supplierCosts = [];
  
  // Set up waste code change listeners again
  setupWasteCodeChangeListeners();
  
  // Add event listener for the first waste name input
  const wasteNameInput = document.getElementById('waste_name_1');
  const wasteCodeSelect = document.getElementById('waste_code_1');
  
  if (wasteNameInput && wasteCodeSelect) {
    wasteNameInput.addEventListener('input', function() {
      updateWasteCodeOptions(this, wasteCodeSelect);
    });
  }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add event listener for add waste button
  document.getElementById('addWasteBtn').addEventListener('click', addWasteItem);
  
  // Add event listener for calculate button
  document.getElementById('calculateBtn').addEventListener('click', function() {
    calculateDistanceForAllSuppliers();
  });
  
  // Add event listener for reset button
  document.getElementById('resetBtn').addEventListener('click', resetForm);
  
  // Add event listener for the first waste name input
  const wasteNameInput = document.getElementById('waste_name_1');
  const wasteCodeSelect = document.getElementById('waste_code_1');
  
  if (wasteNameInput && wasteCodeSelect) {
    wasteNameInput.addEventListener('input', function() {
      updateWasteCodeOptions(this, wasteCodeSelect);
    });
  }
});