if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
// const port = process.env.port || 3000;
const cors = require("cors");

const { projects, blogs, services } = require("./models");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/projects", async (req, res) => {
  const data = await projects.findAll();
  res.status(200).json(data);
});

app.get("/blogs", async (req, res) => {
  const data = await blogs.findAll();
  res.status(200).json(data);
});

app.get("/blogs/:id", async (req, res) => {
  const data = await blogs.findByPk(req.params.id);
  res.status(200).json(data);
});

app.get("/services", async (req, res) => {
  const data = await services.findAll();
  res.status(200).json(data);
});

module.exports = app;
