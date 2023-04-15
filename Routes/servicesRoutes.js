const express = require("express");
const ServiceRoutes = express.Router();
const cors = require("cors");
const path = require('path')
const {
  postServicesController,
  getServicesController,
  getServiceControllerById,
  updateServiceController,
  removeServiceController,
} = require("../Controller/servicesController");
const multer = require("multer");

ServiceRoutes.use(cors());

const DestinationsFunction = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    // cb(null, "../ServiceImage");
    cb(null, path.join(__dirname, "../ServiceImage"));
  },
});
const fileFilter = (req, file, cb) => {
  // accept all files
  cb(null, true);
};

const upload = multer({
  storage: DestinationsFunction,
    limits: { fileSize: 1024 * 1024 * 50 },
    fileFilter: fileFilter,
});

ServiceRoutes.post("/insert-service", upload.single("image"),postServicesController);
ServiceRoutes.get("/get-service", getServicesController);
ServiceRoutes.get("/get-service/id/:id", getServiceControllerById);
ServiceRoutes.put("/update-service/:id",upload.single("image"), updateServiceController);
ServiceRoutes.delete("/remove-service/:id", removeServiceController);



module.exports = ServiceRoutes;
