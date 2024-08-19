if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { generateToken } = require("./helpers/jwt");
const authentication = require("./middlewares/authentication");

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

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    res.status(200).json({ access_token: generateToken({ username: username }) });
  } else {
    res.status(401).json({ message: "Login Failed" });
  }
});

app.use(authentication);

app.post("/admin/projects", async (req, res) => {
  const { name, image } = req.body;
  const data = await projects.create({ name, image });
  res.status(201).json(data);
});

app.get("/admin/projects", async (req, res) => {
  const data = await projects.findAll();
  res.status(200).json(data);
});

app.delete("/admin/projects/:id", async (req, res) => {
  await projects.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "Project Deleted" });
});

app.get("/admin/projects/:id", async (req, res) => {
  const data = await projects.findByPk(req.params.id);
  res.status(200).json(data);
});

module.exports = app;
