const oracledb = require("oracledb");
const express = require("express");

const path = require("path");
const { log, Console, time } = require("console");
const session = require("express-session"); //for storing global variables
const bcrypt = require("bcrypt"); //pass hash and match function
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
//Express app create kora.
// EJS templating engine set kora dynamic HTML generate korar jonno.
const app = express();
app.set("view engine", "ejs");
let id = "0";
let sessionName = "July 2023";

//app.use(express.static('LoginPage'));
//app.use(express.static(path.join(__dirname, 'LoginPage')));
//app.use(express.static(path.join(__dirname,'Demo_Dashboard')));
//app.use(express.static('LoginPage'));
//app.use(express.static('Demo_Dashboard'));
///views: Static file serve korar jonno views folder specify kora.
//node_modules: Node.js libraries er static file serve korar jonno
app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

//post method kaaj koranor jonno eta add korano lagse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// secret: Session data encrypt korar key.
// resave: Same session abar save hobe na.
// saveUninitialized: Kono session data na thakle save korbe na.
app.use(
  //session function inititalization
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  //middle-ware for redirecting to wrong-pass if not authenticated
  console.log(req.url);
//   Authentication na lagle: /, /user, /wrongPass, /favicon.ico route gulo authentication charai accessable.
// Authenticated User: req.session.auth true hole next middleware e proceed kore.
// Unauthenticated User: Login page (/) e redirect kore.


  if (
    req.url === "/" ||
    req.url === "/user" ||
    req.url === "/wrongPass" ||
    req.url === "/favicon.ico"
  ) {
    console.log("no need auth");
    next(); // these pages do not requre authentication
  } else if (req.session.auth === true) {
    console.log("user authed");
    next(); //let the user go to pages, authenticated
  } else {
    console.log("no auth");
    res.redirect("/"); //send user to login page
  }
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});

async function run(query) {
  const connection = await oracledb.getConnection({
    user: "C##Gradely",
    password: "12345",
     connectString: "localhost/ORCL"
  });

  let result;
  // Query execute kore result dibe.
  // Kono error thakle "not found" message o error show korbe.
  // Database connection close kore query er result return kore.
  try {
    //added try catch
    result = await connection.execute(query);
  } catch (err) {
    console.log("not found");
    console.log(err);
  }
  await connection.close();
  return result;
  // Always close connections
}



//--------post method of login form--------------
// /user: Login request process korar POST route.
// req.body: Form data (ID o password) fetch kore.
app.post("/user", async (req, res) => {
  let receivedData = req.body;

  // req.session.idN: Session er moddhe user ID store kora.
  // id: Form theke asha user ID store.
  // pass: Form theke asha password store.
  
  req.session.idN = receivedData.id; //session dependent global variable
  id = req.session.idN;
  let pass = receivedData.password;

  console.log(id);
  console.log(req.session.idN);
  console.log(pass);
// ID er first letter check kora:
// S: Student.
// A: Admin.
// T: Teacher.
  if (id[0] === "S") {
    //console.log(id[0]);
//Database query: Student ID match kore kono data ase kina.
    const data = await run(
      `SELECT * FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`
    );
    // Match hole: Authentication set kore (req.session.auth = true) o /user/{id} e redirect kore.
    // Match na hole: /wrongPass page-e redirect.
    if (data.rows[0] === undefined) {
      console.log("data not found");
      res.json({ linkText: "/wrongPass" }); //send the link of wrongpass page to frontend
    } else {
      console.log(data.rows[0]["PASSWORD"]);
      let isValid = await bcrypt.compare(pass, data.rows[0]["PASSWORD"]); //checking hashes
      if (isValid) {
        req.session.auth = true; //authenticated
        res.json({ linkText: "/user/" + id }); //res render  not working in post method
        //res.render("Dashboard/dashboard", { student_data: data.rows[0] });
      } else {
        console.log("Wrong password");
        res.json({ linkText: "/wrongPass" });
      }
    }
  } else if (id[0] === "A") {
    console.log(id);

    const data = await run(`SELECT * FROM ADMIN WHERE ID LIKE '${id}'`);

    if (data.rows[0] === undefined) {
      console.log("data not found");
      res.json({ linkText: "/wrongPass" });
    } else {
      console.log(data.rows[0]["PASSWORD"]);
      console.log(id);
      let isValid = await bcrypt.compare(pass, data.rows[0]["PASSWORD"]);

      if (isValid) {
        //res.render("Admin_Dashboard/adminDashboard", {
        //  admin_data: data.rows[0],
        //  sessionName,
        //});
        req.session.auth = true;
        res.json({ linkText: "/user/" + id });
      } else {
        console.log("Wrong password");
        res.json({ linkText: "/wrongPass" });
      }
    }
  } else if (id[0] === "T") {
    console.log(id);
    const data = await run(
      `SELECT * FROM TEACHER WHERE Teacher_ID LIKE '${id}'`
    );

    if (data.rows[0] === undefined) {
      console.log("data not found");
      res.json({ linkText: "/wrongPass" });
    } else {
      console.log(data.rows[0]["PASSWORD"]);

      let isValid = await bcrypt.compare(pass, data.rows[0]["PASSWORD"]); //checking hashes

      if (isValid) {
        //res.render("Teacher_Dashboard/DashBoard/teacherDashboard", {
        // teacher_data: data.rows[0],
        // });
        req.session.auth = true;
        res.json({ linkText: "/user/" + id });
      } else {
        console.log("Wrong password");
        res.json({ linkText: "/wrongPass" });
      }
    }
  } else {
    console.log("Wrong id 1");
    res.json({ linkText: "/wrongPass" });
  }

  //let response = { message: "connented" };
  //res.send(200);
});

// /user/:id: Dynamic route, user ID diye dashboard access korte dey.
// req.params.id: URL theke pathano ID fetch kore.
app.get("/user/:id", async (req, res) => {
  //wrong password or id page
  console.log(" get user id method");

  if (req.params.id !== req.session.idN) res.redirect("/wrongPass"); //someone tries to access other id's dashboard insted of his own
//Render: Dashboard/dashboard ejs file render kore o data send kore { student_data: data.rows[0] }.
  if (id[0] === "S") {
    //console.log(id[0]);
    const data = await run(
      `SELECT * FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`
    );

    res.render("Dashboard/dashboard", { student_data: data.rows[0] });
  } else if (id[0] === "A") {
    console.log(id);

    const data = await run(`SELECT * FROM ADMIN WHERE ID LIKE '${id}'`);

    res.render("Admin_Dashboard/adminDashboard", {
      admin_data: data.rows[0],
      sessionName,
    });
  } else if (id[0] === "T") {
    console.log(id);
    const data = await run(
      `SELECT * FROM TEACHER WHERE Teacher_ID LIKE '${id}'`
    );

    console.log(data.rows[0]["PASSWORD"]);

    res.render("Teacher_Dashboard/DashBoard/teacherDashboard", {
      teacher_data: data.rows[0],
    });
  }
  //res.send(404);
});
app.get("/wrongPass", (req, res) => {
  //wrong password or id page
  console.log(" get wrong pass method");
  res.render("WrongPass/index");
  //res.send(404);
});

//COMPLAIN
//Render: Complaint_Or_Requests/complaint EJS template page render kore, jeikhane user complaint issue korte pare.

