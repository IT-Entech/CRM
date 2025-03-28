var map;
var marker1, marker2, marker3, marker4;  // เพิ่มตัวแปร marker3
var directionsService;
var directionsRenderer;

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
    title: "Drag me!"
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
      title: "Drag me!"
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
    title: "Marker 3"
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
    title: "Marker 4"
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


  calculateDistance(); 
}



function calculateDistance() {
  if (!marker2 || !marker3 || !marker4) return;

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
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(response);
      var totalDistance = 0;
      var totalDuration = 0;

      // คำนวณระยะทางและระยะเวลา
      for (var i = 0; i < response.routes[0].legs.length; i++) {
        totalDistance += response.routes[0].legs[i].distance.value;
        totalDuration += response.routes[0].legs[i].duration.value;
      }

      // แสดงผลลัพธ์
      alert("Total Distance: " + (totalDistance / 1000) + " km\nTotal Duration: " + (totalDuration / 60) + " minutes");
    } else {
      alert('Error: ' + status);
    }
  });
}