//studentButton namer ekta variable create kora hoyeche, jeta studentButton ID wala button ke dhore rakhe. 
//Eita student login er jonno.
const studentButton = document.getElementById("studentButton");
const teacherButton = document.getElementById("teacherButton");
const adminButton = document.getElementById("adminButton");
const id_input = document.getElementById("idInput");
const password = document.getElementById("passwordInput");
const loginAsMessageDiv = document.getElementById("loginAsDiv");
//studentButton.addEventListener("click", studentLogin);
//studentButton-e click korle studentLogin function run hobe.
studentButton.addEventListener("click", studentLogin);
teacherButton.addEventListener("click", teacherLogin);
adminButton.addEventListener("click", adminLogin);

//button click event on Login Page
/*inputBoxDiv ebong studentLoginDiv ID wala HTML element gulo ke dhore rakhe.
inputBoxDiv.style.display = "none";: Buttons (input fields shoh) lukiye fela.
studentLoginDiv.style.display = "flex";: Student login form dekhay.
loginAsDiv.innerHTML = "Login as Student";: Text "Login as Student" show kore.*/
function studentLogin() {
  // Get references to the elements
  const inputBoxDiv = document.getElementById("inputBoxDiv");
  const studentLoginDiv = document.getElementById("studentLoginDiv");
  document.getElementById("loginAsDiv").innerHTML = "Login as Student";

  // Hide the input buttons
  inputBoxDiv.style.display = "none";

  // Show the student login elements
  studentLoginDiv.style.display = "flex";
}

function teacherLogin() {
  // Get references to the elements
  const inputBoxDiv = document.getElementById("inputBoxDiv");
  const studentLoginDiv = document.getElementById("studentLoginDiv");
  loginAsMessageDiv.innerHTML = "Login as Teacher";

  // Hide the input buttons
  inputBoxDiv.style.display = "none";

  // Show the student login elements
  studentLoginDiv.style.display = "flex";
}

function adminLogin() {
  // Get references to the elements
  const inputBoxDiv = document.getElementById("inputBoxDiv");
  const studentLoginDiv = document.getElementById("studentLoginDiv");
  document.getElementById("loginAsDiv").innerHTML = "Login as Admin";

  // Hide the input buttons
  inputBoxDiv.style.display = "none";

  // Show the student login elements
  studentLoginDiv.style.display = "flex";
}

//Added password field
/*idInput ebong passwordInput theke ID o password nibe.
Data ke JSON format kore /user route e POST request pathabe.
Response pawa gele, oi link e redirect korbe.*/
async function submitClick() {
  const id = id_input.value;
  let pass = password.value;

  //make an json object
  let data = JSON.stringify({ id: id, password: pass });
  //console.log(typeof pass);

  if (pass.length === 0) pass = "default";

  try {
    // Redirect to the about page with the provided ID
    //window.location.href = `/user/${id}/${pass}`;

    await fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.href = `${data.linkText}`;
      });
  } catch (error) {
    alert(error);
    console.error("Error redirecting:", error);
  }
}
function backClick() {
  studentLoginDiv.style.display = "none";
  inputBoxDiv.style.display = "flex";
  document.getElementById(
    "loginAsDiv"
  ).innerHTML = `<p style="font-size: 30px; font-weight: 600;">Login</p>`;
}