app.get("/UserIssueComplaints", async (req, res) => {
  //changed the get url, conflicts with
  console.log("Inside issue Complaints");
  res.render("Complaint_Or_Requests/complaint");
});
//Route: /complaintsSubmit request handle kore (user complaint submit korar jonno).
app.post("/complaintsSubmit", async (req, res) => {
  const dataReceived = req.body;
  console.log(dataReceived.Complaint);

  id = req.session.idN; //session dependent global variable
  let senderType;
  if (id[0] === "T") senderType = "Teacher";
  else senderType = "Student";
  await run(
    `INSERT INTO REQEUSTSORCOMPLAINTS
    (SENDER_TYPE, SENDER_ID, SENDING_TIME, MESSAGE_TYPE, MESSAGE, MESSAGE_ID)
    VALUES('${senderType}', '${id}', SYSDATE, 'Complaint', '${dataReceived.Complaint}', 'MSG' || MSG_ID.NEXTVAL)`
  );
  console.log("inserted");
  //location.reload();

 
});

app.get("/about", async (req, res) => {
  console.log("Inside about");
  res.render("About/aboutUs", { senderID: req.session.idN });
});
app.get("/profile", async (req, res) => {
  console.log("connection complete");
  // const id = req.params.id;
  id = req.session.idN; //session dependent global variable
  console.log(id);

  const data = await run(`SELECT * FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`);
  console.log("Inside dashboard view INFO");
  res.render("Dashboard/ViewInfo/profile", { student_data: data.rows[0] });
});
//StudentFullInfo
app.get("/viewinfo", async (req, res) => {
  console.log("connection complete");
  // const id = req.params.id;
  id = req.session.idN; //session dependent global variable
  console.log(id);

  const data = await run(`SELECT * FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`);
  console.log("Inside dashboard view INFO");
  res.render("Dashboard/ViewInfo/fullinfo", { student_data: data.rows[0] });
});
//added this
app.get("/Student/editInfo", async (req, res) => {
  //console.log('connection complete. Inside Edit info get method');
  // const id = req.params.id;
  id = req.session.idN;
  console.log(id);

  const data = await run(`SELECT * FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`);
  res.render("Dashboard/ViewInfo/editInfo", { student_data: data.rows[0] });
});
//post method for saveInfo
app.post("/saveinfo", async (req, res) => {
  // Retrieve the form data from req.body
  console.log("Inside saveInfo post method");

  id = req.session.idN; //session dependent global variable
  console.log(req.body);

  const studentId = req.body.student_id;
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;

  console.log(firstName);

  await run(`DECLARE
  BEGIN
    public_package.logged_in_id := '${id}';
    
    UPDATE STUDENT
    SET FIRST_NAME='${req.body.first_name}', LAST_NAME='${req.body.last_name}', EMAIL='${req.body.email}', PHONE_NO='${req.body.phone_no}', ADDRESS='${req.body.address}'
    WHERE STUDENT_ID='${id}';
    
  END;
`);

  const alertMessage = "Student information updated successfully!"; // Change the message as needed

  res.send(
    `<script>window.alert("${alertMessage}"); window.history.back();</script>`
  );
});
//Student's ADvisor info
app.get("/advisorInfo", async (req, res) => {
  console.log("Inside dashboard view Advisor INFO");
  console.log("connection complete");
  id = req.session.idN; //session dependent global variable
  console.log(id);

  const data = await run(
    `SELECT * FROM teacher WHERE TEACHER_ID = (SELECT advisor_id FROM STUDENT WHERE Student_id LIKE  '${id}')`
  );
  res.render("Dashboard/ViewInfo/advisorinfo", { advisor_data: data.rows[0] });
});
//Student views result
app.get("/result/:string", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  console.log(id);
  const str = req.params.string;
  let strActual = str.substring(0, str.length - 1);
  console.log(strActual);
  if (str === "viewAll") {
    const current_level_term = await run(
      `SELECT LEVEL_TERM FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`
    );
    const courses = await run(
      `SELECT COURSE_ID FROM ENROLLS 
  WHERE STUDENT_ID LIKE '${id}' AND STATUS = 'Completed'
  UNION
  SELECT COURSE_ID FROM ENROLLS 
  WHERE STUDENT_ID LIKE '${id}' AND STATUS = 'Current'`
    );
    const level_terms = await run(
      `SELECT DISTINCT Level_Term
  FROM Courses
  WHERE Course_ID IN (
    SELECT Course_ID
    FROM Enrolls
    WHERE Student_ID = '${id}' AND Status='Completed'
  )`
    );
    console.log(level_terms.rows);
    //console.log(courses.rows);
    res.render("ViewResult/viewresult", {
      courses,
      current_level_term,
      level_terms,
    });
  } else if (str[str.length - 1] === "C") {
    const results = await run(
      `SELECT * FROM RESULTS WHERE STUDENT_ID  LIKE '${id}' AND COURSE_ID LIKE  '${strActual}'`
    );
    res.render("ViewResult/IndividualCourseResults", { results, strActual });
  } else if (str[str.length - 1] === "T") {
    const termWiseresults = await run(
      `SELECT C.Course_ID, C.Course_Title, E.Session_Name, C.Level_Term, C.Credit_Hours, R.Grade
      FROM Enrolls E
      INNER JOIN (
          SELECT Course_ID, Grade
          FROM Results
          WHERE Student_ID LIKE '${id}'
      ) R ON E.Course_ID = R.Course_ID
      INNER JOIN Courses C ON E.Course_ID = C.Course_ID
      WHERE E.Student_ID = '${id}'
        AND C.Level_Term = '${strActual}'`
    );
    let cgpa = await run(`select Calculate_CGPA('${id}') as cgpa from dual`);
    console.log(cgpa);

    let gpa = await run(
      `select gpa from GPA g where g.STUDENT_ID like '${id}' AND g.LEVEL_TERM LIKE '${strActual}'`
    );
    console.log(termWiseresults.rows);
    res.render("ViewResult/TermWiseResult", {
      termWiseresults,
      strActual,
      cgpa,
      gpa,
    });
  }
});
//Shows the enroll window, which have drop and add courses
app.get("/enroll", async (req, res) => {
  //console.log('enroll'+id);
  id = req.session.idN; //session dependent global variable
  const level_term = await run(
    `SELECT LEVEL_TERM FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`
  );
  const dept = await run(
    `SELECT DEPARTMENT FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`
  );
  let departmentName = dept.rows[0].DEPARTMENT;
  console.log(departmentName);
  let L_T = level_term.rows[0].LEVEL_TERM;
  console.log(L_T);
  const availableCourses = await run(
    `SELECT c.COURSE_ID, c.COURSE_TITLE, c.CREDIT_HOURS, c.LEVEL_TERM, s.SESSION_NAME
     FROM COURSES c 
     JOIN SESSIONS s ON c.COURSE_ID = s.COURSE_ID
     WHERE DEPARTMENT_OFFERED = '${departmentName}' 
       AND s.SESSION_NAME = '${sessionName}' 
       AND LEVEL_TERM = '${L_T}'
       AND c.COURSE_ID NOT IN (
         SELECT COURSE_ID 
         FROM ENROLLS e 
         WHERE e.STUDENT_ID = '${id}'
       )`
  );
  
  
  const dropCourses = await run(
    `SELECT e.COURSE_ID, c.COURSE_TITLE, c.CREDIT_HOURS, e.SESSION_NAME, c.LEVEL_TERM, e.STATUS
     FROM ENROLLS e 
     INNER JOIN COURSES c ON e.COURSE_ID = c.COURSE_ID
     WHERE e.STUDENT_ID = '${id}' 
     AND (e.STATUS = 'Current' OR e.STATUS = 'Pending')`
  );
  
  res.render("StudentEnrollCourse/enroll", {
    availableCourses,
    level_term,
    dept,
    dropCourses,
  });
});

