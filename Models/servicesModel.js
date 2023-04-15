const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  reviews: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  profile: {
    type: String,
    required: true
  },
  
});

const Service = mongoose.model('Service', serviceSchema);

const postServiceModel = async ({ body, profile }) => {
    const { title, subtitle, rating, reviews,price } = body;
    try {
      const res = await Service.create({
        title,
        subtitle,
        rating,
        reviews,
        profile,
        price
      });
      return { data: res, message: "Succes", status: 200 };
    } catch (err) {
      return { message: err, status: 500 };
    }
  };

  const getServicesModel = async(query, pageSize, startIndex)=>{
    try {
      const res = await Service.aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: new RegExp(query, "i") } },
              { subtitle: { $regex: new RegExp(query, "i") } },
              { price: { $regex: new RegExp(query, "i") } },
          ],
          },
        },
        { $skip: startIndex },
        { $limit: pageSize },
  
        {
          $project: {
            title: 1,
            subtitle: 1,
            price: 1,
            rating: 1,
            reviews:1,
            price:1,
            profile:1,
          },
        },
      ]);
      const count = await Service.countDocuments();
      const totalPages = Math.ceil(count / pageSize);
      return {
        data: res,
        count,
        totalPages,
        message: "Succes",
        status: 200,
      };
    } catch (err) {
      console.log("ERRR=r->",err);
      return { message: err, status: 400 };
    }
  };

const getServiceByIdModel = async(id)=>{
  try {
    const res = await Service.findById(id);
    return { data: res, message: "Succes", status: 200 };
  } catch (err) {
    return { message: err, status: 400 };
  }
}

const updateServiceModel = async (id,{ body, profile}) => {
  try {
    const res = await Service.findByIdAndUpdate(id,{ ...body,profile }, { new: true });
    return { data: res, message: "Success", status: 200 };
  } catch (err) {
    return { message: err, status: 400 };
  }
};

const removeServiceModel = async(id)=>{
  try {
    const res = await Service.findByIdAndRemove(id);
    return { data: res, message: "Success", status: 200 };
  } catch (err) {
    return { message: err, status: 400 };
  }
}

  
module.exports = {postServiceModel,getServicesModel,getServiceByIdModel,updateServiceModel,removeServiceModel}