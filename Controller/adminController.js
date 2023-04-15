const { adminLoginModel, forgotPasswordModel ,resetPasswordModel} = require("../Models/adminModel")

const adminLoginController = async(req,res) =>{
    const body = req?.body
    try{
        const data = await adminLoginModel({body})
        res.send(data)

    }
    catch(err){
        res.send(err)
    }
}

const forgotPasswordController = async(req,res)=>{
    const body = req.body
    try{
        const data = await forgotPasswordModel({body})
       res.send(data)
    }
    catch(err){
        res.send(err)
    }

}

const resetPasswordController =async(req,res)=>{
    const { token } = req.params;
    const { password,passwordConfirmation  } = req.body;
    try{
        const data = await resetPasswordModel({token,password,passwordConfirmation })
        res.send(data)

    }
    catch(err){
        res.send(err)
    }


}

module.exports ={adminLoginController,forgotPasswordController,resetPasswordController}