/*----TODO -----*/

app.get("/notice", async (req, res) => {
  console.log("ntc2");
  let notices = await run(
    `SELECT TO_CHAR(CREATEDATE,'DD/MM/YYY') NOTICEDATE , NOTICEMSG FROM NOTICES`
  );
  //console.log(notices.rows[2].NOTICEMSG);
  res.render("Notice/notice", { notices });
});

/*----TODO -----*/
//Student Change pass
app.get("/changePass", async (req, res) => {
  console.log("Pass change");

  res.render("passwordChange/changepass");
});

//Student view current,avaialble and completed courses
app.get("/studentViewCourses/:status", async (req, res) => {
  const status = req.params.status;
  id = req.session.idN; //session dependent global variable
  console.log(id);
  const data = await run(
    `SELECT c.Course_ID, c.Course_Title, c.Credit_Hours, c.Level_Term, e.Session_Name
    FROM Courses c
    INNER JOIN Enrolls e ON c.Course_ID = e.Course_ID
    WHERE e.Student_ID LIKE '${id}' AND e.Status LIKE '${status}'`
  );

  const level_term = await run(
    `SELECT LEVEL_TERM FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`
  );
  const dept = await run(
    `SELECT DEPARTMENT FROM STUDENT WHERE STUDENT_ID LIKE '${id}'`
  );

  //let departmentName = dept.rows[0].DEPARTMENT;
  //console.log(departmentName);
  res.render("StudentViewCourses/StdViewCourses", { data, level_term, dept });
  //}
});
//Enroll courses of student from student dashboard
app.get(
  "/StudentADD_DropCourse/:action/:course_id/:session_name/:status",
  async (req, res) => {
    id = req.session.idN; //session dependent global variable
    const action = req.params.action;
    console.log(action);
    const course_id = req.params.course_id;
    console.log(course_id);
    const session_name = req.params.session_name;
    console.log(sessionName);
    const status = req.params.status;
    console.log(status);
    if (action === "ADD") {
      await run(
        `
  INSERT INTO Enrolls (Student_ID,Session_Name,  Course_ID, Status)
  VALUES ('${id}',  '${session_name}', '${course_id}','${status}')
    `
      );
      console.log("added succesfully!");
    }
    if (action === "DROP") {
      if (status === "Pending") {
        await run(
          `
      DELETE FROM ENROLLS  WHERE STUDENT_ID = '${id}' AND COURSE_ID = '${course_id}' AND SESSION_NAME='${session_name}'
      `
        );
        console.log("Deleted succesfully!");
      } else {
        console.log("Inside Drop current");
        await run(
          `
        UPDATE ENROLLS x
        SET x.STATUS='Pending Delete'
        WHERE x.STUDENT_ID='${id}' AND x.SESSION_NAME='${session_name}' AND x.COURSE_ID='${course_id}'
        `
        );
      }
    }
    //res.redirect('/enroll');
  }
);

app.get("/FinalExamRoutine/:viewBy", async (req, res) => {
  let viewBy = req.params.viewBy;
  id = req.session.idN;
  console.log(id);
  if (viewBy === "Student") {
    let exams =
      await run(`SELECT COURSE_ID, SESSION_NAME , TO_CHAR(EXAM_DATE,'DD/MM/YYY') EXAMDATE FROM Exam WHERE COURSE_ID IN 
    (SELECT COURSE_ID FROM ENROLLS WHERE STUDENT_ID LIKE '${id}' AND SESSION_NAME LIKE  '${sessionName}' AND STATUS LIKE 'Current')`);
    res.render("Exam_Schedule_View/examScheduleViewTable", { exams });
  }
});

/*---------end of Student Dashboard get method----------*/

/*---------start of Admin Dashboard get method--------*/
//admin views All student div where Course-wise ,term-wise view is present
app.get("/adminProfile", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  console.log("connection complete");
  console.log(id);

  const data = await run(`SELECT * FROM Admin WHERE ID LIKE '${id}'`);
  res.render("Admin_Dashboard/adminProfile", { student_data: data.rows[0] });
});

app.get("/admin/viewAllStudents", async (req, res) => {
  console.log(id);
  const noOfData = await run(`SELECT count(*) count FROM student`);
  const depts = await run(
    "SELECT Department FROM STUDENT  GROUP BY DEPARTMENT"
  );
  const level_terms = await run(
    "SELECT LEVEL_TERM  FROM Courses GROUP BY LEVEL_TERM ORDER BY LEVEL_TERM asc"
  );
  //console.log(depts);
  res.render("ViewAllStudents/AllStudentsCategory", {
    noOfData,
    depts,
    level_terms,
  });
});
//admin views All teacher div where Course-wise ,term-wise view is present
app.get("/admin/viewAllTeachers", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const noOfData = await run(`SELECT count(*) count FROM TEACHER`);
  const depts = await run(
    "SELECT Department FROM TEACHER  GROUP BY DEPARTMENT"
  );
  const designation = await run(
    "SELECT DESIGNATION  FROM TEACHER  GROUP BY DESIGNATION "
  );
  console.log(depts);
  res.render("ViewAllTeachers/CriteriaWise", { noOfData, depts, designation });
});
//admin views All Courses div containing term wise , dept wise course dropdowns
app.get("/admin/viewAllCourses", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const noOfData = await run(`SELECT count(*) count FROM COURSES`);
  const depts = await run(
    "SELECT Department,count(*) COUNT FROM COURSES  GROUP BY DEPARTMENT"
  );
  const level_term = await run(
    "SELECT LEVEL_TERM ,count(*) COUNT FROM COURSES GROUP BY LEVEL_TERM ORDER BY LEVEL_TERM ASC"
  );
  console.log(depts);
  res.render("ViewAllCourses/CriteriaWiseCourses", {
    noOfData,
    depts,
    level_term,
  });
});
//admin Complaints Table
app.get("/admin/ViewComplaints", async (req, res) => {
  console.log("Inside ViewComplaints");
  let complaintsTable = await run("SELECT * FROM REQEUSTSORCOMPLAINTS");
  console.log(complaintsTable);
  res.render("Admin_Dashboard/AdminViewComplaints/adminComplaintsTable", {
    complaintsTable,
  });
});

app.get("/resolveComplaints/:messageID", async (req, res) => {
  let messageID = req.params.messageID;
  console.log(messageID);
  await run(
    `DELETE  FROM REQEUSTSORCOMPLAINTS  WHERE MESSAGE_ID LIKE '${messageID}'`
  );
  res.send("Done");
});
app.get("/admin/Logs", async (req, res) => {
  console.log("Inside logs");
  let logTable = await run("SELECT * FROM LOGS");
  res.render("Admin_Dashboard/AdminViewComplaints/logs", { logTable });
});
app.get("/admin/CurrentSessionButton", async (req, res) => {
  res.render("Admin_Dashboard/currentSession");
});

