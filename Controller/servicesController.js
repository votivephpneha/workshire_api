const {
  postServiceModel,
  getServicesModel,
  getServiceByIdModel,
  updateServiceModel,
  removeServiceModel,
} = require("../Models/servicesModel");

const postServicesController = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const body = req?.body;
  const profile = req?.file?.filename;
  try {
    const data = await postServiceModel({ body, profile });
    res.send(data);
  } catch (err) {
    console.log("ERROR=>",err);
    res.send(err);
  }
};

const getServicesController = async (req, res) => {
  const query = req?.query?.query;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (pageNumber - 1) * pageSize;
  try {
    const data = await getServicesModel(query, pageSize, startIndex);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};

const getServiceControllerById = async (req, res) => {
  const { id } = req?.params;
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, PATCH, OPTIONS"
    );
    const data = await getServiceByIdModel(id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};
const updateServiceController = async (req, res) => {
  const id = req?.params?.id;
  const {body} = req;
  const profile = req?.file?.filename; 
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Methods", "PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    const data = await updateServiceModel(id, {body, profile});
    res.send(data);
  } 
  catch (err) {
    res.send(err);
  }
};

const removeServiceController = async(req,res)=>{
  const { id } = req?.params;
  try {
    const data = await removeServiceModel(id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}

module.exports = {
  postServicesController,
  getServicesController,
  getServiceControllerById,
  updateServiceController,
  removeServiceController
};
