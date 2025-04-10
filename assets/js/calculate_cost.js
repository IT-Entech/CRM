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
}

// Function to fetch suppliers based on waste_code
function fetchSuppliers(wasteCode) {
  if (!wasteCode) return

  // Create form data for POST request
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

        // Create supplier options for all suppliers
        createSupplierOptions(suppliers)

        // Set the first supplier as the active one
        updateMarker3(suppliers[0])
        selectedSupplierIndex = 0

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
    })

    google.maps.event.addListener(marker3, "dragend", () => {
      calculateDistanceForAllSuppliers()
    })
  } else {
    // Update existing marker3
    marker3.setPosition(supplierPosition)
    marker3.setTitle(supplier.supplier_name || "ปลายทาง")
  }
}

// Modified function to create supplier options and calculate distance for each
function createSupplierOptions(suppliers) {
  // Clear existing data in all boxes first
  for (let i = 0; i < 3; i++) {
    const boxIndex = i === 0 ? "" : i + 1
    const supplierEl = document.getElementById(`supplier${boxIndex}`)
    const supplierCodeEl = document.getElementById(`supplier_code${boxIndex}`)
    const accountEl = document.getElementById(`account${boxIndex}`)
    const disposalCodeEl = document.getElementById(`disposal_code${boxIndex}`)
    const disposalCostEl = document.getElementById(`disposal_cost${boxIndex}`)
    const transportCostEl = document.getElementById(`transport_cost${boxIndex}`)
    const totalCostEl = document.getElementById(`total_cost${boxIndex}`)

    if (supplierEl) supplierEl.textContent = "ไม่มีข้อมูล"
    if (accountEl) accountEl.textContent = "(0)"
    if (supplierCodeEl) supplierCodeEl.textContent = "-"
    if (disposalCodeEl) disposalCodeEl.textContent = "-"
    if (disposalCostEl) disposalCostEl.textContent = "-"
    if (transportCostEl) transportCostEl.textContent = "-"
    if (totalCostEl) totalCostEl.textContent = "-"
  }

  // Now populate with actual supplier data
  for (let i = 0; i < Math.min(suppliers.length, 3); i++) {
    const supplier = suppliers[i]
    if (!supplier) continue

    // For the first supplier, boxIndex is empty, for others it's the number
    const boxIndex = i === 0 ? "" : i + 1

    const supplierEl = document.getElementById(`supplier${boxIndex}`)
    const supplierCodeEl = document.getElementById(`supplier_code${boxIndex}`)
    const accountEl = document.getElementById(`account${boxIndex}`)
    const disposalCodeEl = document.getElementById(`disposal_code${boxIndex}`)
    const selectedBtn = document.getElementById(`selected${i + 1}`)
    const disposalCostEl = document.getElementById(`disposal_cost${boxIndex}`)
    const transportCostEl = document.getElementById(`transport_cost${boxIndex}`)
    const totalCostEl = document.getElementById(`total_cost${boxIndex}`)

    if (supplierEl) supplierEl.textContent = supplier.supplier_name || "ไม่มีข้อมูล"
    if (supplierCodeEl) supplierCodeEl.textContent = supplier.supplier_code || "-"
    if (accountEl) accountEl.textContent = `(${supplier.supplier_account_no || 0})`
    if (disposalCodeEl) disposalCodeEl.textContent = `(${supplier.eliminate_code || 0})`

    if (selectedBtn) {
      selectedBtn.onclick = () => {
        updateMarker3(supplier)
        selectedSupplierIndex = i
        calculateDistanceForAllSuppliers()
      }
    }

    if (disposalCostEl && supplier.cost_rate) {
      disposalCostEl.innerText = Number.parseFloat(supplier.cost_rate).toFixed(2) + " บาท"

      // We'll calculate transport cost for each supplier separately in calculateDistanceForAllSuppliers()
      // For now, initialize with placeholder
      if (transportCostEl) {
        transportCostEl.innerText = "กำลังคำนวณ..."
      }

      if (totalCostEl) {
        totalCostEl.innerText = "กำลังคำนวณ..."
      }
    }
  }

  // After creating all supplier options, calculate distances for each supplier
  calculateDistanceForAllSuppliers()
}

// New function to calculate distances for all suppliers
function calculateDistanceForAllSuppliers() {
  if (!marker1 || !marker2 || !marker4 || suppliers.length === 0) {
    console.log("Missing required markers or suppliers")
    return
  }

  // Calculate for each supplier (up to 3)
  for (let i = 0; i < Math.min(suppliers.length, 3); i++) {
    const supplier = suppliers[i]
    if (!supplier || !supplier.latitude || !supplier.longitude) continue

    const supplierPosition = {
      lat: Number.parseFloat(supplier.latitude),
      lng: Number.parseFloat(supplier.longitude),
    }

    calculateDistanceForSupplier(supplierPosition, i)
  }
}

// Function to calculate distance for a specific supplier
function calculateDistanceForSupplier(supplierPosition, index) {
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
      // Only render directions for the selected supplier
      if (index === selectedSupplierIndex) {
        directionsRenderer.setDirections(response)
      }

      var totalDistance = 0

      // Calculate total distance
      response.routes[0].legs.forEach((leg) => {
        totalDistance += leg.distance.value
      })

      // Calculate transport cost
      calculateTransportCostForSupplier(totalDistance, index)
    } else {
      console.error("Error calculating route for supplier " + index + ": " + status)
    }
  })
}

// Function to calculate transport cost for a specific supplier
function calculateTransportCostForSupplier(totalDistance, index) {
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
      }

      // Check if user selected a truck type
      let selectedTruck = ""
      const truckSmallRadio = document.getElementById("gridRadios1")
      const truckLargeRadio = document.getElementById("gridRadios2")

      if (truckSmallRadio && truckSmallRadio.checked) {
        selectedTruck = "truckSmall"
      } else if (truckLargeRadio && truckLargeRadio.checked) {
        selectedTruck = "truck"
      } else {
        // Default to truckSmall if none selected
        selectedTruck = "truckSmall"
      }

      // Calculate transport cost
      var distanceInKm = totalDistance / 1000
      var costPerKm = truckConfig[selectedTruck].divisor
      var fuelRate = truckConfig[selectedTruck].fuelRate
      var transportCost = (distanceInKm / costPerKm) * fuelRate

      // Format box index based on your HTML structure
      // For the first supplier (index 0), boxIndex is empty
      // For others, it's the number (2, 3)
      const boxIndex = index === 0 ? "" : index + 1

      // Get elements to update
      const transportCostEl = document.getElementById(`transport_cost${boxIndex}`)
      const disposalCostEl = document.getElementById(`disposal_cost${boxIndex}`)
      const totalCostEl = document.getElementById(`total_cost${boxIndex}`)

      // Update transport cost
      if (transportCostEl) {
        transportCostEl.innerText = transportCost.toFixed(2) + " บาท"
      }

      // Update total cost if applicable
      if (totalCostEl && disposalCostEl) {
        // Extract disposal cost from element
        let disposalCost = 0
        const match = disposalCostEl.innerText.match(/(\d+(\.\d+)?)/)
        if (match) {
          disposalCost = Number.parseFloat(match[1])
        }

        // Calculate and update total cost
        const totalCost = transportCost + disposalCost
        totalCostEl.innerText = totalCost.toFixed(2) + " บาท"
      }
    })
    .catch((error) => {
      console.error("Error fetching API data:", error)
    })
}