//View All student Button,term-wise,dept wise in a table
app.get("/AllStudents/:str", async (req, res) => {
  let str = req.params.str;
  let strActual = str.substring(0, str.length - 1);
  console.log(str);
  console.log(strActual);
  if (str === "viewAll") {
    const data = await run(`SELECT * from  STUDENT`);
    console.log("data fetched inside Allstudents");
    res.render("ViewAllStudents/allStudents", { data });
  } else if (str === "addStudent") {
    res.render("ViewAllStudents/studentForm");
  } else if (str === "addTeacher") {
    res.render("ViewAllTeachers/teacherForm");
  } else if (str === "addCourse") {
    res.render("ViewAllCourses/courseForm");
  } else if (str[str.length - 1] === "D") {
    const data = await run(
      `SELECT *FROM STUDENT S WHERE DEPARTMENT Like '${strActual}'`
    );
    console.log("data fetched inside Depts");
    res.render("ViewAllStudents/allStudents", { data });
  } else if (str[str.length - 1] === "L") {
    const data = await run(
      `SELECT *FROM STUDENT S WHERE LEVEL_TERM Like '${strActual}'`
    );
    console.log("data fetched inside Depts");
    res.render("ViewAllStudents/allStudents", { data });
  } else if (str[str.length - 1] === "I") {
    const data = await run(
      `SELECT *FROM STUDENT  WHERE STUDENT_ID Like '${strActual}'`
    );
    console.log("data fetched inside Depts");
    res.render("ViewAllStudents/allStudents", { data });
  }
});
//admin views all students course and session wise in a table
app.get("/courseWiseAllStudents/:course_ID/:session", async (req, res) => {
  let course_ID = req.params.course_ID;
  let session = req.params.session;
  console.log(session);
  const data = await run(`SELECT *
    FROM Student s
    JOIN Enrolls e ON s.Student_ID = e.Student_ID
    WHERE e.Course_ID = '${course_ID}' AND session_name = '${session}'`);
  res.render("ViewAllStudents/allStudents", { data });
});

//Add student from the add student form
app.post("/adminNewStd", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  console.log(id);
  const dataReceived = req.body;
  console.log(dataReceived);
  console.log(dataReceived.STUDENT_ID);
  let hashedPW = await bcrypt.hash(dataReceived.PASSWORD, 2);

  await run(
    `DECLARE
     BEGIN
     public_package.logged_in_id := '${id}';
     insert into STUDENT (Student_ID, First_Name, Last_Name, Level_Term, Department, Email, Phone_No, 
      Nid_No, Address, Credits_Completed, Section_name, Advisor_ID, Password, img_url) 
      values ('${dataReceived.STUDENT_ID}', '${dataReceived.FIRST_NAME}', '${dataReceived.LAST_NAME}', 
      '${dataReceived.LEVEL_TERM}', '${dataReceived.DEPARTMENT}', '${dataReceived.EMAIL}', 
      '${dataReceived.PHONE_NO}', '${dataReceived.NID_NO}', '${dataReceived.ADDRESS}', ${dataReceived.CREDITS_COMPLETED},
      '${dataReceived.SECTION_NAME}', '${dataReceived.ADVISOR_ID}', '${hashedPW}', 'https://placehold.jp/100x100.png');
     END;
    `
  );

  res.redirect(`/user/${id}`); // relevant redirect here
});
app.post("/adminNewTeacher", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const dataReceived = req.body;
  console.log(dataReceived);
  console.log(dataReceived.TEACHER_ID);
  let hashedPW = await bcrypt.hash(dataReceived.PASSWORD, 2);

  await run(
    `DECLARE
     BEGIN
     public_package.logged_in_id := '${id}';
     INSERT INTO TEACHER
    (TEACHER_ID, FIRST_NAME, LAST_NAME, DEPARTMENT, SALARY, NID_NO, ADDRESS, EMAIL, PHONE_NO, PASSWORD, DESIGNATION)
    VALUES('${dataReceived.TEACHER_ID}', '${dataReceived.FIRST_NAME}', '${dataReceived.LAST_NAME}', '${dataReceived.DEPARTMENT}', ${dataReceived.SALARY}, 
    '${dataReceived.NID_NO}', '${dataReceived.ADDRESS}', '${dataReceived.EMAIL}', '${dataReceived.PHONE_NO}', '${hashedPW}', '${dataReceived.DESIGNATION}');
     END;
    `
  );
  console.log("inserted");
  //res.redirect("/"); //write relevant redirect here
  //alert("Teacher Inserted into Database");
  //res.send("received thanks");
});

app.post("/adminNewCourse", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const dataReceived = req.body;
  console.log(dataReceived);

  await run(
    `DECLARE
      sessName varchar2(30);
      BEGIN
        public_package.logged_in_id := '${id}';
        insert into Courses (Course_ID, Course_Title, Department, Credit_Hours, Level_Term, Department_Offered, Prerequisites) 
        values (
          '${dataReceived.COURSE_ID}',
          '${dataReceived.COURSE_TITLE}',
          '${dataReceived.DEPARTMENT}',
          ${dataReceived.CREDIT_HOURS},
          '${dataReceived.LEVEL_TERM}',
          '${dataReceived.DEPARTMENT_OFFERED}',
          '${dataReceived.PREREQUISITES}'
        );

        IF '${currentSession}' LIKE 'Jul%' and '${dataReceived.LEVEL_TERM}' like '%-2' then
        sessName := '${currentSession}';
        elsif '${currentSession}' LIKE 'Jan%' and '${dataReceived.LEVEL_TERM}' like '%-1' then
        sessName := '${currentSession}';
        else
        nameNextSession('${currentSession}' , sessName);
        end if;

        INSERT INTO SESSIONS
        (SESSION_NAME, COURSE_ID)
        VALUES(sessName, '${dataReceived.COURSE_ID}');
        
      END;
    `
  );
  console.log("inserted");
  const alertMessage =
    "Course added successfully! Click OK to go back to the previous page!";

  res.send(`
  <div style="
    background-color: rgb(237, 207, 169);
    color: black;
    padding: 20px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    animation: slide-down 0.5s ease-out;
  ">
    <h2>Success!</h2>
    <p>${alertMessage}</p>
    <button style="
      background-color: #fff;
      color: #007bff;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
    " onclick="goBack()">OK</button>
  </div>
  
  <script>
    function goBack() {
      window.history.back();
    }
  </script>
  
  <style>
    @keyframes slide-down {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(0);
      }
    }
  </style>
`);
});

