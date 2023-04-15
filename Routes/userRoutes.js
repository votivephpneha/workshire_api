const express = require("express");
const {
  registerController,
  getUserController,
  removeUserController,
  getUserByIdController,
  updateUserContoller,
  loginController,
} = require("../Controller/userController");
const routes2 = express.Router();
const cors = require("cors");
routes2.use(cors());

routes2.post("/register", registerController);
routes2.post("/login", loginController);
routes2.get("/get-user", getUserController);
routes2.delete("/remove-user/:id", removeUserController);
routes2.get("/get-user/id/:id", getUserByIdController);
routes2.put("/update-user/:id", updateUserContoller);





module.exports = routes2;
