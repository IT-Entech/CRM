<?php include('header.php');
$name = htmlspecialchars($name);
$staff = htmlspecialchars($staff);
$level = htmlspecialchars($level);
if($staff === 0 || $level < 1){
  echo '<script>alert("Can not enter this site");window.location="/pages-login.html";</script>';
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>Forms Appoint</title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="assets/img/Logo_En-Tech_1.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="assets/vendor/simple-datatables/style.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">

  <!-- =======================================================
  * Template Name: NiceAdmin
  * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
  * Updated: Apr 20 2024 with Bootstrap v5.3.3
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
  <script>
    // Function to set the current date in YYYY-MM-DD format
    function setCurrentDate() {
        const inputDate = document.getElementById('inputDate');
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(today.getDate()).padStart(2, '0');
        inputDate.value = `${year}-${month}-${day}`;
    }

    // Set the current date on page load
    window.onload = setCurrentDate;
</script>
</head>

<body>

  <!-- ======= Header ======= -->
  <header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
      <a href="index.php" class="logo d-flex align-items-center">
        <img src="assets/img/Logo_En-Tech_1.png" alt="">
        <span class="d-none d-lg-block">En-technology</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div><!-- End Logo -->

    <!--div class="search-bar">
      <form class="search-form d-flex align-items-center" method="POST" action="#">
        <input type="text" name="query" placeholder="Search" title="Enter search keyword">
        <button type="submit" title="Search"><i class="bi bi-search"></i></button>
      </form>
    </div--><!-- End Search Bar -->

    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">

        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li><!-- End Search Icon-->

        <!--li class="nav-item dropdown">

          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <span class="badge bg-primary badge-number">999+</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li class="dropdown-header">
              You have 4 new notifications
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="notification-item">
              <i class="bi bi-exclamation-circle text-warning"></i>
              <div>
                <h4>Lorem Ipsum</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>30 min. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="notification-item">
              <i class="bi bi-x-circle text-danger"></i>
              <div>
                <h4>Atque rerum nesciunt</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>1 hr. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="notification-item">
              <i class="bi bi-check-circle text-success"></i>
              <div>
                <h4>Sit rerum fuga</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>2 hrs. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="notification-item">
              <i class="bi bi-info-circle text-primary"></i>
              <div>
                <h4>Dicta reprehenderit</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>4 hrs. ago</p>
              </div>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>
            <li class="dropdown-footer">
              <a href="#">Show all notifications</a>
            </li>

          </ul>

        </li--><!-- End Notification Nav -->

        <!--li class="nav-item dropdown">

          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-chat-left-text"></i>
            <span class="badge bg-success badge-number">3</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
            <li class="dropdown-header">
              You have 3 new messages
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="message-item">
              <a href="#">
                <img src="assets/img/messages-1.jpg" alt="" class="rounded-circle">
                <div>
                  <h4>Maria Hudson</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>4 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="message-item">
              <a href="#">
                <img src="assets/img/messages-2.jpg" alt="" class="rounded-circle">
                <div>
                  <h4>Anna Nelson</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>6 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="message-item">
              <a href="#">
                <img src="assets/img/messages-3.jpg" alt="" class="rounded-circle">
                <div>
                  <h4>David Muldon</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>8 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="dropdown-footer">
              <a href="#">Show all messages</a>
            </li>

          </ul>

        </li--><!-- End Messages Nav -->

        <li class="nav-item dropdown pe-3">

          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <img src="assets/img/person-circle.svg" alt="Profile" class="rounded-circle">
            <span class="d-none d-md-block dropdown-toggle ps-2"> <?php echo $name; ?></span>
          </a><!-- End Profile Iamge Icon -->

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
             <!--li class="dropdown-header">
              <h6>Kevin Anderson</h6>
              <span>Web Designer</span>
            </li-->
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
                <i class="bi bi-person"></i>
                <span>My Profile</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="users-profile.html">
                <i class="bi bi-gear"></i>
                <span>Account Settings</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="pages-faq.html">
                <i class="bi bi-question-circle"></i>
                <span>Need Help?</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <a class="dropdown-item d-flex align-items-center" href="/log_out.php">
                <i class="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </a>
            </li>

          </ul><!-- End Profile Dropdown Items -->
        </li><!-- End Profile Nav -->

      </ul>
    </nav><!-- End Icons Navigation -->

  </header><!-- End Header -->

  <!-- ======= Sidebar ======= -->
  <aside id="sidebar" class="sidebar">

    <ul class="sidebar-nav" id="sidebar-nav">

      <li class="nav-item">
        <a class="nav-link collapsed" href="index.php">
          <i class="bi bi-grid"></i>
          <span>Dashboard</span>
        </a>
      </li><!-- End Dashboard Nav -->

      <!--li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-menu-button-wide"></i><span>Components</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="components-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="components-alerts.html">
              <i class="bi bi-circle"></i><span>Alerts</span>
            </a>
          </li>
          <li>
            <a href="components-accordion.html">
              <i class="bi bi-circle"></i><span>Accordion</span>
            </a>
          </li>
          <li>
            <a href="components-badges.html">
              <i class="bi bi-circle"></i><span>Badges</span>
            </a>
          </li>
          <li>
            <a href="components-breadcrumbs.html">
              <i class="bi bi-circle"></i><span>Breadcrumbs</span>
            </a>
          </li>
          <li>
            <a href="components-buttons.html">
              <i class="bi bi-circle"></i><span>Buttons</span>
            </a>
          </li>
          <li>
            <a href="components-cards.html">
              <i class="bi bi-circle"></i><span>Cards</span>
            </a>
          </li>
          <li>
            <a href="components-carousel.html">
              <i class="bi bi-circle"></i><span>Carousel</span>
            </a>
          </li>
          <li>
            <a href="components-list-group.html">
              <i class="bi bi-circle"></i><span>List group</span>
            </a>
          </li>
          <li>
            <a href="components-modal.html">
              <i class="bi bi-circle"></i><span>Modal</span>
            </a>
          </li>
          <li>
            <a href="components-tabs.html">
              <i class="bi bi-circle"></i><span>Tabs</span>
            </a>
          </li>
          <li>
            <a href="components-pagination.html">
              <i class="bi bi-circle"></i><span>Pagination</span>
            </a>
          </li>
          <li>
            <a href="components-progress.html">
              <i class="bi bi-circle"></i><span>Progress</span>
            </a>
          </li>
          <li>
            <a href="components-spinners.html">
              <i class="bi bi-circle"></i><span>Spinners</span>
            </a>
          </li>
          <li>
            <a href="components-tooltips.html">
              <i class="bi bi-circle"></i><span>Tooltips</span>
            </a>
          </li>
        </ul>
      </li--><!-- End Components Nav -->

      <li class="nav-item">
        <a class="nav-link " data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-journal-text"></i><span>Forms</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="forms-nav" class="nav-content collapse show" data-bs-parent="#sidebar-nav">
          <!--li>
            <a href="forms-elements.html">
              <i class="bi bi-circle"></i><span>Form Elements</span>
            </a>
          </li-->
          <li>
            <a href="forms-appoint.php" class="active">
              <i class="bi bi-circle"></i><span>Form Appoint</span>
            </a>
          </li>
          <!--li>
            <a href="forms-editors.html">
              <i class="bi bi-circle"></i><span>Form Editors</span>
            </a>
          </li>
          <li>
            <a href="forms-validation.html">
              <i class="bi bi-circle"></i><span>Form Validation</span>
            </a>
          </li-->
        </ul>
      </li>

        <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-layout-text-window-reverse"></i><span>Tables</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="tables-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
        <li>
            <a href="tables-appoint.php">
              <i class="bi bi-circle"></i><span>รายชื่อลูกค้าที่ยังไม่ได้เสนอราคา</span>
            </a>
          </li>
          <li>
            <a href="tables-data.php">
              <i class="bi bi-circle"></i><span>อัพเดทใบเสนอราคาลูกต้า</span>
            </a>
          </li>
          <!--li>
            <a href="tables-CS.html">
              <i class="bi bi-circle"></i><span>Data Cost sheet</span>
            </a>
          </li-->
        </ul>
      </li>

      <li class="nav-heading">Pages</li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="../User/Calculate_cost.html">
          <i class="bi bi-pc-display-horizontal"></i>
          <span>Cost Calculate</span>
        </a>
      </li>
    </ul>

  </aside><!-- End Sidebar-->

  <main id="main" class="main">

    <div class="pagetitle">
      <h1>Form Appoint</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="index.php">Home</a></li>
          <li class="breadcrumb-item">Forms</li>
          <li class="breadcrumb-item active">Appoint</li>
        </ol>
      </nav>
    </div><!-- End Page Title -->
    <section class="section">
      <div class="row">
        <!--div class="col-lg-6"-->

          <!--div class="card">
            <div class="card-body">
              <h5 class="card-title">Horizontal Form</h5>

              <form>
                <div class="row mb-3">
                  <label for="inputEmail3" class="col-sm-2 col-form-label">Your Name</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputText">
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                  <div class="col-sm-10">
                    <input type="email" class="form-control" id="inputEmail">
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword">
                  </div>
                </div>
                <fieldset class="row mb-3">
                  <legend class="col-form-label col-sm-2 pt-0">Radios</legend>
                  <div class="col-sm-10">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked>
                      <label class="form-check-label" for="gridRadios1">
                        First radio
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
                      <label class="form-check-label" for="gridRadios2">
                        Second radio
                      </label>
                    </div>
                    <div class="form-check disabled">
                      <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="option3" disabled>
                      <label class="form-check-label" for="gridRadios3">
                        Third disabled radio
                      </label>
                    </div>
                  </div>
                </fieldset>
                <div class="row mb-3">
                  <div class="col-sm-10 offset-sm-2">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="gridCheck1">
                      <label class="form-check-label" for="gridCheck1">
                        Example checkbox
                      </label>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Submit</button>
                  <button type="reset" class="btn btn-secondary">Reset</button>
                </div>
              </form>

            </div>
          </div-->

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Form Appoint</h5>
              <input type="hidden" id="staff" name="staff" value="<?php echo $staff;?>">
              <!-- Multi Columns Form -->
              <form action="create-appoint.php" method="post" enctype="multipart/form-data" class="row g-3">
                <div class="col-md-2">
                  <label for="inputChannel" class="form-label">ช่องทาง</label>
                  <select  class="form-select" id="inputChannel" name="inputChannel">
                    <option selected value="">N/A</option>  
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputSocial" class="form-label">ช่องทางที่พบ</label>
                  <select class="form-select" id="inputSocial" name="inputSocial">
                    <option selected value="">N/A</option>  
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputContract" class="form-label">ช่องทางติดต่อ</label>
                  <select class="form-select" id="inputContract" name="inputContract">
                    <option selected value="">N/A</option> 
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="inputSearch" class="form-label">คำค้นหา</label>
                  <input type="text" class="form-control" id="inputSearch" name="inputSearch">
                </div>
                <div class="col-md-2">
                <label for="inputAP-No" class="form-label" onclick="showPopup()">เลข AP</label>
                  <input type="text" class="form-control" id="inputAP-No" name="inputAP_No">
                  <div id="popupModal" class="modal">
                    
                    <div class="modal-content">
                      
                    <span class="close" onclick="closePopup()">&times;</span>
                    <div class="row">
                    <div class="col-xxl-2 col-md-4">
        <div class="form-floating mb-3">
          <select class="form-select" id="month" aria-label="Month"onchange="fetchData()">
            <option value="0">-</option>
          </select>
          <label for="month">Month</label>
        </div>
      </div>
      <div class="col-xxl-2 col-md-4">
        <div class="form-floating mb-3">
          <select class="form-select" id="year" aria-label="Year"onchange="fetchData()">
          </select>
          <label for="year">Year</label>
        </div>
      </div>
      </div>
                    <table id="dataTable">
                      <!-- Your table structure here -->
                    <thead>
                    <tr>
                    <th>Appoint No</th>
                    <th>วันที่</th>
                    <th>sales</th>
                    <th>ชื่อลูกค้า</th>
                    </tr>
                    </thead>
                   <tbody id="dataTableBody">
                <!-- Table rows will be populated dynamically -->
                   </tbody>
                  </table>
                  </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <label for="inputFac_no" class="form-label">ทะเบียนโรงงาน</label>
                  <input type="text" class="form-control" id="inputFac_no" name="inputFac_no" value="">
                </div>
                <div class="col-md-2">
                  <label for="inputFac-name" class="form-label">ชื่อโรงงาน</label>
                  <input type="text" class="form-control" id="inputFac-name" name="inputFac_name">
                </div>
                <div class="col-md-2">
                  <label for="inputFac-nation" class="form-label">สัญชาติ</label>
                  <select class="form-select" id="inputFac-nation" name="inputFac_nation">
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputFac-type" class="form-label">อุตสาหกรรม</label>
                  <input type="text" class="form-control" id="inputFac-type" name="inputFac_type">
                </div>
                <div class="col-md-2">
                  <label for="inputFac-value" class="form-label">ทุนจดทะเบียน</label>
                  <input type="text" class="form-control" id="inputFac-value" name="inputFac_value" value="0">
                </div>
                <div class="col-md-2">
                  <label for="inputDate" class="form-label">วันที่</label>
                  <input type="text" class="form-control" id="inputDate" name="inputDate" value="">
                </div>
                <div class="col-md-6">
                  <label for="inputAddress" class="form-label">ที่อยู่</label>
                  <input type="text" class="form-control" id="inputAddress" name="inputAddress" placeholder="123/5 หมู่1">
                </div>
                <div class="col-md-2">
                  <label for="inputProvince" class="form-label">จังหวัด</label>
                  <select class="form-select"  id="inputProvince" name="inputProvince">
                    <option selected value="00">N/A</option> 
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputCustomer" class="form-label">ผู้ติดต่อ</label>
                  <input type="text" class="form-control" id="inputCustomer" name="inputCustomer">
                </div>
                <div class="col-md-2">
                  <label for="inputPosition" class="form-label">ตำแหน่ง</label>
                  <input type="text" class="form-control" id="inputPosition" name="inputPosition">
                </div>
                <div class="col-md-6">
                  <label for="inputEmail" class="form-label">Email</label>
                  <input type="email" class="form-control" id="inputEmail" name="inputEmail">
                </div>
                <div class="col-md-2">
                  <label for="inputTel" class="form-label">เบอร์โทร</label>
                  <input type="text" class="form-control" id="inputTel" name="inputTel">
                </div>
                <div class="col-md-2">
                  <label for="inputSegment" class="form-label">Segmnet</label>
                  <select class="form-select" id="inputSegment" name="inputSegment">
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputCL_type" class="form-label">CL-type</label>
                  <select class="form-select" id="inputCL_type" name="inputCL_type">
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputSales" class="form-label">พนักงานขาย</label>
                  <input class="form-control" id="inputSales" aria-label="inputSales" name="inputSales" value="<?php echo $staff;?>" readonly>
                </div>
                <div class="col-md-2">
                  <label for="inputAppoint" class="form-label">การนัดหมาย</label>
                  <select class="form-select" id="inputAppoint" name="inputAppoint">
                    <option selected value="">N/A</option>  
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="inputVisit" class="form-label">วันที่นัด</label>
                  <input type="date" class="form-control" id="inputVisit" name="inputVisit">
                </div>
                <div class="col-md-2">
                  <label for="inputCus_status" class="form-label">สถานะลูกค้า</label>
                  <select class="form-select" id="inputCus_status" name="inputCus_status">
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="inputInsight" class="form-label">Insight</label>
                  <input type="text" class="form-control" id="inputInsight" name="inputInsight">
                </div>
                <div class="col-md-2">
                  <label for="inputCompetitor_name" class="form-label">คู่แข่ง</label>
                  <input type="text" class="form-control" id="inputCompetitor_name" name="inputCompetitor_name">
                </div>
                <div class="col-md-2">
                  <label for="inputCompetitor_value" class="form-label">ราคาคู่แข่ง</label>
                  <input type="text" class="form-control" id="inputCompetitor_value" name="inputCompetitor_value" value="0.00">
                </div>
                <div class="col-md-2">
                  <label for="inputis_status" class="form-label">สถานะติดตาม</label>
                  <select class="form-select" id="inputis_status" name="inputis_status">
                    <option selected value="0">N/A</option>  
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="inputReason" class="form-label">เหตุผล</label>
                  <input type="text" class="form-control" id="inputReason" name="inputReason">
                </div>
                <div class="col-md-6">
                  <label for="inputRemark" class="form-label">Remark</label>
                  <input type="text" class="form-control" id="inputRemark" name="inputRemark">
                </div>
                
                <!--div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="gridCheck">
                    <label class="form-check-label" for="gridCheck">
                      Check me out
                    </label>
                  </div>
                </div-->
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Submit</button>
                  <button type="reset" class="btn btn-secondary">Reset</button>
                  <input type="hidden" id="staff" name="staff" value="<?php echo $staff;?>">
                </div>
              </form><!-- End Multi Columns Form -->

            </div>
          </div>

        <!--/div-->

        <!--div class="col-lg-6">

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Vertical Form</h5>

    
              <form class="row g-3">
                <div class="col-12">
                  <label for="inputNanme4" class="form-label">Your Name</label>
                  <input type="text" class="form-control" id="inputNanme4">
                </div>
                <div class="col-12">
                  <label for="inputEmail4" class="form-label">Email</label>
                  <input type="email" class="form-control" id="inputEmail4">
                </div>
                <div class="col-12">
                  <label for="inputPassword4" class="form-label">Password</label>
                  <input type="password" class="form-control" id="inputPassword4">
                </div>
                <div class="col-12">
                  <label for="inputAddress" class="form-label">Address</label>
                  <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St">
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Submit</button>
                  <button type="reset" class="btn btn-secondary">Reset</button>
                </div>
              </form>

            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">No Labels / Placeholders as labels Form</h5>

            
              <form class="row g-3">
                <div class="col-md-12">
                  <input type="text" class="form-control" placeholder="Your Name">
                </div>
                <div class="col-md-6">
                  <input type="email" class="form-control" placeholder="Email">
                </div>
                <div class="col-md-6">
                  <input type="password" class="form-control" placeholder="Password">
                </div>
                <div class="col-12">
                  <input type="text" class="form-control" placeholder="Address">
                </div>
                <div class="col-md-6">
                  <input type="text" class="form-control" placeholder="City">
                </div>
                <div class="col-md-4">
                  <select id="inputState" class="form-select">
                    <option selected>Choose...</option>
                    <option>...</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <input type="text" class="form-control" placeholder="Zip">
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Submit</button>
                  <button type="reset" class="btn btn-secondary">Reset</button>
                </div>
              </form>

            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Floating labels Form</h5>

       
              <form class="row g-3">
                <div class="col-md-12">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="floatingName" placeholder="Your Name">
                    <label for="floatingName">Your Name</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="email" class="form-control" id="floatingEmail" placeholder="Your Email">
                    <label for="floatingEmail">Your Email</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
                    <label for="floatingPassword">Password</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <textarea class="form-control" placeholder="Address" id="floatingTextarea" style="height: 100px;"></textarea>
                    <label for="floatingTextarea">Address</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-md-12">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="floatingCity" placeholder="City">
                      <label for="floatingCity">City</label>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="form-select" id="floatingSelect" aria-label="State">
                      <option selected>New York</option>
                      <option value="1">Oregon</option>
                      <option value="2">DC</option>
                    </select>
                    <label for="floatingSelect">State</label>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="floatingZip" placeholder="Zip">
                    <label for="floatingZip">Zip</label>
                  </div>
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Submit</button>
                  <button type="reset" class="btn btn-secondary">Reset</button>
                </div>
              </form>

            </div>
          </div>

        </div-->
      </div>
    </section>

  </main><!-- End #main -->

  <!-- ======= Footer ======= -->
  <footer id="footer" class="footer">
    <div class="copyright">
      &copy; Copyright <strong><span>NiceAdmin</span></strong>. All Rights Reserved
    </div>
    <div class="credits">
      <!-- All the links in the footer should remain intact. -->
      <!-- You can delete the links only if you purchased the pro version. -->
      <!-- Licensing information: https://bootstrapmade.com/license/ -->
      <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
      Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
    </div>
  </footer><!-- End Footer -->

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

  <!-- Vendor JS Files -->
  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>
  <script src="assets/js/script_form-appoint.js"></script>
  <script src="assets/js/script_edit-appoint.js"></script>
</body>

</html>