app.get("/Delete/:str/:ID", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  let str = req.params.str;
  let idToDelete = req.params.ID;
  if (str === "Student") {
    console.log("Inside server student Delete!");
    await run(`
    DECLARE
    BEGIN
    public_package.logged_in_id := '${id}';
    DELETE FROM Student
    WHERE Student_ID like '${idToDelete}';
    END;`);
    console.log("Delete successful!");
  }
  if (str === "Teacher") {
    console.log("Inside server teacher Delete!");
    console.log(idToDelete);
    res.send("Success");
    await run(`
    
    DECLARE
    BEGIN
    public_package.logged_in_id := '${id}';
    DELETE FROM TEACHER
    WHERE TEACHER_ID like '${idToDelete}';
    END;
    `);
    console.log("Delete successful!");
  }
  if (str === "Course") {
    console.log("Inside server Course Delete!");
    console.log(idToDelete);
    res.send("Success");
    await run(`
    DECLARE
    BEGIN
    public_package.logged_in_id := '${id}';
    DELETE FROM COURSES
    WHERE COURSE_ID like '${idToDelete}';
    END;
    `);
    console.log("Delete successful!");
  }
});
//View All teacher course-wise,dept wise in a table
app.get("/AllTeachers/:str", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  let str = req.params.str;
  let strActual = str.substring(0, str.length - 1);
  console.log(str);
  console.log(strActual);
  if (str === "viewAll") {
    const data = await run(`SELECT * from  TEACHER`);
    console.log("data fetched inside AllTeachers");
    res.render("ViewAllTeachers/allTeachers", { data });
  } else if (str[str.length - 1] === "D") {
    const data = await run(
      `SELECT *FROM TEACHER WHERE DEPARTMENT Like '${strActual}'`
    );
    console.log("data fetched inside teacher wise dept");
    res.render("ViewAllTeachers/allTeachers", { data });
  } else if (str[str.length - 1] === "d") {
    const data = await run(
      `SELECT *FROM TEACHER WHERE DESIGNATION Like '${strActual}'`
    );
    console.log("data fetched inside teacher wise desg");
    res.render("ViewAllTeachers/allTeachers", { data });
  } else if (str[str.length - 1] === "I") {
    const data = await run(
      `SELECT *FROM TEACHER WHERE TEACHER_ID Like '${strActual}'`
    );
    console.log("data fetched inside teacher wise desg");
    res.render("ViewAllTeachers/allTeachers", { data });
  }
});
//View All Course,term wise,dept wise in a table
app.get("/AllCourses/:str", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  let str = req.params.str;
  let strActual = str.substring(0, str.length - 1);
  console.log(str);
  console.log(strActual);
  if (str === "viewAll") {
    const data = await run(`SELECT * from  COURSES`);
    console.log("data fetched inside AllTeachers");
    res.render("ViewAllCourses/allCourses", { data });
  } else if (str[str.length - 1] === "D") {
    const data = await run(
      `SELECT *FROM COURSES WHERE DEPARTMENT Like '${strActual}'`
    );
    console.log("data fetched inside courses wise dept");
    res.render("ViewAllCourses/allCourses", { data });
  } else if (str[str.length - 1] === "L") {
    const data = await run(
      `SELECT * FROM COURSES WHERE LEVEL_TERM Like '${strActual}'`
    );
    console.log("data fetched inside courses wise Level term");
    res.render("ViewAllCourses/allCourses", { data });
  } else if (str[str.length - 1] === "I") {
    const data = await run(
      `SELECT * FROM COURSES WHERE COURSE_ID Like '${strActual}'`
    );
    console.log("data fetched inside courses wise Level term");
    res.render("ViewAllCourses/allCourses", { data });
  }
});

app.get("/Admin/ExamSchedule", async (req, res) => {
  let departments = await run(
    `SELECT DISTINCT DEPARTMENT_OFFERED  FROM COURSES`
  );
  let LEVEL_TERMS = await run(`SELECT DISTINCT LEVEL_TERM FROM COURSES`);
  res.render("Admin_Dashboard/ExamSchedule/categoryOfExam", {
    departments,
    LEVEL_TERMS,
  });
});

app.get(
  "/Admin/ExamSchedule/:departmentOffered/:level_term",
  async (req, res) => {
    let departmentOffered = req.params.departmentOffered;
    let level_term = req.params.level_term;
    console.log(departmentOffered);
    console.log(level_term);
    console.log(sessionName);
    let exams =
      await run(`SELECT C.Course_ID,S.SESSION_NAME , C.DEPARTMENT_OFFERED 
                        FROM Courses C
                        INNER JOIN Sessions S ON C.Course_ID = S.Course_ID
                        WHERE S.Session_Name LIKE '${sessionName}' AND C.LEVEL_TERM LIKE '${level_term}' AND C.DEPARTMENT_OFFERED LIKE '${departmentOffered}'
                        AND C.COURSE_ID NOT IN(SELECT COURSE_ID FROM EXAM)`);
    console.log(exams.rows);
    res.render("Admin_Dashboard/ExamSchedule/examScheduleTable", { exams });
  }
);

app.get("/Admin/SetExam/:courseID/:date", async (req, res) => {
  let courseID = req.params.courseID;
  let date = req.params.date;
  console.log(courseID + " " + date);
  await run(
    `INSERT INTO Exam(Course_ID, Session_Name, Exam_Date)
     VALUES ('${courseID}', '${sessionName}', TO_DATE('${date}', 'YYYY-MM-DD'))`
  );
  console.log("Exam Schedule Inserted Successfully");
});

app.get("/admin/NextSession", async (req, res) => {
  id = req.session.idN;
  console.log("Inside server Admin Next Session get method");
  await run(`
DEFINE
BEGIN
SessionGPA;
nextSession;
INSERT INTO LOGS
(LOG_ID, ACTION_TYPE, ACTION_ON, ACTED_BY, ACTION_TIME)
VALUES('log_' || LOG_ID.nextval , 'SessionChange', 'All' ,${id}, SYSDATE); 
END
`);
  let sessionTable = await run(`SELECT SESSION_NAME FROM CURRENT_SESSION`);
  currentSession = sessionTable.rows[0].SESSION_NAME;
  console.log(currentSession);
  res.send("Done!");
});

app.get("/admin/Rollback", async (req, res) => {
  console.log("Inside server Admin RollBack get method");
  if (currentSession === "July 2023") {
    console.log("Rollback denied");
  } else {
  }
  res.send("Done!");
});

/*       ADDED       */
app.get("/adminApproveRequests", async (req, res) => {
  console.log("Inside admin pending req button click");
  let approvePendingEnrollment = await run(
    `SELECT * FROM TEACHES WHERE STATUS LIKE 'Pending'`
  );
  let approvePendingDrop = await run(
    `SELECT * FROM TEACHES WHERE STATUS LIKE 'Pending Delete'`
  );
  res.render("Admin_Dashboard/adminApprovePendingRequests", {
    approvePendingEnrollment,
    approvePendingDrop,
  });
});
/*           ADDED      */
app.get(
  "/AdminPendingRequests/:action/:teacherID/:course_ID",
  async (req, res) => {
    id = req.session.idN; //session dependent global variable
    const teacher_ID = req.params.teacherID;
    let action = req.params.action;
    let course_ID = req.params.course_ID;
    if (action === "ApproveEnroll") {
      console.log(action);
      await run(`UPDATE TEACHES
  SET Status = 'Current'
  WHERE TEACHER_ID LIKE '${teacher_ID}' AND COURSE_ID LIKE  '${course_ID}' AND Status LIKE 'Pending'`);
    }
    if (action === "ApproveDrop") {
      console.log(action);
      await run(`DELETE FROM TEACHES
WHERE TEACHER_ID LIKE '${teacher_ID}' AND COURSE_ID LIKE  '${course_ID}'  AND Status LIKE 'Pending Delete'`);
    }
    if (action === "DeleteEnroll") {
      console.log(action);
      await run(`DELETE FROM TEACHES
  WHERE TEACHER_ID LIKE '${teacher_ID}' AND COURSE_ID LIKE  '${course_ID}' AND Status LIKE 'Pending'`);
    }
    if (action === "DeleteDrop") {
      console.log(action);
      await run(`UPDATE TEACHES
SET Status = 'Current'
WHERE TEACHER_ID LIKE '${teacher_ID}' AND COURSE_ID LIKE  '${course_ID}'  AND Status LIKE 'Pending Delete'`);
    }
    res.send("Done");
  }
);

