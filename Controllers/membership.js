const Membership = require("../MODELS/membership")
// const Gym = require("../MODELS/GYM")

 
exports.addMembership = async (req, res) => {
    // console.log("getMembership");
    try{
        const {months, price} = req.body;
        const membership = await Membership.findOne({gym:req.gym._id,months});
        if(membership){
            membership.price = price;
            await membership.save();
            // console.log(membership);// it will show the updated membership
            
            res.status(200).json({
                message: "Membership Updated Successfully",
                success: true,
            })
        }else{
            const newMembership = new Membership({price,months,gym:req.gym._id});
              
            await newMembership.save();
            res.status(200).json({
                message: "Membership created successfully",
                success: true,
                data:newMembership
            })
        }


    }catch(err){
        // console.log(err);
        res.status(500).json({error: "Internal server error"});
        
    }
    
}

exports.getMembership = async (req, res) => {
    try{
        const loggedInId  = req.gym._id;
        const membership = await Membership.find({gym: loggedInId});
        res.status(200).json({
            message: "Membership fetched successfully",
            success: true,membership
        })
    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}