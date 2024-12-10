//Ei part e HTML-er specific elements (ID use kore) JavaScript-e select kora hoyeche.
//viewAllStudents mane HTML file-er oi element, jar ID "viewAllStudents".
//Erokom sob element-ke JavaScript e alada variable-e assign kora hoise, jate pore easily access kora jay.
const viewAllStudents = document.getElementById("viewAllStudents");
const viewAllTeachers = document.getElementById("viewAllTeachers");
const viewAllCourses = document.getElementById("ViewAllCourses");
const informationDiv = document.getElementById("informationDiv");
const home = document.getElementById("home");
const adminComplaints = document.getElementById("adminComplaints");
const currentSession = document.getElementById("currentSession");
const adminLogs = document.getElementById("adminLogs");
const adminExamSchedule = document.getElementById("adminExamSchedule");
const log_out = document.getElementById("logout");
const notice = document.getElementById("notice");
const Profile = document.getElementById("Profile");
const about = document.getElementById("about");
const changePass = document.getElementById("changePass");
const adminApprovePendingRequests = document.getElementById(
  "adminApprovePendingRequests"
);
const addNotice = document.getElementById("addNotice");
let month;
let year;
let deptOfferedforExam;
let level_termforExam;
//changePass button click korle server e /changePass pathano hobe (ekta GET request).
//Server theke response (HTML content) asbe, jar por oi content informationDiv er moddhe dekhano hobe.
//Error hoile console e "Error fetching data" dekhabe.