/* ADDED FOR ADMIN'S ADD NOTICE */

app.get("/admin/Notice", async (req, res) => {
  res.render("Admin_Dashboard/AddNotice/noticeForm");
});

app.get("/adminAddNotice/:noticeMsg", async (req, res) => {
  let noticeMsg = req.params.noticeMsg;
  console.log(noticeMsg);
  const response = await run(`INSERT INTO NOTICES
  (NOTICEID, CREATEDATE, NOTICEMSG)
  VALUES(NOTICE_ID.NEXTVAL, SYSDATE , '${noticeMsg}')`);

  res.send(response);
});

/*---------End of Admin Dashboard get method-----------*/

/*--------Start of Teacher Dashboard get method--------*/

/*teacherCode*/

//post for edit info
app.post("/Teachersaveinfo", async (req, res) => {
  // Retrieve the form data from req.body
  console.log("Inside teacher saveInfo post method");

  id = req.session.idN; //session dependent global variable
  console.log(req.body);

  const firstName = req.body.first_name;
  console.log(firstName);

  await run(`DECLARE
  BEGIN
    public_package.logged_in_id := '${id}';
    
    UPDATE TEACHER
    SET FIRST_NAME='${req.body.first_name}', LAST_NAME='${req.body.last_name}', EMAIL='${req.body.email}', PHONE_NO='${req.body.phone_no}', ADDRESS='${req.body.address}'
    WHERE TEACHER_ID='${id}';
    
  END;
`);

  const alertMessage = "TEACHER information updated successfully!"; // Change the message as needed

  res.send(
    `<script>window.alert("${alertMessage}"); window.history.back();</script>`
  );
});
//get Methods code here
app.get("/Teacher/:str", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  let str = req.params.str;
  console.log(str);

  if (str === "FullInfo") {
    console.log(id);
    const data = await run(
      `SELECT * FROM TEACHER WHERE Teacher_ID LIKE '${id}'`
    );
    res.render("Teacher_Dashboard/TeacherInfo/teacherFullInfo", {
      teacher_data: data.rows[0],
    });
  }
  if (str === "editInfo") {
    console.log(id + " Inside teacher edit info");

    const data = await run(
      `SELECT * FROM TEACHER WHERE TEACHER_ID LIKE '${id}'`
    );
    res.render("Teacher_Dashboard/TeacherInfo/editInfo", {
      teacher_data: data.rows[0],
    });
  }
  if (str === "Profile") {
    console.log(id);
    const data = await run(
      `SELECT * FROM TEACHER WHERE Teacher_ID LIKE '${id}'`
    );
    res.render("Teacher_Dashboard/TeacherInfo/Profile", {
      teacher_data: data.rows[0],
    });
  }
  if (str === "Courses") {
    console.log(id);
    const level_terms = await run(`SELECT C.Level_Term
      FROM Teaches TC
      JOIN Courses C ON TC.Course_ID = C.Course_ID
      WHERE TC.Teacher_ID LIKE '${id}' AND TC.Status LIKE 'Current'
      GROUP BY C.Level_Term`);
    const sessions = await run(`SELECT DISTINCT Session_Name
    FROM Teaches
    WHERE Teacher_ID = '${id}' AND Status LIKE 'Current'`);
    res.render("Teacher_Dashboard/TakenCourses/takenCoursesCategory", {
      level_terms,
      sessions,
    });
  }
  if (str === "Students") {
    console.log("teacher clicked student");
    console.log(id);
    const courses = await run(`SELECT DISTINCT COURSE_ID 
    FROM Teaches 
    WHERE teacher_ID LIKE '${id}' AND Status LIKE 'Current'`);
    const sessions = await run(`SELECT DISTINCT Session_Name
    FROM Teaches
    WHERE Teacher_ID = '${id}' AND Status LIKE 'Current'`);
    const students = await run(
      `SELECT * FROM STUDENT  WHERE ADVISOR_ID LIKE '${id}'`
    );
    console.log(students.rows.length);
    let isDisable = true;
    if (students.rows.length > 0) {
      isDisable = false;
    }
    res.render("Teacher_Dashboard/ViewStudents/StudentsCategory", {
      courses,
      sessions,
      isDisable,
    });
  }
  if (str === "AddOrDrop") {
    id = req.session.idN; //session dependent global variable
    console.log(sessionName);
    let dept = await run(
      `SELECT department FROM  TEACHER   WHERE TEACHER_ID LIKE '${id}'`
    );
    dept = dept.rows[0].DEPARTMENT;
    console.log(dept);
    let addCourses =
      await run(`SELECT C.Course_Title, C.Course_ID, C.Level_Term,S.SESSION_NAME ,C.CREDIT_HOURS
                              FROM Courses C
                              INNER JOIN Sessions S ON C.Course_ID = S.Course_ID
                              WHERE C.Department Like '${dept}' AND S.Session_Name like '${sessionName}'
                              MINUS
                              (SELECT C.Course_Title,C.Course_ID,  C.Level_Term, T.Session_Name,C.CREDIT_HOURS
                                FROM Teaches T
                                INNER JOIN Courses C ON T.Course_ID = C.Course_ID
                                WHERE T.Teacher_ID LIKE '${id}' AND T.Session_Name like '${sessionName}' AND (T.Status LIKE 'Current' OR T.Status LIKE 'Pending' OR T.Status LIKE 'Pending Delete'))`);

    let dropCourses =
      await run(`SELECT C.Course_ID, C.Course_Title, C.Level_Term, T.Session_Name,C.CREDIT_HOURS
    FROM Teaches T
    INNER JOIN Courses C ON T.Course_ID = C.Course_ID
    WHERE T.Teacher_ID LIKE '${id}' AND T.Session_Name like '${sessionName}' AND (T.Status LIKE 'Current' OR T.Status LIKE 'Pending')`);

    res.render("Teacher_Dashboard/TeacherAddOrDropCourses/addOrDropCourses", {
      addCourses,
      dropCourses,
      dept,
    });
  }
  if (str === "PendingRequest") {
    console.log("Inside pending req server " + id);
    const studentId = await run(
      `SELECT DISTINCT Student_ID FROM STUDENT s WHERE ADVISOR_ID LIKE '${id}'`
    );
    res.render("Teacher_Dashboard/EnrollMent_Request/enrollmentRequest", {
      studentId,
    });
  }
});

