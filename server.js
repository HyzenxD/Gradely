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