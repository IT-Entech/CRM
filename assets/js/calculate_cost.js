var map
var marker1,
  marker2,
  marker3 = null,
  marker4 // Set marker3 to null initially
var directionsService
var directionsRenderer
window.initMap = initMap

// Store supplier markers and data
var suppliers = []
var selectedSupplierIndex = 0
var supplierCosts = [] // Array to store calculated costs for sorting

function initMap() {
  const samutPrakarn = { lat: 13.605, lng: 100.5653 }
  const Entech = { lat: 13.5619, lng: 100.653328 }

  map = new google.maps.Map(document.getElementById("map"), {
    center: samutPrakarn,
    zoom: 12,
  })

  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(map)

  // สร้าง Marker ที่สามารถลากได้
  marker1 = new google.maps.Marker({
    position: Entech,
    map: map,
    draggable: true,
    title: "จุดเริ่มต้น",
  })

  document.getElementById("start_point")?.addEventListener("change", function () {
    var coordinates = this.value.split(",")
    var latLng = new google.maps.LatLng(Number.parseFloat(coordinates[0]), Number.parseFloat(coordinates[1]))
    marker1.setPosition(latLng)
    map.setCenter(latLng)
    calculateDistanceForAllSuppliers()
  })

  google.maps.event.addListener(marker1, "dragend", () => {
    calculateDistanceForAllSuppliers()
  })

  // เมื่อคลิกบนแผนที่เพื่อสร้างหมุดใหม่
  map.addListener("click", (event) => {
    if (marker2) {
      marker2.setMap(null)
    }

    marker2 = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
      title: "ลูกค้า",
    })

    google.maps.event.addListener(marker2, "dragend", () => {
      calculateDistanceForAllSuppliers()
    })

    calculateDistanceForAllSuppliers()
  })

  // marker3 is initially null, not created here

  // สร้าง Marker ที่ 4
  marker4 = new google.maps.Marker({
    position: Entech,
    map: map,
    draggable: true,
    title: "จุดสิ้นสุด",
  })

  // ฟังค์ชั่นเพื่ออัปเดตตำแหน่งของ Marker 4 เมื่อเลือกสถานที่จาก select box
  document.getElementById("finish_point")?.addEventListener("change", function () {
    var coordinates = this.value.split(",")
    var latLng = new google.maps.LatLng(Number.parseFloat(coordinates[0]), Number.parseFloat(coordinates[1]))
    marker4.setPosition(latLng)
    map.setCenter(latLng)
    calculateDistanceForAllSuppliers()
  })

  google.maps.event.addListener(marker4, "dragend", () => {
    calculateDistanceForAllSuppliers()
  })

  document.getElementById("calculateBtn")?.addEventListener("click", () => {
    calculateDistanceForAllSuppliers()
  })

  // เพิ่ม Search Box สำหรับ Marker 2
  const input = document.getElementById("search-box")
  if (input) {
    const searchBox = new google.maps.places.SearchBox(input)

    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds())
    })

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces()

      if (places.length == 0) {
        return
      }

      if (marker2) {
        marker2.setMap(null)
      }

      const place = places[0]

      marker2 = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        draggable: true,
        title: place.name,
      })

      map.setCenter(place.geometry.location)
      map.setZoom(15)

      google.maps.event.addListener(marker2, "dragend", () => {
        calculateDistanceForAllSuppliers()
      })

      calculateDistanceForAllSuppliers()
    })
  }

  // Add event listener for waste_code selection
  if (document.getElementById("waste_code")) {
    document.getElementById("waste_code").addEventListener("change", function () {
      fetchSuppliers(this.value)
    })
  }

  // Add event listeners for the radio buttons
  document.getElementById("selected1").addEventListener("change", function () {
    if (this.checked && supplierCosts.length > 0) {
      const supplier = supplierCosts[0].supplier
      updateMarker3(supplier)
      selectedSupplierIndex = 0

      // Update directions for the selected supplier
      if (supplier && supplier.latitude && supplier.longitude) {
        const supplierPosition = {
          lat: Number.parseFloat(supplier.latitude),
          lng: Number.parseFloat(supplier.longitude),
        }
        calculateRouteForSupplier(supplierPosition)
      }
    }
  })

  document.getElementById("selected2").addEventListener("change", function () {
    if (this.checked && supplierCosts.length > 1) {
      const supplier = supplierCosts[1].supplier
      updateMarker3(supplier)
      selectedSupplierIndex = 1

      // Update directions for the selected supplier
      if (supplier && supplier.latitude && supplier.longitude) {
        const supplierPosition = {
          lat: Number.parseFloat(supplier.latitude),
          lng: Number.parseFloat(supplier.longitude),
        }
        calculateRouteForSupplier(supplierPosition)
      }
    }
  })

  document.getElementById("selected3").addEventListener("change", function () {
    if (this.checked && supplierCosts.length > 2) {
      const supplier = supplierCosts[2].supplier
      updateMarker3(supplier)
      selectedSupplierIndex = 2

      // Update directions for the selected supplier
      if (supplier && supplier.latitude && supplier.longitude) {
        const supplierPosition = {
          lat: Number.parseFloat(supplier.latitude),
          lng: Number.parseFloat(supplier.longitude),
        }
        calculateRouteForSupplier(supplierPosition)
      }
    }
  })
}