app.get("/TeacherViewCourses/:str", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const str = req.params.str;
  let strActual = str.substring(0, str.length - 1);
  console.log(strActual);
  if (str === "viewAll") {
    const courses =
      await run(`SELECT C.Course_Title, C.Course_ID, C.Level_Term, 
    C.Credit_Hours, C.Department, C.Department_Offered, T.Session_Name
    FROM Courses C
    JOIN Teaches T ON C.Course_ID = T.Course_ID
    WHERE T.Teacher_ID LIKE '${id}' AND T.Status LIKE 'Current'
    `);
    res.render("Teacher_Dashboard/TakenCourses/TeacherAllCourses", { courses });
  } else if (str[str.length - 1] === "S") {
    const courses =
      await run(`SELECT C.Course_Title, C.Course_ID, C.Level_Term, C.Credit_Hours,
    C.Department, C.Department_Offered, T.Session_Name
    FROM Courses C
    JOIN Teaches T ON C.Course_ID = T.Course_ID
    WHERE T.Teacher_ID LIKE '${id}' AND T.Session_Name LIKE '${strActual}' and T.Status LIKE 'Current'`);
    //console.log("data fetched inside Session wise");
    res.render("Teacher_Dashboard/TakenCourses/TeacherAllCourses", { courses });
  } else if (str[str.length - 1] === "L") {
    const courses =
      await run(`SELECT C.Course_Title, C.Course_ID, C.Level_Term, C.Credit_Hours,
    C.Department, C.Department_Offered, T.Session_Name
    FROM Courses C
    JOIN Teaches T ON C.Course_ID = T.Course_ID
    WHERE T.Teacher_ID LIKE '${id}' AND C.LEVEL_TERM LIKE '${strActual}' and T.Status LIKE 'Current'`);
    res.render("Teacher_Dashboard/TakenCourses/TeacherAllCourses", { courses });
  }
});
//Teacher's student view options : course wise,id wise,all
app.get("/TeacherViewStudents/:str", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const str = req.params.str;
  if (str === "viewAll") {
    const students =
      await run(`SELECT DISTINCT S.Student_ID, S.First_Name, S.Last_Name, S.Level_Term, 
    S.Department, S.Email, S.Phone_No, S.Address, S.Section_name, S.Advisor_ID
    FROM Teaches T
    INNER JOIN Enrolls E ON T.Course_ID = E.Course_ID AND T.Session_Name = E.Session_Name
    INNER JOIN Student S ON E.Student_ID = S.Student_ID
    WHERE T.Teacher_ID LIKE '${id}' AND T.Status LIKE 'Current'`);
    res.render("Teacher_Dashboard/ViewStudents/studentsTable", { students });
  }
  if (str === "advised") {
    const students = await run(
      `SELECT * FROM STUDENT  WHERE ADVISOR_ID LIKE '${id}'`
    );
    console.log(students.rows.length);
    res.render("Teacher_Dashboard/ViewStudents/studentsTable", { students });
  }
});

app.get("/TeacherViewStudents/CourseWise/:courseID", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const courseID = req.params.courseID;
  console.log(courseID);
  console.log(sessionName);
  let students =
    await run(`SELECT S.Student_ID, S.First_Name, S.Last_Name, S.Level_Term, S.Department, S.Email, S.Phone_No, S.Address, S.Section_name, S.Advisor_ID
  FROM Teaches T
  INNER JOIN Enrolls E ON T.Course_ID = E.Course_ID AND T.Session_Name = E.Session_Name
  INNER JOIN Student S ON E.Student_ID = S.Student_ID
  WHERE T.Teacher_ID LIKE '${id}' 
    AND T.Course_ID LIKE '${courseID}' 
    AND T.Session_Name LIKE '${sessionName}' 
    AND T.Status LIKE 'Current'`);
  res.render("Teacher_Dashboard/ViewStudents/studentsTable", { students });
});

app.get("/TeacherADD_DropCourse/:str/:courseID", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const courseID = req.params.courseID;
  const str = req.params.str;
  console.log(courseID);
  if (str === "ADD") {
    //insert code
    console.log("Inside Add");
    await run(`INSERT INTO TEACHES
      (TEACHER_ID, COURSE_ID, SESSION_NAME, Status)
      VALUES('${id}', '${courseID}', '${sessionName}', 'Pending')`);
  }
  if (str === "DROP") {
    console.log("Inside DROP");
    console.log(courseID);
    let TeachesStatus = await run(
      `SELECT * FROM TEACHES  WHERE TEACHER_ID LIKE '${id}' AND COURSE_ID LIKE '${courseID}' AND SESSION_NAME LIKE '${sessionName}'`
    );
    console.log(TeachesStatus.rows[0].STATUS);

    if (TeachesStatus.rows[0].STATUS === "Current") {
      await run(
        `UPDATE TEACHES SET STATUS = 'Pending Delete'   WHERE TEACHER_ID LIKE '${id}' AND COURSE_ID LIKE '${courseID}' AND SESSION_NAME LIKE '${sessionName}'`
      );
    } else {
      await run(
        `DELETE  FROM TEACHES  WHERE TEACHER_ID LIKE '${id}' AND COURSE_ID LIKE '${courseID}' AND SESSION_NAME LIKE '${sessionName}'`
      );
    }
  }
});

app.get("/TeacherPendingRequests/:action/:studentID", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  const studentID = req.params.studentID;
  let action = req.params.action;
  console.log(action);
  console.log(studentID);
  if (action === "RequestTable") {
    if (studentID === "viewAll") {
      let approvePendingEnrollment =
        await run(`Select STUDENT_ID , COURSE_ID ,STATUS 
                from enrolls 
                where STUDENT_ID  in (select STUDENT_ID  from student where advisor_id LIKE '${id}' )
                and status LIKE 'Pending'`);
      let approvePendingDrop = await run(`Select STUDENT_ID , COURSE_ID ,STATUS 
                from enrolls 
                where STUDENT_ID  in (select STUDENT_ID  from student where advisor_id LIKE '${id}' )
                and status LIKE 'Pending Delete'`);
      res.render("Teacher_Dashboard/EnrollMent_Request/requestTable", {
        approvePendingEnrollment,
        approvePendingDrop,
      });
    } else {
      let approvePendingEnrollment =
        await run(`SELECT STUDENT_ID, COURSE_ID, STATUS from ENROLLS
      where STATUS LIKE 'Pending' and student_id LIKE '${studentID}'`);
      let approvePendingDrop =
        await run(`SELECT STUDENT_ID, COURSE_ID, STATUS from ENROLLS
      where STATUS LIKE 'Pending Delete' and student_id LIKE '${studentID}'`);
      res.render("Teacher_Dashboard/EnrollMent_Request/requestTable", {
        approvePendingEnrollment,
        approvePendingDrop,
      });
    }
  }
});

app.get(
  "/TeacherPendingRequests/:action/:studentID/:course_ID",
  async (req, res) => {
    id = req.session.idN; //session dependent global variable
    const studentID = req.params.studentID;
    let action = req.params.action;
    let course_ID = req.params.course_ID;
    if (action === "ApproveEnroll") {
      console.log(action);
      await run(`UPDATE Enrolls
      SET Status = 'Current'
      WHERE Student_ID LIKE '${studentID}' AND COURSE_ID LIKE  '${course_ID}' AND Status LIKE 'Pending'`);
    }
    if (action === "ApproveDrop") {
      console.log(action);
      console.log(studentID);
      await run(`DELETE FROM Enrolls
    WHERE Student_ID LIKE '${studentID}' AND COURSE_ID LIKE  '${course_ID}'  AND Status LIKE 'Pending Delete'`);
    }
    if (action === "DeleteEnroll") {
      console.log(action);
      await run(`DELETE FROM Enrolls
      WHERE Student_ID LIKE '${studentID}' AND COURSE_ID LIKE  '${course_ID}' AND Status LIKE 'Pending'`);
    }
    if (action === "DeleteDrop") {
      console.log(action);
      await run(`UPDATE Enrolls
    SET Status = 'Current'
    WHERE Student_ID LIKE '${studentID}' AND COURSE_ID LIKE  '${course_ID}'  AND Status LIKE 'Pending Delete'`);
    }
    res.send("Done");
  }
);

