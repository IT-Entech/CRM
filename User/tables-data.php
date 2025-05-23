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

  <title>Dashboard - Appoint</title>
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
        <a class="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-journal-text"></i><span>Forms</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="forms-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <!--li>
            <a href="forms-elements.html">
              <i class="bi bi-circle"></i><span>Form Elements</span>
            </a>
          </li-->
          <li>
            <a href="forms-appoint.php">
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
        <a class="nav-link " data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-layout-text-window-reverse"></i><span>Tables</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="tables-nav" class="nav-content collapse show" data-bs-parent="#sidebar-nav">
        <li>
            <a href="tables-appoint.php">
              <i class="bi bi-circle"></i><span>รายชื่อลูกค้าที่ยังไม่ได้เสนอราคา</span>
            </a>
          </li>
          <li>
            <a href="tables-data.php" class="active">
              <i class="bi bi-circle"></i><span>อัพเดทใบเสนอราคาลูกต้า</span>
            </a>
          </li>
          <!--li>
            <a href="tables-CS.html">
              <i class="bi bi-circle"></i><span>Data Cost sheet</span>
            </a>
          </li-->
        </ul>
      </li><!-- End Tables Nav -->

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
      <h1>Data Tables</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="index.php">Home</a></li>
          <li class="breadcrumb-item">Tables</li>
          <li class="breadcrumb-item active">Data</li>
        </ol>
      </nav>
    </div><!-- End Page Title -->

    <section class="section">
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Datatables</h5>
              <div class="col-lg-8">
                <div class="row">
                <input type="hidden" id="staff" value="<?php echo $staff; ?>">
                  <!--div class="col-xxl-3 col-md-4">
                    <div class="form-floating mb-3">
                      <select class="form-select" id="Sales" aria-label="Sales"onchange="fetchData()">
                        <option selected value="N">-</option>
                      </select>
                      <label for="Sales">Sales</label>
                    </div>
                  </div-->
                  <!--div class="col-xxl-3 col-md-4">
                    <div class="form-floating mb-3">
                      <select class="form-select" id="channel" aria-label="channel"onchange="fetchData()">
                        <option selected value="N">-</option>
                        <option value="I">Online</option>
                        <option value="O">Offline</option>
                      </select>
                      <label for="channel">Channels</label>
                    </div>
                  </div-->
              <div class="col-xxl-3 col-md-6">
                <div class="form-floating mb-3">
                  <select class="form-select" id="month" aria-label="Month"onchange="fetchData()">
                  <option value="0">-</option>
                  </select>
                  <label for="month">Month</label>
                </div>
              </div>
              <div class="col-xxl-3 col-md-6">
                <div class="form-floating mb-3">
                  <select class="form-select" id="year" aria-label="Year"onchange="fetchData()">
                  </select>
                  <label for="year">Year</label>
                </div>
              </div>
              
            </div>
          </div>

          <section class="section dashboard">
      <div class="row">

        <!-- Left side columns -->
          <div class="row">

            <!-- Sales Card -->
            <div class="col-xxl-2 col-md-4">
              <div class="card info-card customers-card">

                <!--div class="filter">
                  <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                  <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li class="dropdown-header text-start">
                      <h6>Filter</h6>
                    </li>

                    <li><a class="dropdown-item" href="#" id= "aponline" value="I">Online</a></li>
                    <li><a class="dropdown-item" href="#" id ="apoffline" value="O">Offline</a></li>
                  </ul>
                </div-->

                <div class="card-body">
                  <h5 class="card-title">Appoint</h5>

                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-people"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="appoint"></h6>
                      <!--span class="text-success small pt-1 fw-bold">12%</span> <span class="text-muted small pt-2 ps-1">increase from last month</span-->
                      <span id="apNoqt" class="text-danger large pt-1 fw-bold"></span> <span class="text-muted small pt-2 ps-1">ราย</span>
                    </div>
                  </div>
                </div>

              </div>
            </div><!-- End Sales Card -->

<!-- Customers Card -->
<div class="col-xxl-2 col-md-4">
  <div class="card info-card sales-card">

    <!--div class="filter">
      <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
      <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
        <li class="dropdown-header text-start">
          <h6>Filter</h6>
        </li>

        <li><a class="dropdown-item" href="#">Today</a></li>
        <li><a class="dropdown-item" href="#">This Month</a></li>
        <li><a class="dropdown-item" href="#">This Year</a></li>
      </ul>
    </div-->

    <div class="card-body">
      <h5 class="card-title">CostSheet</h5>

      <div class="d-flex align-items-center">
        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-cart"></i>
        </div>
        <div class="ps-3">
          <h6 id="qt_number"></h6>
          <span id="qt_value" class="text-success large pt-1 fw-bold"></span> <span class="text-muted small pt-2 ps-1">THB</span>

        </div>
      </div>

    </div>
  </div>

</div><!-- End Customers Card -->

