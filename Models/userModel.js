const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    maxLegnth: [30, "Name Can't exceed 30 characters"],
    minLegnth: [3, "Name shoud have more than 4 characters"],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
  },
  userName: {
    type: String,
  },
  year: {
    type: String,
  },
  months: {
    type: String,
  },
  country: {
    type: String,
  },
  status:{
    type:String
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("userdata", userSchema);

const registerModel = async ({ body }) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    _id,
    password,
    year,
    months,
    country,
    status
  } = body;
  const isExist = await User.findOne({ email: body.email });
  if (isExist) {
    return { error: "Email already exists!!" };
  }
  try {
    const res = await User.create({
    firstName,
    lastName,
    email,
    _id,
    password,
    userName,
    year,
    months,
    country,
    status
    });
    const UserDataClone = { res };
    const token = jwt.sign({ userId: _id }, SECRET_KEY);
    UserDataClone.token = token;
    return { data: UserDataClone, message: "Succes", status: 200 };
  } catch (err) {
  

    return { message: err, status: 400 };
  }
};

const getUserModel = async (query, pageSize, startIndex) => {
  try {
    const res = await User.aggregate([
      {
        $match: {
          $or: [
            { firstName: { $regex: new RegExp(query, "i") } },
            { lastName: { $regex: new RegExp(query, "i") } },
            { email: { $regex: new RegExp(query, "i") } },
            { months: { $regex: new RegExp(query, "i") } },
            { country: { $regex: new RegExp(query, "i") } },
            { userName: { $regex: new RegExp(query, "i") } }
          ],
        },
      },
      { $skip: startIndex },
      { $limit: pageSize },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          userName:1,
          year:1,
          password:1,
          country:1,
          months:1
        },
      },
    ]);
    const count = await User.countDocuments();
    const totalPages = Math.ceil(count / pageSize);
    return {
      data: res,
      count,
      totalPages,
      message: "Succes",
      status: 200,
    };
  } catch (err) {
    return { message: err, status: 500 };
  }
};

const removeModel = async (id) => {
  try {
    const res = await User.findByIdAndRemove(id);
    return { data: res, message: "Success", status: 200 };
  } catch (err) {
    return { message: err, status: 400 };
  }
};
const getUserByIdModel = async (id) => {
  try {
    const res = await User.findById(id);
    return { data: res, message: "Succes", status: 200 };
  } catch (err) {
    return { message: err, status: 400 };
  }
};

const updateUserModel = async (id, body) => {
  try {
    const res = await User.findByIdAndUpdate(id, body, { new: true });
    return { data: res, message: "Success", status: 200 };
  } catch (err) {
    return { message: err, status: 500 };
  }
};

const loginModel = async ({ body }) => {
  const { password, email } = body;
  if (!(email && password)) {
    return { message: "All Fields Required" };
  }

  try {
    const isExist = await User.findOne({
      email: body.email,
    });
    if (!isExist) {
      return { error: "User not found" };
    }
    const match = await bcrypt.compare(password, isExist.password);
    if (!match) {
      return { passwordError: "Incorrect password" };
    }
    if (match) {
      const { email, password, _id, } = isExist;
      const UserDataClone = { email, password, _id, };
      const token = jwt.sign({ userId: _id,}, SECRET_KEY, {
        expiresIn: "1h",
      });
      UserDataClone.token = token;
      return {
        data: UserDataClone,
        auth: true,
        message: "Succes",
        status: 200,
      };
    } else {
      return { error: "Credential not matchecd" };
    }
  } catch (err) {
    return { message: err, status: 400 };
  }
};

module.exports = {
  registerModel,
  getUserModel,
  removeModel,
  getUserByIdModel,
  updateUserModel,
  loginModel,
};