// Function to fetch suppliers based on waste_code
function fetchSuppliers(wasteCode) {
  if (!wasteCode) return

 // ดึงค่า segment จาก DOM
  const segmentSelect = document.getElementById("segment");
  const segment = segmentSelect ? segmentSelect.value : "";

  if (!segment) {
    console.warn("Segment not selected.");
    return;
  }

  // Create form data for POST request
  const formData = new FormData()
  formData.append("waste_code", wasteCode);
  formData.append("segment", segment);
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

// Modified function to update marker3 with supplier data
function updateMarker3(supplier) {
  if (!supplier || !supplier.latitude || !supplier.longitude) return

  const supplierPosition = {
    lat: Number.parseFloat(supplier.latitude),
    lng: Number.parseFloat(supplier.longitude),
  }

  // If marker3 doesn't exist, create it
  if (!marker3) {
    marker3 = new google.maps.Marker({
      position: supplierPosition,
      map: map,
      draggable: true,
      title: supplier.supplier_name || "ปลายทาง",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Use a different color to make it more visible
      },
    })

    google.maps.event.addListener(marker3, "dragend", () => {
      calculateDistanceForAllSuppliers()
    })
  } else {
    // Update existing marker3
    marker3.setPosition(supplierPosition)
    marker3.setTitle(supplier.supplier_name || "ปลายทาง")

    // Make sure marker3 is visible on the map
    marker3.setMap(map)
  }

  // Pan the map to show the marker
  map.panTo(supplierPosition)
}

// Function to update UI with sorted supplier data
function updateSupplierUI() {
  // Clear existing data in all boxes first
  for (let i = 1; i <= 3; i++) {
    const supplierEl = document.getElementById(`supplier${i}`)
    const supplierCodeEl = document.getElementById(`supplier_code${i}`)
    const accountEl = document.getElementById(`account${i}`)
    const distanceEl = document.getElementById(`distance${i}`)
    const disposalCodeEl = document.getElementById(`disposal_code${i}`)
    const disposalCostEl = document.getElementById(`disposal_cost${i}`)
    const transportCostEl = document.getElementById(`transport_cost${i}`)
    const totalCostEl = document.getElementById(`total_cost${i}`)

    if (supplierEl) supplierEl.textContent = "ไม่มีข้อมูล"
    if (accountEl) accountEl.textContent = "(0)"
    if (distanceEl) distanceEl.textContent = "-"
    if (supplierCodeEl) supplierCodeEl.textContent = "-"
    if (disposalCodeEl) disposalCodeEl.textContent = "-"
    if (disposalCostEl) disposalCostEl.textContent = "-"
    if (transportCostEl) transportCostEl.textContent = "-"
    if (totalCostEl) totalCostEl.textContent = "-"
  }

  // Now populate with sorted supplier data
  for (let i = 0; i < Math.min(supplierCosts.length, 3); i++) {
    const supplierData = supplierCosts[i]
    if (!supplierData || !supplierData.supplier) continue

    const supplier = supplierData.supplier
    const boxIndex = i + 1

    const supplierEl = document.getElementById(`supplier${boxIndex}`)
    const supplierCodeEl = document.getElementById(`supplier_code${boxIndex}`)
    const accountEl = document.getElementById(`account${boxIndex}`)
    const distanceEl = document.getElementById(`distance${boxIndex}`)
    const disposalCodeEl = document.getElementById(`disposal_code${boxIndex}`)
    const disposalCostEl = document.getElementById(`disposal_cost${boxIndex}`)
    const transportCostEl = document.getElementById(`transport_cost${boxIndex}`)
    const totalCostEl = document.getElementById(`total_cost${boxIndex}`)

    if (supplierEl) supplierEl.textContent = supplier.supplier_name || "ไม่มีข้อมูล"
    if (supplierCodeEl) supplierCodeEl.textContent = supplier.supplier_code || "-"
    if (accountEl) accountEl.textContent = `(${supplier.supplier_account_no || 0})`
    if (distanceEl) distanceEl.textContent = supplierData.Distance.toFixed(2) + " กม."
    if (disposalCodeEl) disposalCodeEl.textContent = supplier.eliminate_code || "-"
    if (disposalCostEl) disposalCostEl.innerText = supplierData.disposalCost.toFixed(2) + " บาท"
    if (transportCostEl) transportCostEl.innerText = supplierData.transportCost.toFixed(2) + " บาท"
    if (totalCostEl) totalCostEl.innerText = supplierData.totalCost.toFixed(2) + " บาท"
  }

  // Set the first supplier as active if we have suppliers
  if (supplierCosts.length > 0) {
    updateMarker3(supplierCosts[0].supplier)
    selectedSupplierIndex = 0
    document.getElementById("selected1").checked = true

    // Render directions for the selected supplier
    if (supplierCosts[0].supplier && supplierCosts[0].supplier.latitude && supplierCosts[0].supplier.longitude) {
      const supplierPosition = {
        lat: Number.parseFloat(supplierCosts[0].supplier.latitude),
        lng: Number.parseFloat(supplierCosts[0].supplier.longitude),
      }
      calculateRouteForSupplier(supplierPosition)
    }
  }
}

