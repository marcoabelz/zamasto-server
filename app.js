if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { generateToken } = require("./helpers/jwt");
const authentication = require("./middlewares/authentication");
const express = require("express");
const cors = require("cors");
const { projects, blogs, services } = require("./models");

const multer = require("multer");

const { v2: cloudinary } = require("cloudinary");

const app = express();
// const port = process.env.port || 3000;

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

//multer + cloudinary
app.post("/admin/projects", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and image file are required" });
    }
    let file = req.file;
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });

      uploadStream.end(file.buffer);
    });
    await projects.create({ name, image: result.url });
    res.status(200).json({ message: "Image uploaded and data saved", image: result.url });
  } catch (error) {
    console.log(error);
  }
});

app.get("/admin/projects", async (req, res) => {
  const data = await projects.findAll();
  res.status(200).json(data);
});

app.put("/admin/projects/:id", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and image file are required" });
    }
    let file = req.file;
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });

      uploadStream.end(file.buffer);
    });
    await projects.update({ name, image: result.url }, { where: { id: req.params.id } });
    res.status(200).json({ message: "Image uploaded and data saved", image: result.url });
  } catch (error) {
    console.log(error);
  }
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

app.post("/admin/blogs", upload.single("cover_image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || !req.file) {
      return res.status(400).json({ message: "title, content and image file are required" });
    }
    let file = req.file;
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
      uploadStream.end(file.buffer);
    });
    await blogs.create({ title, content, cover_image: result.url });
    res.status(201).json({ message: "Image uploaded and data saved", cover_image: result.url });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/admin/blogs/:id", async (req, res) => {
  await blogs.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "Blog Deleted" });
});

module.exports = app;
