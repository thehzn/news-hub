const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");
const User = require("../models/userModel"); 
const News = require("../models/newsModel");
exports.userRegister = async(req,res)=>{

    try{

const {name,email,password}=req.body;
console.log(req.body);

if(!name || !email || !password ){
    return res.status(400).json({
        message:"enter full details" ,
        success:false 
    });
}
const existinguser = await User.findOne({email});
if(existinguser){
     return res.status(400).json({ message: "Email already registered", 
        success: false });
}


  const user=await User.create({ name, email, password }); 
    
  const token =await generateToken(user._id); 
 
         res.status(201).cookie('token', token, {
  httpOnly: true,
  secure: true,           // required for HTTPS
  sameSite: 'none',       // required for cross-origin
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}).json({
        message:"user registered succussfully" ,
        success:true,
        user: {
        id: user._id,
        name: user.name,
        email: user.email,
        
      },
    });
    }
    catch(error){
         return res.status(500).json({
            message: error.message,
            success:false,
        });
    }
}



exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Enter full details",
        success: false,
      });
    }

    // Selects the user and explicitly includes the password field for verification
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    
     const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = await generateToken(user._id);

    
    user.password = undefined;

    
    return res.status(200)
      .cookie('token', token, {
  httpOnly: true,
  secure: true,           // required for HTTPS
  sameSite: 'none',       // required for cross-origin
  maxAge: 24 * 60 * 60 * 1000 // 1 day
})
      .json({
        message: "User logged in successfully",
        success: true,
        token,
        user,
      });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

exports.getMe = async (req, res) => {
  try {
    
    const id = req.userId;

    if (!id) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

  
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const id = req.userId ;
    const { currentPassword, newPassword } = req.body;
    console.log(id);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide both current and new passwords" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.log("ERROR NAME:", error.name);      // ← add
  console.log("ERROR MESSAGE:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.signout = async (req, res) => {
  try {
     res.clearCookie('token');

  
    res.status(200).json({ 
      success: true, 
      message: "Signed out successfully." 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getStats=async(req,res)=>{
  try{
    const adminId =req.userId;
    console.log(adminId);
    if(!adminId){
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const [published,draft,in_review,scheduled]=await Promise.all([
      News.countDocuments({author:adminId,status:'published'}),
      News.countDocuments({author:adminId,status:'draft'}),
      News.countDocuments({author:adminId,status:'in-review'}),
      News.countDocuments({author:adminId,status:'scheduled'}),

    ]);
    const total = published+draft+in_review+scheduled;
    res.json({ success:true,message:"stats fetched successfully",published, draft, scheduled,in_review, total });

  }
   catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
}
