const express = require("express");
const {
  postController,
  getController,
  getByIdController,
  updateContoller,
} = require("../Controller/controller");
const routes1 = express.Router();
const multer = require("multer");
routes1.use(express.json());
const cors = require("cors");
routes1.use(cors());

const DestinationsFunction = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "../Uploads");
  },
});

const upload = multer({
  storage: DestinationsFunction,
});
routes1.post("/post-data", upload.single("image"), postController);
routes1.get("/get-data", getController);
routes1.get("/get-by-Id/:id", getByIdController);
routes1.put("/update-data/:id",upload.single("image"), updateContoller);

module.exports = routes1;