<!-- Customers Card -->
<div class="col-xxl-2 col-md-4">
  <div class="card info-card sales-card">

    <!--div class="filter">
      <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
      <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
        <li class="dropdown-header text-start">
          <h6>Filter</h6>
        </li>

        <li><a class="dropdown-item" href="#">Today</a></li>
        <li><a class="dropdown-item" href="#">This Month</a></li>
        <li><a class="dropdown-item" href="#">This Year</a></li>
      </ul>
    </div-->

    <div class="card-body">
      <h5 class="card-title">Potential</h5>

      <div class="d-flex align-items-center">
        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-cart"></i>
        </div>
        <div class="ps-3">
          <h6 id="qt_potential_number"></h6>
          <span id="qt_potential_value" class="text-success large pt-1 fw-bold"></span> <span class="text-muted small pt-2 ps-1">THB</span>

        </div>
      </div>

    </div>
  </div>

</div><!-- End Customers Card -->
<!-- Customers Card -->
<div class="col-xxl-2 col-md-4">
  <div class="card info-card sales-card">

    <!--div class="filter">
      <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
      <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
        <li class="dropdown-header text-start">
          <h6>Filter</h6>
        </li>

        <li><a class="dropdown-item" href="#">Today</a></li>
        <li><a class="dropdown-item" href="#">This Month</a></li>
        <li><a class="dropdown-item" href="#">This Year</a></li>
      </ul>
    </div-->

    <div class="card-body">
      <h5 class="card-title">Prospect</h5>

      <div class="d-flex align-items-center">
        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-cart"></i>
        </div>
        <div class="ps-3">
          <h6 id="qt_prospect_number"></h6>
          <span id="qt_prospect_value" class="text-success large pt-1 fw-bold"></span> <span class="text-muted small pt-2 ps-1">THB</span>

        </div>
      </div>

    </div>
  </div>

</div><!-- End Customers Card -->
<!-- Customers Card -->
<div class="col-xxl-2 col-md-4">
  <div class="card info-card sales-card">

    <!--div class="filter">
      <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
      <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
        <li class="dropdown-header text-start">
          <h6>Filter</h6>
        </li>

        <li><a class="dropdown-item" href="#">Today</a></li>
        <li><a class="dropdown-item" href="#">This Month</a></li>
        <li><a class="dropdown-item" href="#">This Year</a></li>
      </ul>
    </div-->

    <div class="card-body">
      <h5 class="card-title">Pipeline</h5>

      <div class="d-flex align-items-center">
        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-cart"></i>
        </div>
        <div class="ps-3">
          <h6 id="qt_pipeline_number"></h6>
          <span id="qt_pipeline_value" class="text-success large pt-1 fw-bold"></span> <span class="text-muted small pt-2 ps-1">THB</span>

        </div>
      </div>

    </div>
  </div>

</div><!-- End Customers Card -->



<!-- Revenue Card -->
<div class="col-xxl-2 col-md-4">
  <div class="card info-card revenue-card">

    <!--div class="filter">
      <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
      <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
        <li class="dropdown-header text-start">
          <h6>Filter</h6>
        </li>

        <li><a class="dropdown-item" href="#">Today</a></li>
        <li><a class="dropdown-item" href="#">This Month</a></li>
        <li><a class="dropdown-item" href="#">This Year</a></li>
      </ul>
    </div-->

    <div class="card-body">
      <h5 class="card-title">Revenue</h5>

      <div class="d-flex align-items-center">
        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-cash-stack"></i>
        </div>
        <div class="ps-3">
          <h6 id="so_number"></h6>
          <span id="revenue" class="text-success large pt-1 fw-bold"></span> <span class="text-muted small pt-2 ps-1">THB</span>

        </div>
      </div>
    </div>

  </div>
</div><!-- End Revenue Card -->
          </div>
    </section>

              <!-- Table with stripped rows -->
              <form action="edit_status.php" method="post" enctype="multipart/form-data" class="row g-3">
                <div class="text-center">
                  <button type="submit" class="btn btn-primary" onclick="return confirmUpdate();">Submit</button>
                  <button type="reset" class="btn btn-secondary">Reset</button>
                  <input type="hidden" id="staff" name="staff" value="<?php echo $staff;?>">
                </div>
              <table id="tableAP" class="table datatable">
                <thead>
                  <tr>
                    <th data-type="date" data-format="YYYY/DD/MM">วันที่ติดต่อ</th>
                    <th scope="col">Customer</th>
                    <th>QT No</th>
                    <th>มูลค่างาน</th>
                    <th>Process</th>
                    <th> Tracking detail</th>
                    <th>Status</th>
                    <th>เหตุผล</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

                  </tr>
                </tbody>
              </table>
              </form>
              <!-- End Table with stripped rows -->

            </div>
          </div>

        </div>
      </div>
    </section>

  </main><!-- End #main -->

  <!-- ======= Footer ======= -->
  <footer id="footer" class="footer">
    <div class="copyright">
      &copy; Copyright <strong><span>2024</span></strong>. All Rights Reserved
    </div>
    <div class="credits">
      <!-- All the links in the footer should remain intact. -->
      <!-- You can delete the links only if you purchased the pro version. -->
      <!-- Licensing information: https://bootstrapmade.com/license/ -->
      <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
      Designed by <a href="#">-AOM SK-</a>
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
  <script src="assets/js/table.js"></script>
</body>

</html>