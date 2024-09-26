import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user : "postgres",
  host: "localhost",
  database: "secrets",
  password : "Poonam@019",
  port : 5432,
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  try{
      // checking user already exits
      const checkResult = await db.query("SELECT email FROM users WHERE email = $1", [email]);
      // query to save the data in db
      if(checkResult.rows.length == 0) {
        const result = await db.query(
          "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      console.log(result);
      res.render("secrets.ejs");
      }
    else{
      res.send("Email Already Exist. Try logging in");
    }
  }
  catch (err)
  {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  console.log(checkResult.email);
  console.log(checkResult.password);
  if(email == checkResult.email && password == checkResult.password){
    res.render("secret.ejs");
  }
  else{
    res.send("Wrong username of password!");
  }
 
  

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