// New function to calculate distances for all suppliers
function calculateDistanceForAllSuppliers() {
  if (!marker1 || !marker2 || !marker4 || suppliers.length === 0) {
    console.log("Missing required markers or suppliers")
    return
  }

  // Reset supplier costs array
  supplierCosts = []

  // Counter for tracking completed calculations
  let completedCalculations = 0

  // Calculate for each supplier
  for (let i = 0; i < suppliers.length; i++) {
    const supplier = suppliers[i]
    if (!supplier || !supplier.latitude || !supplier.longitude) {
      completedCalculations++
      continue
    }

    const supplierPosition = {
      lat: Number.parseFloat(supplier.latitude),
      lng: Number.parseFloat(supplier.longitude),
    }

    calculateDistanceAndCostForSupplier(supplierPosition, supplier, i, () => {
      completedCalculations++

      // If all calculations are done, sort and update UI
      if (completedCalculations === suppliers.length) {
        // Sort suppliers by total cost (cheapest first)
        supplierCosts.sort((a, b) => a.totalCost - b.totalCost)

        // Update UI with sorted data
        updateSupplierUI()
      }
    })
  }
}

// Function to calculate route for the selected supplier
function calculateRouteForSupplier(supplierPosition) {
  if (!marker1 || !marker2 || !marker4) {
    console.log("Missing required markers")
    return
  }

  const origin = marker1.getPosition()
  const customer = marker2.getPosition()
  const setpoint = marker4.getPosition()

  const request = {
    origin: origin,
    destination: setpoint,
    waypoints: [
      { location: customer, stopover: true },
      { location: supplierPosition, stopover: true },
    ],
    travelMode: "DRIVING",
  }

  // Calculate route for this supplier
  directionsService.route(request, (response, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(response)
    } else {
      console.error("Error calculating route: " + status)
    }
  })
}

// Function to calculate distance and cost for a specific supplier
function calculateDistanceAndCostForSupplier(supplierPosition, supplier, index, callback) {
  if (!marker1 || !marker2 || !marker4) {
    console.log("Missing required markers")
    if (callback) callback()
    return
  }

  const origin = marker1.getPosition()
  const customer = marker2.getPosition()
  const setpoint = marker4.getPosition()

  const request = {
    origin: origin,
    destination: setpoint,
    waypoints: [
      { location: customer, stopover: true },
      { location: supplierPosition, stopover: true },
    ],
    travelMode: "DRIVING",
  }

  // Calculate route for this supplier
  directionsService.route(request, (response, status) => {
    if (status === "OK") {
      var totalDistance = 0

      // Calculate total distance
      response.routes[0].legs.forEach((leg) => {
        totalDistance += leg.distance.value
      })

      // Calculate transport cost
      calculateTransportCostForSupplier(totalDistance, supplier, index, callback)
    } else {
      console.error("Error calculating route for supplier " + index + ": " + status)
      if (callback) callback()
    }
  })
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
        },
        truck: {
          fuelRate: Config.truck.fuelRate,
          divisor: Config.truck.divisor,
          maintanance: Config.truck.maintanance,
        },
          truckB: {
          fuelRate: Config.truckB.fuelRate,
          divisor: Config.truckB.divisor,
          maintanance: Config.truckB.maintanance,
        },
      }

      let selectedTruck = ""
      const truckSmallRadio = document.getElementById("gridRadios1")
      const truckLargeRadio = document.getElementById("gridRadios2")
      const truckLargeBRadio = document.getElementById("gridRadios3")

      if (truckSmallRadio && truckSmallRadio.checked) {
        selectedTruck = "truckSmall"
      } else if (truckLargeRadio && truckLargeRadio.checked) {
        selectedTruck = "truck"
      } else if (truckLargeBRadio && truckLargeBRadio.checked) {
        selectedTruck = "truckB"
      } else {
        selectedTruck = "truckSmall" // fallback
      }

      const truck = truckConfig[selectedTruck]


      const distanceInKm = totalDistance / 1000
      const maintananceCost = distanceInKm * truck.maintanance
      const transportCost = (distanceInKm / truck.divisor) * truck.fuelRate
      const fullTransportCost = transportCost +  maintananceCost

      // Calculate disposal cost
      const disposalCost = supplier.cost_rate ? Number.parseFloat(supplier.cost_rate) : 0

      // Calculate total cost
      const totalCost = fullTransportCost + disposalCost

      // Store the calculated costs with the supplier data
      supplierCosts.push({
        supplier: supplier,
        Distance: distanceInKm,
        transportCost: fullTransportCost,
        disposalCost: disposalCost,
        totalCost: totalCost,
        originalIndex: index,
      })

      if (callback) callback()
    })
    .catch((error) => {
      console.error("Error fetching API data:", error)
      if (callback) callback()
    })
}
