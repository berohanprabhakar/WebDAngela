import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "rohan";
const yourPassword = "iloveprogram";
const yourAPIKey = "7b3b7270-2b99-4d08-ab00-6091a238539c";
const yourBearerToken = "c868c63f-096a-4b83-bbdb-3620e4ee3f3a";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async(req, res) => {
   try {
    const response = await axios.get(`https://secrets-api.appbrewery.com/random`);
    const result = JSON.stringify(response.data);
    res.render("index.ejs",{
    content : result
    });
   } catch (error) {
    res.status(404).send(error.message);
   }

});

app.get("/basicAuth", async (req, res) => {
 
  
    try {
      const response = await axios.get(API_URL + "/all?page=2", {
        auth:{
          username : yourUsername,
          password : yourPassword,
        },
       });
       res.render("index.ejs", {content : JSON.stringify(response.data)});
    } catch (error) {
      res.status(404).send(error.message);
    }

});

app.get("/apiKey", async (req, res) => {

  try {
    const result = await axios.get(API_URL + "/filter", {
      params: {
        score : 5,
        apiKey: yourAPIKey,
      }
    });
    res.render("index.ejs", {content: JSON.stringify(result.data)});
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/bearerToken", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/secrets/2", {
      headers : {
        Authorization : `Bearer ${yourBearerToken}`,
      } 
    });
    res.render("index.ejs", {content : JSON.stringify(result.data)});
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