changePass.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  console.log("Change pass clicked");
  try {
    const response = await fetch(`/changePass`);
    const contents = await response.text(); // Await the response text
    informationDiv.innerHTML = contents;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
//adminProfile
//home button click korle server e /adminProfile request pathabe.
//Response-e je content pabe, ta informationDiv er moddhe show korbe.
home.addEventListener("click", async function () {
  const response = await fetch(`/adminProfile`);
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});
Profile.addEventListener("click", async function () {
  const response = await fetch(`/adminProfile`);
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

currentSession.addEventListener("click", async function () {
  const response = await fetch(`/admin/CurrentSessionButton`);
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});
/*Logout button press korle confirmation popup asbe (SweetAlert2 diye).
Jodi user confirm kore (Yes button click kore), tahole / (home page) redirect korbe.*/
log_out.addEventListener("click", async function () {
  console.log("Logout Clicked");
  Swal.fire({
    title: `Are you sure you want to log out??`,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Yes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      window.location.href = "/";
    }
  });
});
/*Notice button click korle /notice server endpoint e request pathano hobe.
Response HTML informationDiv er moddhe dekhabar jonno set kora hobe.*/
notice.addEventListener("click", async function () {
  const response = await fetch(`/notice`);
  const contents = await response.text();
  console.log("ntc");
  console.log(contents);
  informationDiv.innerHTML = contents;
});

addNotice.addEventListener("click", async function () {
  const response = await fetch("/admin/Notice");
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});

about.addEventListener("click", async function () {
  console.log("AboutClicked");
  const response = await fetch("/about");
  const contents = await response.text();
  console.log(contents);
  document.open();
  document.write(contents);
  document.close();
});

adminLogs.addEventListener("click", async function () {
  const response = await fetch("/admin/Logs");
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

adminExamSchedule.addEventListener("click", async function () {
  const response = await fetch("/Admin/ExamSchedule");
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

adminComplaints.addEventListener("click", async function () {
  const response = await fetch("/admin/ViewComplaints");
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});
/*       ADDED      */
adminApprovePendingRequests.addEventListener("click", async function () {
  const response = await fetch("/adminApproveRequests");
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

viewAllStudents.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch("/admin/viewAllStudents");
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});

viewAllTeachers.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch("/admin/viewAllTeachers");
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});

viewAllCourses.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch("/admin/viewAllCourses");
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});
/*User informationDiv er moddhe kono element (specifically ID "allStudents") click korle ei function trigger hobe.
Check korbe ID match kore kina.
Match korle, server theke /AllStudents/viewAll endpoint theke data fetch korbe.
Server je HTML data provide korbe, ta div2 er moddhe show korbe.
*/
informationDiv.addEventListener("click", async function (event) {
  if (event.target && event.target.id === "allStudents") {
    // Handle the click event
    console.log("Clicked");
    const response = await fetch("/AllStudents/viewAll");
    const contents = await response.text();

    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (event.target && event.target.id === "allTeachers") {
    // Handle the click event
    console.log("Clicked");
    const response = await fetch("/AllTeachers/viewAll");
    const contents = await response.text();

    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (event.target && event.target.id === "allCourses") {
    // Handle the click event
    const response = await fetch("/AllCourses/viewAll");
    const contents = await response.text();

    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  //------Student View Options--------//
  if (event.target && event.target.id === "idWiseStudentSearchButton") {
    // Handle the click event
    const idWiseStudentSearchBox = document.getElementById(
      "idWiseStudentSearchBox"
    );
    let student_id = idWiseStudentSearchBox.value;
    student_id = student_id + "I";
    const response = await fetch(`/AllStudents/${student_id}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  //search by course_id and level_ter,
  if (event.target && event.target.id === "courseWiseStudentSearchButton") {
    // Handle the click event
    const courseWiseStudentSearchBox = document.getElementById(
      "courseWiseStudentSearchBox"
    );
    const courseWiseStudentSessionSearchBox = document.getElementById(
      "courseWiseStudentSessionSearchBox"
    );
    let course_id = courseWiseStudentSearchBox.value;
    let session = courseWiseStudentSessionSearchBox.value;
    console.log(session);
    const response = await fetch(
      `/courseWiseAllStudents/${course_id}/${session}`
    );
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  //-----ViewOptionOFCourses----//
  if (event.target && event.target.id === "course_idWiseCourseSearchButton") {
    // Get the text content of the clicked anchor
    //students
    const course_idWiseCourseSearchBox = document.getElementById(
      "course_idWiseCourseSearchBox"
    );
    let course_ID = course_idWiseCourseSearchBox.value;
    course_ID = course_ID + "I";
    const response = await fetch(`/AllCourses/${course_ID}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  /*Dynamic departmental student data show korar ekta system.
Je department e click kora hocche, tar shathe "D" lagano hoye URL er ekta part banano hocche.*/
  if (event.target && event.target.classList.contains("Deptsharedanchor")) {
    // Get the text content of the clicked anchor
    //students
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "D";
    console.log(anchorText);
    const response = await fetch(`/AllStudents/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (event.target && event.target.classList.contains("L_Tsharedanchor")) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "L";
    console.log(anchorText);
    const response = await fetch(`/AllStudents/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  //-----TeacherViewOption-----//
  if (event.target && event.target.id === "idWiseTeacherSearchButton") {
    // Get the text content of the clicked anchor
    //students
    const idWiseTeacherSearchBox = document.getElementById(
      "idWiseTeacherSearchBox"
    );
    let teacher_ID = idWiseTeacherSearchBox.value;
    teacher_ID = teacher_ID + "I";
    const response = await fetch(`/AllTeachers/${teacher_ID}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (
    event.target &&
    event.target.classList.contains("DeptWiseTeacherAnchor")
  ) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "D";
    console.log(anchorText);
    const response = await fetch(`/AllTeachers/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (
    event.target &&
    event.target.classList.contains("DesignationWiseTeacherAnchor")
  ) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "d";
    console.log(anchorText);
    const response = await fetch(`/AllTeachers/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  if (event.target && event.target.classList.contains("DeptCoursesAnchor")) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "D";
    console.log(anchorText);
    const response = await fetch(`/AllCourses/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  if (event.target && event.target.classList.contains("L_TCoursesAnchor")) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "L";
    console.log(anchorText);
    const response = await fetch(`/AllCourses/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (event.target && event.target.id === "addStudent") {
    // Handle the click event
    console.log("Clicked");
    const response = await fetch("/AllStudents/addStudent");
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (event.target && event.target.id === "addTeacher") {
    // Handle the click event
    console.log("Clicked");
    const response = await fetch("/AllStudents/addTeacher");
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  //admin add courses
  if (event.target && event.target.id === "addCourses") {
    // Handle the click event
    console.log("Clicked");
    const response = await fetch("/AllStudents/addCourse");
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  ///Delete Student , teacher and courses
  if (event.target && event.target.classList.contains("deleteStudent")) {
    // Handle the click event
    console.log("Clicked delete");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let student_id = row.cells[0].textContent.trim();
    Swal.fire({
      title: `Do want to Remove '${student_id}''?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(`/Delete/Student/${student_id}`);
        Swal.fire("Done!", "", "success");
        //location.reload();
      }
    });
  }

  if (event.target && event.target.classList.contains("deleteTeacher")) {
    // Handle the click event
    console.log("Clicked delete Teacher");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let teacher_id = row.cells[0].textContent.trim();
    Swal.fire({
      title: `Do want to Remove '${teacher_id}''?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(`/Delete/Teacher/${teacher_id}`);
        Swal.fire("Done!", "", "success");
        location.reload();
      }
    });
  }
  if (event.target && event.target.classList.contains("deleteCourse")) {
    // Handle the click event
    console.log("Clicked delete course");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let course_id = row.cells[0].textContent.trim();
    Swal.fire({
      title: `Do want to Remove '${course_id}''?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(`/Delete/Course/${course_id}`);
        Swal.fire("Done!", "", "success");
      }
    });
  }
  //Setting Up session
  ///setting up next session and rollback
  if (event.target && event.target.id === "NextSession") {
    console.log("setting up next session");
    let response = await fetch("/admin/NextSession");
    console.log(response);
    if (response.ok) {
      Swal.fire("Done!", "", "success");
    }
  }
  if (event.target && event.target.id === "RollBack") {
    console.log("RollBack session");
    let response = await fetch("/admin/Rollback");
    if (response.ok) {
      Swal.fire("Done!", "", "success");
    }
  }

  //resolving complaints
  if (event.target && event.target.classList.contains("resolveSharedClass")) {
    console.log("Clicked resolve");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let message_id = row.cells[0].textContent.trim();
    console.log(message_id);
    await fetch(`/resolveComplaints/${message_id}`);
    await Swal.fire("Resolved!", "", "success");
    console.log("Resolved");
  }

  //examSchedule
  if (
    event.target &&
    event.target.classList.contains("examScheduleDepartmentSharedAnchor")
  ) {
    console.log("Clicked exam schedule");
    deptOfferedforExam = event.target.textContent.trim();
    let examScheduleDepartmentButton = document.getElementById(
      "examScheduleDepartmentButton"
    );
    examScheduleDepartmentButton.textContent =
      "Department : " + deptOfferedforExam;

    console.log(deptOfferedforExam);
  }
  if (
    event.target &&
    event.target.classList.contains("examScheduleLvelTermSharedAnchor")
  ) {
    console.log("Clicked exam schedule");
    level_termforExam = event.target.textContent.trim();
    let examScheduleLevelTermButton = document.getElementById(
      "examScheduleLevelTermButton"
    );
    examScheduleLevelTermButton.textContent = "L/T : " + level_termforExam;
    const response = await fetch(
      `/Admin/ExamSchedule/${deptOfferedforExam}/${level_termforExam}`
    );
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (event.target && event.target.classList.contains("setExam")) {
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let dateInput = row.querySelector("input[type='date']");
    let courseID = row.cells[0].textContent.trim();
    let dateValue = dateInput.value;
    console.log(dateValue);
    console.log(courseID);
    fetch(`/Admin/SetExam/${courseID}/${dateValue}`);
    Swal.fire("Done!", "", "success");
  }
  /*              ADDED            */
  //pending requests
  if (
    event.target &&
    event.target.classList.contains("AdminApproveEnrollCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked approve Teacher");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let teacher_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(teacher_ID);

    Swal.fire({
      title: `Do want to approve '${course_ID}'for '${teacher_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Approve",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let response = await fetch(
          `/AdminPendingRequests/ApproveEnroll/${teacher_ID}/${course_ID}`
        );
        if (response.ok) {
          await Swal.fire("Approved!", "", "success");
        }
      }
    });
  }
  if (
    event.target &&
    event.target.classList.contains("AdminApproveDropCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked Aprrove drop Teacher");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let teacher_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(teacher_ID);
    Swal.fire({
      title: `Do want to Delete '${course_ID}' for '${teacher_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let response = await fetch(
          `/AdminPendingRequests/ApproveDrop/${teacher_ID}/${course_ID}`
        );
        if (response.ok) {
          await Swal.fire("Dropped!", "", "success");
        }
      }
    });
  }

  if (
    event.target &&
    event.target.classList.contains("AdminDeleteEnrollCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked delete Enroll Teacher");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let teacher_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(teacher_ID);
    Swal.fire({
      title: `Do want to disallow to enroll '${course_ID}' for '${teacher_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let response = await fetch(
          `/AdminPendingRequests/DeleteEnroll/${teacher_ID}/${course_ID}`
        );
        if (response.ok) {
          await Swal.fire("Denied enroll!", "", "warning");
        }
      }
    });
  }

  if (
    event.target &&
    event.target.classList.contains("AdminDeleteDropCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked delete drop Teacher");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let teacher_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(teacher_ID);
    Swal.fire({
      title: `Do want to disallow to drop '${course_ID}' for '${teacher_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let response = await fetch(
          `/AdminPendingRequests/DeleteDrop/${teacher_ID}/${course_ID}`
        );
        if (response.ok) {
          await Swal.fire("Drop denied !", "", "warning");
        }
      }
    });
  }

  /**     Added  For Notice Handling       **/
  if (event.target && event.target.id === "submitNotice") {
    // Handle the click event
    console.log("Submit Notice Clicked");

    const Notice_MSG = document.getElementById("Notice_MSG");
    let noticeMsg = Notice_MSG.value;
    console.log(noticeMsg);
    Swal.fire({
      title: "Do you want add this as a notice?",
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let response = await fetch(`/adminAddNotice/${noticeMsg}`);
        if (response.ok) {
          await Swal.fire("Added at notice Board!", "", "success");
        }
      }
    });
  }
});
