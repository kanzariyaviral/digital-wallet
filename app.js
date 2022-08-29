const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { DB, PORT } = require("./config/config");
const port = PORT || 5000;
const Resource = require("./entity/resource.entity");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(DB)
.then(()=>{
  console.log("connected to database");
})

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",  
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELET,GET");
    return res.status(200).json({});
  }
  next();
});
app.get("/", (req, res) => {
  res.status(200).json({
    message: "hyyy",
  });
});
app.post("/resource/create", (req, res) => {
  Resource.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      return res.status(404).json({
        message: "email already exists",
      });
    }
    const resource = new Resource({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      insertedAt:new Date(),
      insertedBy:'kashyap patel',
      role:'user',
    });
    resource
      .save()
      .then((result) => {
        console.log(result);
        return res.status(200).json({
          success: true,
          message: "resource create successfully",
        });
      })
      .catch((e) => {
        return res.status(400).json({
          success: false,
          message: e,
        });
      });
  });
});

app.post("/resource/login", (req, res) => {
  Resource.findOne({ email: req.body.email })
    .then((resource) => {
      if (resource && resource.password === req.body.password) {
        return res.status(200).json({
          success:true,
          data: resource,
        });
      }
    })
    .catch((err) => {
      console.log({
        error: err,
      });
      return res.status(500).json({
        error: err,
      });
    });
});
app.get("/resource", (req, res) => {
  Resource.find()
    .then((resource) => {
      return res.status(200).json(resource);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

app.listen(port, () => {
  console.log(`servere use port no ${port}`);
});
