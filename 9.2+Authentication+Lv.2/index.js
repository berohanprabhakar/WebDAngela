import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
// this is the times of salting of hashing password more salt more secure
const saltRounds = 10;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "123456",
  port: 5432,
});
db.connect();

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

app.post("/register",async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  try{
      // checking user already exits
      const checkResult = await db.query("SELECT email FROM users WHERE email = $1", [email]);
      // query to save the data in db
      if(checkResult.rows.length == 0) {
        // password hashing
        bcrypt.hash(password, saltRounds, async (err, hash) =>{
          if(err){
            console.log("Error in Hashing");
          }
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
          [email, hash]
        );
        console.log(result);
        res.render("secrets.ejs");
        })
       
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

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      // comparing hash for password matching
      bcrypt.compare(password, storedPassword, (err, result) =>{
        if(err) {
          console.log("error comparing password" ,err);
        } else {
          console.log(result);
          if(result == true){
            res.render("secrets.ejs");
          }
          else{
            res.send("Incorrect Password");
          }
        }

      })
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
