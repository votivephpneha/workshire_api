
const {
  registerModel,
  getUserModel,
  removeModel,
  getUserByIdModel,
  updateUserModel,
  loginModel,
} = require("../Models/userModel");

const registerController = async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  try {
    const { body } = req;
    const data = await registerModel({ body });
    res.send(data);
  } catch (err) {
    console.log("ERROR=>", err);
    res.send(err);
  }
};

const getUserController = async (req, res) => {
  const query = req?.query?.query;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (pageNumber - 1) * pageSize;
 
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, PATCH, OPTIONS"
    );
    const data = await getUserModel(query,pageSize,startIndex);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};

const removeUserController = async (req, res) => {
  const { id } = req?.params;
  try {
    const data = await removeModel(id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};

const getUserByIdController = async (req, res) => {
  const { id } = req?.params;
try{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  const data = await getUserByIdModel(id)
  res.send(data)
}
catch(err){
  res.send(err)
}
};

const updateUserContoller = async(req,res) =>{
  const  id  = req?.params?.id;
  const  body  = req?.body;
  try{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    const data = await updateUserModel(id,body)
    res.send(data)
  }
  catch(err){
    res.send(err)
  }
}
const loginController = async(req,res)=>{
  
  try {
    const body = req?.body;
    const data = await loginModel({ body });
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}



module.exports = {
  registerController,
  getUserController,
  removeUserController,
  getUserByIdController,
  updateUserContoller,
  loginController
};
