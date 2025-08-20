var map;
var marker1, marker2, marker3 = null, marker4;  // เพิ่มตัวแปร marker3
var directionsService;
var directionsRenderer;
window.initMap = initMap;
function initMap() {
  const samutPrakarn = { lat: 13.6050, lng: 100.5653 };
  const Entech = { lat: 13.561900, lng: 100.653328 };
  const marker3Position = { lat: 13.599536, lng: 101.373371 }; // พิกัดของ marker ที่ 3

  map = new google.maps.Map(document.getElementById('map'), {
    center: samutPrakarn,  // ตัวอย่างพิกัด (Bangkok)
    zoom: 12
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // สร้าง Marker ที่สามารถลากได้
  marker1 = new google.maps.Marker({
    position: Entech,
    map: map,
    draggable: true,
    title: "จุดเริ่มต้น"
  });

  document.getElementById('start_point').addEventListener('change', function() {
    var coordinates = this.value.split(',');  // แยกค่า latitude และ longitude
    var latLng = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
    marker1.setPosition(latLng);  // อัปเดตตำแหน่ง marker 4
    map.setCenter(latLng);  // เลื่อนแผนที่ไปยังตำแหน่งใหม่ของ marker 4
    calculateDistance();  // คำนวณระยะทางใหม่
  });

  google.maps.event.addListener(marker1, 'dragend', function() {
    calculateDistance();
  });

  // เมื่อคลิกบนแผนที่เพื่อสร้างหมุดใหม่
  map.addListener('click', function(event) {
    if (marker2) {
      marker2.setMap(null);  // ลบหมุดเก่าออกถ้ามี
    }

    marker2 = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
      title: "ลูกค้า"
    });

    google.maps.event.addListener(marker2, 'dragend', function() {
      calculateDistance();
    });

    calculateDistance();
  });

  // สร้าง Marker ที่ 3 ที่พิกัด 13.599536, 101.373371
  marker3 = new google.maps.Marker({
    position: marker3Position,
    map: map,
    draggable: true,
    title: "ปลายทาง"
  });

  google.maps.event.addListener(marker3, 'dragend', function() {
    calculateDistance();
  });

  calculateDistance();  // คำนวณระยะทางเริ่มต้น

     // สร้าง Marker ที่ 4
    marker4 = new google.maps.Marker({
    position: Entech,
    map: map,
    draggable: true,
    title: "จุดสิ้นสุด"
  });
   // ฟังค์ชั่นเพื่ออัปเดตตำแหน่งของ Marker 4 เมื่อเลือกสถานที่จาก select box
   document.getElementById('finish_point').addEventListener('change', function() {
    var coordinates = this.value.split(',');  // แยกค่า latitude และ longitude
    var latLng = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
    marker4.setPosition(latLng);  // อัปเดตตำแหน่ง marker 4
    map.setCenter(latLng);  // เลื่อนแผนที่ไปยังตำแหน่งใหม่ของ marker 4
    calculateDistance();  // คำนวณระยะทางใหม่
  });
  google.maps.event.addListener(marker4, 'dragend', function() {
    calculateDistance();
  });

  document.getElementById("calculateBtn").addEventListener("click", function () {
    calculateDistance();
  }); 
 // เพิ่ม Search Box สำหรับ Marker 2
 const input = document.getElementById('search-box');
 const searchBox = new google.maps.places.SearchBox(input);

 map.addListener('bounds_changed', function() {
   searchBox.setBounds(map.getBounds());
 });

 searchBox.addListener('places_changed', function() {
   const places = searchBox.getPlaces();

   if (places.length == 0) {
     return;
   }

   // ลบ Marker เก่าออกถ้ามี
   if (marker2) {
     marker2.setMap(null);
   }

   // เลือกสถานที่แรกจากผลลัพธ์
   const place = places[0];

   // สร้าง Marker ที่ตำแหน่งใหม่
   marker2 = new google.maps.Marker({
     position: place.geometry.location,
     map: map,
     draggable: true,
     title: place.name
   });

   // เลื่อนแผนที่ไปยังตำแหน่งของ Marker 2
   map.setCenter(place.geometry.location);
   map.setZoom(15);

   google.maps.event.addListener(marker2, 'dragend', function() {
     calculateDistance();
   });

   calculateDistance();
 });

  calculateDistance(); 
}
const wastenameInput = document.getElementById('waste_name');
const wastename = wastenameInput.value; 

const truckSmallRadio = document.getElementById('gridRadios1');
const truckLargeRadio = document.getElementById('gridRadios2');



function calculateDistance() {
   if(!marker2){
    alert("กรุณาเลือกตำแหน่งลูกค้า.");
    return;
  }

  var origin = marker1.getPosition();
  var customer = marker2.getPosition();
  var supplier = marker3.getPosition();
  var setpoint = marker4.getPosition();

  var request = {
    origin: origin,
    destination: setpoint,
    waypoints: [
      { location: customer, stopover: true },
      { location: supplier, stopover: true }
    ],
    travelMode: 'DRIVING'
  };

  // คำนวณเส้นทางทั้งหมดจาก marker1 ไปยัง marker2 ไปยัง marker3 ไปยัง marker4
  directionsService.route(request, function (response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response);
      var totalDistance = 0;

      // คำนวณระยะทาง
      response.routes[0].legs.forEach((leg) => {
        totalDistance += leg.distance.value;
      });


      fetch('../transport_cost.php')
      .then(response => response.json())
      .then(data => {
        const Config = data; 
        const truckConfig = {
          truckSmall: {
           fuelRate: Config.truckSmall.fuelRate,
           divisor: Config.truckSmall.divisor,
           maintanance: Config.truckSmall.maintanance,
           fixcost: Config.truckSmall.fixcost
          },
     
          truck: {
           fuelRate: Config.truck.fuelRate,
           divisor: Config.truck.divisor,
           maintanance: Config.truck.maintanance,
           fixcost: Config.truck.fixcost
          },  
    };
  // ตรวจสอบว่าผู้ใช้เลือกประเภทของรถหรือไม่
  let selectedTruck = '';
  if (truckSmallRadio.checked) {
    selectedTruck = 'truckSmall';
  } else if (truckLargeRadio.checked) {
    selectedTruck = 'truck';
  } else {
    alert("กรุณาเลือกประเภทรถก่อนคำนวณ.");
    return;
  }
    
        // คำนวณค่าขนส่ง
        var distanceInKm = totalDistance / 1000;
        var costPerKm = truckConfig[selectedTruck].divisor; 
        var fuelRate = truckConfig[selectedTruck].fuelRate; 
        var transportCost = (distanceInKm / costPerKm) * fuelRate ;
        var disposalCost = 500; // ค่ากำจัดคงที่
        var totalCost = transportCost + disposalCost;

      // อัปเดตค่าใช้จ่ายลงใน HTML
      document.getElementById('transport_cost').innerText = transportCost.toFixed(2) + " บาท";
      document.getElementById('disposal_cost').innerText = disposalCost.toFixed(2) + " บาท";
      document.getElementById('total_cost').innerText = totalCost.toFixed(2) + " บาท";
      
    })
    .catch(error => {
      console.error("Error fetching API data:", error);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลจาก API");
    });
    } else {
      alert('Error: ' + status);
    }
  });
}

