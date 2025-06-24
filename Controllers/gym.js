const Gym = require("../MODELS/GYM");
const bcrypt = require("bcrypt"); // it will convarted into hash(it will like a$2b$10$XvOrUnXN9Il4nLEJX7iodeSg7vIj3FHCVbSVAgef/9pc8nozcx0Ly ) password
const crypto = require("crypto");
const nodemailer = require("nodemailer");

require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  //console.log("Registering user...");
  try {
    const { userName, password, gymName, profilePic, email } = req.body;
    console.log(userName, password, gymName, profilePic, email); // in this case i got object

    const isExist = await Gym.findOne({ userName });
    if (isExist) {
      res.status(400).json({
        message: "User Name already exists, please choose another name",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // it will convarted into hash(it will like a$2b$10$XvOrUnXN9Il4nLEJX7iodeSg7vIj3FHCVbSVAgef/9pc8nozcx0Ly ) password
      console.log(hashedPassword);

      const newGym = new Gym({
        userName,
        password: hashedPassword,
        gymName,
        profilePic,
        email,
      });
      await newGym.save();
      res.status(201).json({
        message: "Gym registered successfully",
        success: "Yes",
        data: newGym,
      });
    }
    //console.log(req.body);
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const cookieOptions = {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite : "Strict"

};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const gym = await Gym.findOne({ userName });

    if (gym && (await bcrypt.compare(password, gym.password))) {
      const token = jwt.sign({ gym_id: gym._id }, process.env.JWT_SECRET_KEY);

      const cookieOptions = {
        httpOnly: true,
        secure: false, // Set to true with HTTPS
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      res.cookie("token", `Bearer ${token}`, cookieOptions);

      res.json({
        message: "Login successful",
        success: true,
        gym: gym,
        token: token
      });
    } else {
      res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};



exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const gym = await Gym.findOne({ email });

    if (!gym) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
      });
    }

    const buffer = crypto.randomBytes(4);
    const otp = (buffer.readUInt32BE(0) % 900000) + 100000;
    // console.log(otp)

    gym.resetPasswordToken = otp;
    gym.resetPasswordExpires = Date.now() + 3600000; // it will be expired in one hour.
    await gym.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: `You requested a password reset. Your OTP is ${otp}. It will expire in 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "Error sending email",
          error: error.message,
        });
      } else {
        return res.status(200).json({
          message: "OTP sent successfully",
          success: true,
        });
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};



exports.verifyOtp = async (req, res) => {
    try{
        
        const {email,otp} = req.body;
        const gym = await Gym.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if(!gym){
            return res.status(400).json({
                message: "Invalid OTP or OTP expired",
                success: false,
            })
        }
        else{
            res.status(200).json({
                message: "OTP verified successfully",
                success: true,
            })
        }
    }catch(err){
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}


exports.resetPassword = async (req, res) => {
    try{
         const {email,newPassword} = req.body;
         const gym = await Gym.findOne({email})

         if (!gym){
            return res.status(400).json({
                message: "Some Technical Issue , please try again later",
                success: false,
            })
         }
         const hashedPassword = await bcrypt.hash(newPassword, 10);
         gym.password = hashedPassword;
         gym.resetPasswordToken = undefined; // old password is deleted. and new password is set
         gym.resetPasswordExpires = undefined; //

         await gym.save();
            res.status(200).json({
                message: "Password updated successfully",
                success: true,
            })
    }catch(err){
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }


}

// exports.checking = (req, res) => {
//     console.log(req.gym);// it will return the user data
    
// };

exports.logout = async (req, res) => {
    req.clearCookie("cookie_token", cookieOptions).json({message:"Logout successfully"}); // it will clear the cookie from the browser
}


