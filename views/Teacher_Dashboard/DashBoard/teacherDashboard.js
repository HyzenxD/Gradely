const viewFullInfo = document.getElementById("viewFullInfo");
const teacherHome = document.getElementById("teacherHome");
const Profile = document.getElementById("Profile");
const teacherInformationDiv = document.getElementById("teacherInformationDiv");
const viewCourses = document.getElementById("viewCourses");
const viewStudents = document.getElementById("viewStudents");
const addDropCourses = document.getElementById("addDropCourses");
const viewPendingRequests = document.getElementById("viewPendingRequests");
const issueComplaints = document.getElementById("issueComplaints");
const log_out = document.getElementById("logout");
const notice = document.getElementById("notice");
const editTeacherInfo = document.getElementById("editTeacherInfo");
const insertResult = document.getElementById("insertResult");
const about = document.getElementById("about");
const viewResult = document.getElementById("viewResult");
const changePass = document.getElementById("changePass");
let STUDENT_ID_FOR_APPROVE = null;
let courseIDForResult;
let studentIDForResult;

changePass.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  console.log("Change pass clicked");
  try {
    const response = await fetch(`/changePass`);
    const contents = await response.text(); // Await the response text
    teacherInformationDiv.innerHTML = contents;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});


viewFullInfo.addEventListener("click", async function () {
  console.log("Profile Clicked");
  const response = await fetch("/Teacher/FullInfo");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});

editTeacherInfo.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch("/Teacher/editInfo");
  const contents = await response.text();
  teacherInformationDiv.innerHTML = contents;
});

viewPendingRequests.addEventListener("click", async function () {
  console.log("Profile Clicked");
  const response = await fetch("/Teacher/PendingRequest");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});
issueComplaints.addEventListener("click", async function () {
  console.log("Compaints Clicked");
  const response = await fetch("/UserIssueComplaints");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});

teacherHome.addEventListener("click", async function () {
  const response = await fetch("/Teacher/Profile");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});

Profile.addEventListener("click", async function () {
  const response = await fetch("/Teacher/Profile");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});

