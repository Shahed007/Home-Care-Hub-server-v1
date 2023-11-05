const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookiesParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookiesParser());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.77jbz4j.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const api = "/api/v1";

async function run() {
  try {
    const homeCareHubDB = client.db("homeCareHubDB");
    const servicesCollection = homeCareHubDB.collection("services");

    // get the services collection on the database
    app.get(`${api}/services`, async (req, res) => {
      try {
        const services = await servicesCollection.find().toArray();
        res.send(services);
      } catch (err) {
        console.log(err);
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("my Home Care Hub server is running");
});

app.listen(port, () => {
  console.log(`my server is running port ${port}`);
});
