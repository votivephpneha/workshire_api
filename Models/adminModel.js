const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";
const bcrypt = require("bcryptjs");
const validator = require("validator");
const nodemailer = require('nodemailer');
const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter a Password"],
  },
  isAdmin: {
    type: Boolean,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
adminSchema.virtual('passwordConfirmation')
.get(() => this._passwordConfirmation)
.set(value => this._passwordConfirmation = value);

const Admin = mongoose.model("admindetail", adminSchema);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "votivephp.sanyogita@gmail.com",
    pass: "nznvumtevsijfojd"
  }
});



const adminLoginModel = async ({ body }) => {
  const { password, email } = body;
  if (!(email && password)) {
    return { message: "All Fields Required" };
  }

  try {
    const isExist = await Admin.findOne({
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
      const { email, password, _id, isAdmin } = isExist;
      const UserDataClone = { email, password, _id, isAdmin };
      const token = jwt.sign({ userId: _id, isAdmin: isAdmin }, SECRET_KEY, {
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

const forgotPasswordModel = async ({ body }) => {
  const { email } = body;

  try {
    // Check if email exists in database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return { error: "User not found" }
    }
    const{_id}=admin

    // Create password reset token with expiration time
    const resetToken = jwt.sign({ userId: _id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Store password reset token and expiration time in database
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    // Send email to user with password reset link
    const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
   // const message = `Please click on this link to reset your password: ${resetUrl}`;
    // Use a mail service or SMTP server to send email to user
    // Example using nodemailer
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      //text: message,
      html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
    return {
      message: "Password has been reset successfully",
      status: 200,
      data: admin,
    };
  } catch (error) {
    console.error(error);
    return { message: "Server error", status: 500 };
  }
};

const resetPasswordModel = async ({ token,password ,passwordConfirmation }) => {
    if (password !== passwordConfirmation) {
    return { message: 'Passwords do not match' }
  }
try {
    // Check if password reset token exists in database and is not expired
    const admin = await Admin.findOne({

      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return { message: "Invalid or expired token" ,status:400}
    }

    // Update password for the user
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    return {
      message: "Password has been reset successfully",
      status: 200,
      data: admin,
    };
  } catch (error) {
    console.error(error);
    return { message: "Server error", status: 500 };
  }
};

module.exports = { adminLoginModel, forgotPasswordModel, resetPasswordModel };