/*      Added       */

function calculateGradePoint(score, maxScore) {
  if (score < 0 || score > maxScore) {
    return 0;
  }
  const percentage = (score / maxScore) * 100;
  let gradePoint;
  if (percentage >= 80) {
    gradePoint = 4.0;
  } else if (percentage >= 75) {
    gradePoint = 3.75;
  } else if (percentage >= 70) {
    gradePoint = 3.5;
  } else if (percentage >= 65) {
    gradePoint = 3.25;
  } else if (percentage >= 60) {
    gradePoint = 3.0;
  } else if (percentage >= 55) {
    gradePoint = 2.75;
  } else if (percentage >= 50) {
    gradePoint = 2.5;
  } else if (percentage >= 45) {
    gradePoint = 2.25;
  } else if (percentage >= 40) {
    gradePoint = 2.0;
  } else {
    gradePoint = 0.0;
  }
  return gradePoint;
}
app.post("/insertResult", async (req, res) => {
  const dataReceived = req.body;
  console.log(dataReceived);
  console.log(dataReceived["STUDENT_ID"]);
  console.log(dataReceived["CT-1"]);

  let arr = [];
  arr[0] = Number(dataReceived["CT-1"]);
  arr[1] = Number(dataReceived["CT-2"]);
  arr[2] = Number(dataReceived["CT-3"]);
  arr[3] = Number(dataReceived["CT-4"]);
  arr[4] = Number(dataReceived["CT-5"]);

  let arr2 = arr.slice();

  arr.sort();
  arr.reverse();
  let total = 0;

  let creditData = await run(
    `SELECT CREDIT_HOURS FROM COURSES WHERE COURSE_ID LIKE '${dataReceived["COURSE_ID"]}'`
  );
  let cred = creditData.rows[0].CREDIT_HOURS;

  console.log(cred);

  for (let i = 0; i < Math.ceil(cred); i++) {
    total = total + arr[i];
  }

  total =
    total +
    Number(dataReceived["Attendance"]) +
    Number(dataReceived["Term Final"]);
  let grade = 0;
  grade = calculateGradePoint(total, cred * 100);

  console.log(total);
  console.log(grade);

  await run(
    `INSERT INTO RESULTS
    (STUDENT_ID, COURSE_ID, ATTENDANCE, CT1, CT2, CT3, CT4, CT5, TERM_FINAL, TOTAL, GRADE)
    VALUES('${dataReceived["STUDENT_ID"]}', '${dataReceived["COURSE_ID"]}', ${
      arr2[0]
    },
     ${arr2[1]}, ${arr2[2]}, ${arr2[3]}, ${arr2[4]}, ${Number(
      dataReceived["Attendance"]
    )},
     ${Number(dataReceived["Term Final"])}, ${total}, ${grade})`
  );

  //res.send(200);
});
/*      Added       */
app.get("/teacherInsertResult/:action/:value", async (req, res) => {
  let action = req.params.action;
  let value = req.params.value;
  id = req.session.idN;
  console.log(id);
  if (action === "CourseSelection") {
    let courses = await run(`SELECT  C.Course_ID
    FROM Courses C
    JOIN Teaches T ON C.Course_ID = T.Course_ID
    WHERE T.Teacher_ID LIKE '${id}' AND T.Status LIKE 'Current'
    `);
    console.log(courses);
    res.render("Teacher_Dashboard/Result/courseSelection", { courses });
  }
  if (action === "StudentIdSelection") {
    console.log(value);
    let students = await run(`SELECT S.Student_ID
          FROM Teaches T
          INNER JOIN Enrolls E ON T.Course_ID = E.Course_ID AND T.Session_Name = E.Session_Name
          INNER JOIN Student S ON E.Student_ID = S.Student_ID
          WHERE T.Teacher_ID LIKE '${id}' 
          AND T.Course_ID LIKE '${value}' 
          AND T.Session_Name LIKE '${sessionName}' 
          AND T.Status LIKE 'Current'`);
    console.log(students);
    res.render("Teacher_Dashboard/Result/studentIDSelection", { students });
  }
});
/*      Added       */
app.get(
  "/teacherInsertResult/ResultForm/:studentID/:courseID",
  async (req, res) => {
    let studentID = req.params.studentID;
    let courseID = req.params.courseID;
    console.log(studentID + " " + courseID);
    res.render("Teacher_Dashboard/Result/resultForm", { studentID, courseID });
  }
);
app.get("/teacherViewResult", async (req, res) => {
  id = req.session.idN; //session dependent global variable
  console.log("Teacher views result " + id);
  const results = await run(`SELECT * FROM RESULTS r WHERE STUDENT_ID IN 
            (SELECT DISTINCT E.Student_ID
              FROM Teaches T
              INNER JOIN Enrolls E ON T.Course_ID = E.Course_ID AND T.Session_Name = E.Session_Name
              WHERE T.Teacher_ID LIKE '${id}' AND T.Status LIKE 'Current')
              AND COURSE_ID IN 
              (SELECT DISTINCT COURSE_ID 
              FROM TEACHES t
              WHERE T.Teacher_ID LIKE '${id}' AND T.Status LIKE 'Current'
            )`);
  res.render("Teacher_Dashboard/Result/teacherViewResultTable", { results });
});

/*----------End of Teacher Dashboard  get method----------*/

app.post("/changePassMethod", async (req, res) => {
  const dataReceived = req.body;
  console.log(dataReceived);
  id = req.session.idN;
  if (dataReceived.newPassword != dataReceived.confirmPassword) {
    const alertMessage = "Confirm Password does not match!"; // Change the message as needed

    res.send(
      `<script>window.alert("${alertMessage}"); window.history.back();</script>`
    );
  }
  
  else {
    let hashedPW = await bcrypt.hash(dataReceived.newPassword, 2);
    if (id[0] === 'S') {
      console.log(id + "Inside Student pass change");
      await run(`
      DECLARE
      BEGIN
      public_package.logged_in_id := '${id}';
      UPDATE STUDENT
      SET PASSWORD='${hashedPW}'
      WHERE STUDENT_ID='${id}';
      END;
     `);
    }
    if (id[0] === 'T') {
      console.log(id + "Inside Teacher pass change");
      await run(`
      DECLARE
      BEGIN
      public_package.logged_in_id := '${id}';
      UPDATE TEACHER
      SET PASSWORD='${hashedPW}'
      WHERE TEACHER_ID='${id}';
      END;
     `);
    }
    if (id[0] === 'A') {
      console.log(id + "Inside Admin pass change");
      await run(`
      DECLARE
      BEGIN
      public_package.logged_in_id := '${id}';
      UPDATE ADMIN
      SET PASSWORD='${hashedPW}'
      WHERE ID='${id}';
      END;
     `);
    }
    const alertMessage = "Password Changed ! Click Ok to go to previous page"; // Change the message as needed

    res.send(
      `<script>window.alert("${alertMessage}"); window.history.back();</script>`
    );
  }
});

//LoginPage
app.get("/", async (req, res) => {
  req.session.auth = false;
  req.session.idN = "0"; //initialize global variable in session
  console.log("Hello ,You are connected ! ");

  let sessionTable = await run(`SELECT SESSION_NAME FROM CURRENT_SESSION`);

  currentSession = sessionTable.rows[0].SESSION_NAME;

  console.log(currentSession);

  res.render("LoginPage/index");
});

