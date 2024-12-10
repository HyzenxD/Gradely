const informationDiv = document.getElementById("informationDiv");
const result = document.getElementById("result");
const viewInfo = document.getElementById("viewInfo");
const advisorInfo = document.getElementById("advisorInfo");
const notice = document.getElementById("notice");
const changePass = document.getElementById("changePass");
const Profile = document.getElementById("Profile");
const id_input = document.getElementById("idInput");
const dropdownText = document.getElementById("navbarDropdown");
const log_out = document.getElementById("logout");
const home = document.getElementById("home");
const currentCourse = document.getElementById("currentCourse");
const pendingCourse = document.getElementById("pendingCourse");
const completedCourse = document.getElementById("completedCourse");
const enroll_Drop_Courses = document.getElementById("enroll_Drop_Courses");
const issueComplaints = document.getElementById("issueComplaints");
const editStudentInfo = document.getElementById("editStudentInfo");
const about = document.getElementById("about");
const finalExamRoutine = document.getElementById("finalExamRoutine");

//Student enroll or drop courses click
enroll_Drop_Courses.addEventListener("click", async function () {
  console.log("Enroll Clicked");
  const response = await fetch("/enroll");
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});

issueComplaints.addEventListener("click", async function () {
  console.log("Compaints Clicked");
  const response = await fetch("/UserIssueComplaints");
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

log_out.addEventListener("click", async function () {
  console.log("Logout Clicked");
  var result = confirm("Are you sure you want to log out?");
  if (result) {
    window.location.href = "/";
  }
});
result.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch(`/result/viewAll`);
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});
finalExamRoutine.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch(`/FinalExamRoutine/Student`);
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});

viewInfo.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch(`/viewinfo`);
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

editStudentInfo.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch("/Student/editInfo");
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});
Profile.addEventListener("click", async function () {
  const response = await fetch(`/profile`);
  const contents = await response.text();
  console.log(contents);
  console.log(contents);
  informationDiv.innerHTML = contents;
});
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

advisorInfo.addEventListener("click", async function () {
  //This will be request to server and response from server
  //code
  const response = await fetch(`/advisorInfo`);
  const contents = await response.text();
  console.log(contents);
  informationDiv.innerHTML = contents;
});
home.addEventListener("click", async function () {
  const response = await fetch(`/profile`);
  const contents = await response.text();
  console.log(contents);
  console.log(contents);
  informationDiv.innerHTML = contents;
});

notice.addEventListener("click", async function () {
  const response = await fetch(`/notice`);
  const contents = await response.text();
  console.log("ntc");
  console.log(contents);
  informationDiv.innerHTML = contents;
});

currentCourse.addEventListener("click", async function () {
  const response = await fetch(`/studentViewCourses/Current`);
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

pendingCourse.addEventListener("click", async function () {
  const response = await fetch(`/studentViewCourses/Pending`);
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

completedCourse.addEventListener("click", async function () {
  console.log("Clicked completed");
  const response = await fetch(`/studentViewCourses/Completed`);
  const contents = await response.text();
  informationDiv.innerHTML = contents;
});

informationDiv.addEventListener("click", async function (event) {
  if (
    event.target &&
    event.target.classList.contains("CourseResultSharedAnchor")
  ) {
    // Handle the click event
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "C";
    console.log(anchorText);
    const response = await fetch(`/result/${anchorText}`);
    const contents = await response.text();

    const resultDiv = document.getElementById("resultDiv");
    resultDiv.innerHTML = contents;
  }
  if (
    event.target &&
    event.target.classList.contains("TermWiseResultSharedAnchor")
  ) {
    // Handle the click event
    let anchorText = event.target.textContent.trim();
    anchorText = anchorText + "T";
    console.log(anchorText);

    const response = await fetch(`/result/${anchorText}`);
    const contents = await response.text();

    const resultDiv = document.getElementById("resultDiv");
    resultDiv.innerHTML = contents;
  }
  //DashBoard Add button Handler
  if (event.target && event.target.classList.contains("addCourseButton")) {
    // Handle the click event
    let clickedButton = event.target;
    let row = clickedButton.parentNode.parentNode;
    let courseID = row.cells[0].textContent.trim();
    // let courseTitle = row.cells[1].textContent.trim();
    //let levelTerm = row.cells[2].textContent.trim();
    // console.log(levelTerm);
    let sessionName = row.cells[3].textContent.trim();
    //console.log(sessionName);
    Swal.fire({
      title: `Do you want to add '${courseID}' to your courses?`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Add",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const successAlertDiv = document.getElementById("succesAlertDiv");
        fetch(`/StudentADD_DropCourse/ADD/${courseID}/${sessionName}/Pending`);

        Swal.fire(
          `${courseID} is pending to be enrolled. Your advisor will approve it`,
          "",
          "success"
        );
      }
    });
  }
  if (event.target && event.target.classList.contains("dropCourseButton")) {
    // Handle the click event
    let clickedButton = event.target;
    console.log("Drop clicked");
    let row = clickedButton.parentNode.parentNode;
    let courseID = row.cells[0].textContent.trim();
    let courseTitle = row.cells[1].textContent.trim();
    let levelTerm = row.cells[2].textContent.trim();
    // console.log(levelTerm);
    let sessionName = row.cells[3].textContent.trim();

    //console.log(sessionName);
    let status = row.cells[4].textContent.trim();
    console.log(status);
    Swal.fire({
      title: `Do you want to Drop '${courseID}' to your courses?`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Drop",
    }).then((result) => {
      if (result.isConfirmed) {
        const successAlertDiv = document.getElementById("succesAlertDiv");
        fetch(
          `/StudentADD_DropCourse/DROP/${courseID}/${sessionName}/${status}`
        );
        if (status == "Pending") {
          Swal.fire(`${courseID} is dropped.`, "", "success");
        } else {
          Swal.fire(
            `${courseID} is pending to be dropped. Your advisor will approve it`,
            "",
            "warning"
          );
        }
      }
    });
  }

  //password change
  // if (event.target && event.target.id === "changePassSubmitButton") {
  //   //event.preventDefault();
  //   console.log("Clicked change pass inside dashboard");
  //   const confirmPasswordMatch = document.getElementById(
  //     "confirmPasswordMatch"
  //   );
  //   confirmPasswordMatch.innerHTML = "";
  //   const currentPassword = document.getElementById("currentPassword");
  //   const newPassword = document.getElementById("newPassword");
  //   const confirmPassword = document.getElementById("confirmPassword");
    /*const showHidePasswordButtons = document.querySelectorAll('.show-hide-password');
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    showHidePasswordButtons.forEach((button, index) => {
      button.addEventListener('click', function () {
       // event.preventDefault();
        console.log("Clicked show")
        if (passwordInputs[index].getAttribute('type') === 'password') {
          passwordInputs[index].setAttribute('type', 'text');
        } else {
          passwordInputs[index].setAttribute('type', 'password');
        }
        passwordInputs[index].value = passwordInputs[index].value;
      });
    });*/
    // console.log(currentPassword.value);
    // console.log(newPassword.value);
    // console.log(confirmPassword.value);
    // if (newPassword.value != confirmPassword.value) {
    //   confirmPasswordMatch.innerHTML = "Confirm your new password correctly!";
    // }
  // }
});