notice.addEventListener("click", async function () {
  const response = await fetch(`/notice`);
  const contents = await response.text();
  console.log("ntc");
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
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

insertResult.addEventListener("click", async function () {
  const response = await fetch("/teacherInsertResult/CourseSelection/Anything");
  const contents = await response.text();

  console.log("ntc");
  teacherInformationDiv.innerHTML = contents;
});
/*      Added       */
viewResult.addEventListener("click", async function () {
  const response = await fetch("/teacherViewResult");
  const contents = await response.text();
  teacherInformationDiv.innerHTML = contents;
});

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

viewCourses.addEventListener("click", async function () {
  const response = await fetch("/Teacher/Courses");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});
viewStudents.addEventListener("click", async function () {
  const response = await fetch("/Teacher/Students");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});

addDropCourses.addEventListener("click", async function () {
  console.log(" Inside AddDrop");
  const response = await fetch("/Teacher/AddOrDrop");
  const contents = await response.text();
  console.log(contents);
  teacherInformationDiv.innerHTML = contents;
});

teacherInformationDiv.addEventListener("click", async function (event) {
  if (event.target && event.target.id === "allCourses") {
    // Handle the click event
    console.log("Clicked all courses");
    const response = await fetch("/TeacherViewCourses/viewAll");
    const contents = await response.text();

    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (
    event.target &&
    event.target.classList.contains("sessionWiseCourseSharedAnchor")
  ) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "S";
    console.log(anchorText);
    const response = await fetch(`/TeacherViewCourses/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (
    
    event.target &&
    event.target.classList.contains("levelTermWiseCourseSharedAnchor")  
  ) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "L";
    console.log(anchorText);
    const response = await fetch(`/TeacherViewCourses/${anchorText}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  //studentsButtonClickEvents

  if (event.target && event.target.id === "allStudents") {
    // Handle the click event
    console.log("Clicked all students");
    const response = await fetch("/TeacherViewStudents/viewAll");
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  if (event.target && event.target.id === "advisedStudents") {
    // Handle the click event
    console.log("Clicked all advised students");
    const response = await fetch("/TeacherViewStudents/advised");
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (
    event.target &&
    event.target.classList.contains("courseWiseStudentsSharedAnchor")
  ) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    console.log(anchorText);
    let courseId = anchorText;
    const courseDropDown = document.getElementById("courseDropDown");
    courseDropDown.textContent = courseId;
    const response = await fetch(`/TeacherViewStudents/CourseWise/${courseId}`);
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
    /*const response = await fetch(`/TeacherViewStudents/${anchorText}`);
        const contents = await response.text();
        const div2 = document.getElementById("div2");
        div2.innerHTML = contents;*/
  }
  if (
    event.target &&
    event.target.classList.contains("sessionWiseStudentsSharedAnchor")
  ) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    const sessionDropDown = document.getElementById("sessionDropDown");
    sessionDropDown.textContent = anchorText;
    console.log(anchorText);
  }
  //addOrDrop courses
  if (event.target && event.target.classList.contains("addCourseButton")) {
    // Handle the click event
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let courseID = row.cells[0].textContent.trim();
    console.log("Inside addCourse Click");
    Swal.fire({
      title: `Do you want to add '${courseID}' to your courses?`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Add",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await fetch(`/TeacherADD_DropCourse/ADD/${courseID}`);
        Swal.fire("Added!", "", "success");
      }
    });
  }
  if (event.target && event.target.classList.contains("dropCourseButton")) {
    // Handle the click event
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let courseID = row.cells[0].textContent.trim();
    let sessionName = row.cells[3].textContent.trim();
    console.log(sessionName);
    Swal.fire({
      title: `Do you want to remove '${courseID}' to your courses?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Drop",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await fetch(`/TeacherADD_DropCourse/DROP/${courseID}`);
        Swal.fire("Dropped!", "", "success");
      }
    });
  }

  //pending Requests
  if (
    event.target &&
    event.target.classList.contains("approveEnrollCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked approve all students");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let student_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(student_ID);

    Swal.fire({
      title: `Do want to approve '${course_ID}'for '${student_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Approve",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await fetch(
          `/TeacherPendingRequests/ApproveEnroll/${student_ID}/${course_ID}`
        );
        await Swal.fire("Approved!", "", "success");
      }
    });
  }
  if (
    event.target &&
    event.target.classList.contains("approveDropCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked Aprrove drop student");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let student_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(student_ID);
    Swal.fire({
      title: `Do want to Delete '${course_ID}' for '${student_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await fetch(
          `/TeacherPendingRequests/ApproveDrop/${student_ID}/${course_ID}`
        );
        await Swal.fire("Dropped!", "", "success");
      }
    });
  }

  if (
    event.target &&
    event.target.classList.contains("deleteEnrollCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked delete Enroll student");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let student_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(student_ID);
    Swal.fire({
      title: `Do want to disallow to enroll '${course_ID}' for '${student_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await fetch(
          `/TeacherPendingRequests/DeleteEnroll/${student_ID}/${course_ID}`
        );
        await Swal.fire("Done!", "", "warning");
      }
    });
  }

  if (
    event.target &&
    event.target.classList.contains("deleteDropCoursesRequest")
  ) {
    // Handle the click event
    console.log("Clicked delete Enroll student");
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let student_ID = row.cells[0].textContent.trim();
    let course_ID = row.cells[1].textContent.trim();
    console.log(student_ID);
    Swal.fire({
      title: `Do want to disallow to drop '${course_ID}' for '${student_ID}'?`,
      showCancelButton: true,
      background: "#F0F8FF",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await fetch(
          `/TeacherPendingRequests/DeleteDrop/${student_ID}/${course_ID}`
        );
        await Swal.fire("Done!", "", "warning");
      }
    });
  }

  if (
    event.target &&
    event.target.classList.contains("studentIdWiseRequestsSharedAnchor")
  ) {
    // Get the text content of the clicked anchor
    let anchorText = event.target.textContent.trim();
    console.log(anchorText);
    const studentIdRequestsButton = document.getElementById(
      "studentIdRequestsButton"
    );
    studentIdRequestsButton.textContent = anchorText;
    STUDENT_ID_FOR_APPROVE = anchorText;
    const response = await fetch(
      `/TeacherPendingRequests/RequestTable/${anchorText}`
    );
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }
  if (event.target && event.target.id === "allrequests") {
    // Handle the click event
    const response = await fetch(
      "/TeacherPendingRequests/RequestTable/viewAll"
    );
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  //resultInsert

  if (
    event.target &&
    event.target.classList.contains("courseSelectionForResultAnchor")
  ) {
    // Get the text content of the clicked anchor
    courseIDForResult = event.target.textContent.trim();
    console.log(courseIDForResult);
    const courseForResultButton = document.getElementById(
      "courseForResultButton"
    );
    courseForResultButton.textContent = courseIDForResult;
    const response = await fetch(
      `/teacherInsertResult/StudentIdSelection/${courseIDForResult}`
    );
    const contents = await response.text();
    const div2 = document.getElementById("div2");
    div2.innerHTML = contents;
  }

  if (
    event.target &&
    event.target.classList.contains("studentIDForResultAnchor")
  ) {
    // Get the text content of the clicked anchor
    studentIDForResult = event.target.textContent.trim();
    console.log(studentIDForResult);
    const studentIDForResultButton = document.getElementById(
      "studentIDForResultButton"
    );
    studentIDForResultButton.textContent = studentIDForResult;
    const response = await fetch(
      `/teacherInsertResult/ResultForm/${studentIDForResult}/${courseIDForResult}`
    );
    const contents = await response.text();
    const div3 = document.getElementById("div3");
    div3.innerHTML = contents;
  }
});
