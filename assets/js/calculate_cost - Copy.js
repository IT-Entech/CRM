var map
var marker1,
  marker2,
  marker3 = null,
  marker4 // Set marker3 to null initially
var directionsService
var directionsRenderer
window.initMap = initMap

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

  document.getElementById("start_point").addEventListener("change", function () {
    var coordinates = this.value.split(",")
    var latLng = new google.maps.LatLng(Number.parseFloat(coordinates[0]), Number.parseFloat(coordinates[1]))
    marker1.setPosition(latLng)
    map.setCenter(latLng)
    calculateDistanceIfAllMarkersExist()
  })

  google.maps.event.addListener(marker1, "dragend", () => {
    calculateDistanceIfAllMarkersExist()
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
      calculateDistanceIfAllMarkersExist()
    })

    calculateDistanceIfAllMarkersExist()
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
  document.getElementById("finish_point").addEventListener("change", function () {
    var coordinates = this.value.split(",")
    var latLng = new google.maps.LatLng(Number.parseFloat(coordinates[0]), Number.parseFloat(coordinates[1]))
    marker4.setPosition(latLng)
    map.setCenter(latLng)
    calculateDistanceIfAllMarkersExist()
  })

  google.maps.event.addListener(marker4, "dragend", () => {
    calculateDistanceIfAllMarkersExist()
  })

  document.getElementById("calculateBtn").addEventListener("click", () => {
    calculateDistanceIfAllMarkersExist()
  })

  // เพิ่ม Search Box สำหรับ Marker 2
  const input = document.getElementById("search-box")
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
      calculateDistanceIfAllMarkersExist()
    })

    calculateDistanceIfAllMarkersExist()
  })

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
        // Create or update marker3 with the first supplier
        updateMarker3(data.details[0])

        // If there are multiple suppliers, create supplier options
        if (data.details.length > 1) {
          createSupplierOptions(data.details)
        }
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
      calculateDistanceIfAllMarkersExist()
    })
  } else {
    // Update existing marker3
    marker3.setPosition(supplierPosition)
    marker3.setTitle(supplier.supplier_name || "ปลายทาง")
  }

  // Recalculate distance with new supplier position
  calculateDistanceIfAllMarkersExist()
}

// Function to create supplier options (for the 3 option boxes)
function createSupplierOptions(suppliers) {
  for (let i = 0; i < Math.min(suppliers.length, 3); i++) {
    const supplier = suppliers[i]
    if (!supplier) continue

    const boxIndex = i > 0 ? i : ""

    const supplierEl = document.getElementById(`supplier${boxIndex}`)
    const supplierCodeEl = document.getElementById(`supplier_code${boxIndex}`)
    const accountEl = document.getElementById(`account${boxIndex}`)
    const disposalCodeEl = document.getElementById(`disposal_code${boxIndex}`)
    const selectedBtn = document.getElementById(`selected${i + 1}`)
    const disposalCostEl = document.getElementById(`disposal_cost${boxIndex}`)
    const transportCostEl = document.getElementById(`transport_cost${boxIndex}`)
    const totalCostEl = document.getElementById(`total_cost${boxIndex}`)

    if (supplierEl) supplierEl.textContent = supplier.supplier_name || "ไม่มีข้อมูล"
    if (supplierCodeEl) supplierCodeEl.textContent = supplier.supplier_code || "ไม่มีข้อมูล"
    if (accountEl) accountEl.textContent = `(${supplier.supplier_account_no || 0})`
    if (disposalCodeEl) disposalCodeEl.textContent = `(${supplier.eliminate_code || 0})`
    

    if (selectedBtn) {
      selectedBtn.onclick = () => {
        updateMarker3(supplier)
      }
    }

    if (disposalCostEl && supplier.cost_rate) {
      disposalCostEl.innerText = Number.parseFloat(supplier.cost_rate).toFixed(2) + " บาท"
      totalCostEl.innerText = Number.parseFloat(supplier.cost_rate).toFixed(2) + " บาท"
    }
  }
}


// Function to check if all markers exist and calculate distance
function calculateDistanceIfAllMarkersExist() {
  if (!marker1 || !marker2 || !marker3 || !marker4) {
    console.log("Not all markers are set yet")
    return
  }

  calculateDistance()
}

const wastenameInput = document.getElementById("waste_name")
const wastename = wastenameInput ? wastenameInput.value : ""

const truckSmallRadio = document.getElementById("gridRadios1")
const truckLargeRadio = document.getElementById("gridRadios2")

function calculateDistance() {
  if (!marker1 || !marker2 || !marker3 || !marker4) {
    console.log("Missing one or more markers")
    return
  }

  var origin = marker1.getPosition()
  var customer = marker2.getPosition()
  var supplier = marker3.getPosition()
  var setpoint = marker4.getPosition()

  var request = {
    origin: origin,
    destination: setpoint,
    waypoints: [
      { location: customer, stopover: true },
      { location: supplier, stopover: true },
    ],
    travelMode: "DRIVING",
  }

  // คำนวณเส้นทางทั้งหมดจาก marker1 ไปยัง marker2 ไปยัง marker3 ไปยัง marker4
  directionsService.route(request, (response, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(response)
      var totalDistance = 0

      // คำนวณระยะทาง
      response.routes[0].legs.forEach((leg) => {
        totalDistance += leg.distance.value
      })

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

          // ตรวจสอบว่าผู้ใช้เลือกประเภทของรถหรือไม่
          let selectedTruck = ""
          if (truckSmallRadio && truckSmallRadio.checked) {
            selectedTruck = "truckSmall"
          } else if (truckLargeRadio && truckLargeRadio.checked) {
            selectedTruck = "truck"
          } else {
            alert("กรุณาเลือกประเภทรถก่อนคำนวณ.")
            return
          }

          // คำนวณค่าขนส่ง
          var distanceInKm = totalDistance / 1000
          var costPerKm = truckConfig[selectedTruck].divisor
          var fuelRate = truckConfig[selectedTruck].fuelRate
          var transportCost = (distanceInKm / costPerKm) * fuelRate

          // Get the active option
          const activeOption = document.querySelector('input[name="options-outlined"]:checked').id
          const optionIndex = activeOption === "selected1" ? "" : activeOption.replace("selected", "")

          // Get disposal cost from the element (it was set in createSupplierOptions)
          const disposalCostElement = document.getElementById(`disposal_cost${optionIndex}`)
          let disposalCost = 500 // Default value

          // Try to parse the disposal cost from the element
          if (disposalCostElement && disposalCostElement.innerText) {
            const match = disposalCostElement.innerText.match(/(\d+(\.\d+)?)/)
            if (match) {
              disposalCost = Number.parseFloat(match[1])
            }
          }

          var totalCost = transportCost + disposalCost

          // อัปเดตค่าใช้จ่ายลงใน HTML
          document.getElementById(`transport_cost${optionIndex}`).innerText = transportCost.toFixed(2) + " บาท"
          // We don't update disposal_cost here as it's already set from the supplier data
          document.getElementById(`total_cost${optionIndex}`).innerText = totalCost.toFixed(2) + " บาท"
        })
        .catch((error) => {
          console.error("Error fetching API data:", error)
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลจาก API")
        })
    } else {
      alert("Error: " + status)
    }
  })
}

