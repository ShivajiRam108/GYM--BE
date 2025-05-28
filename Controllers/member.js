const Member = require('../MODELS/member'); 
const router = require('../Routes/gym');
const Membership = require('../MODELS/membership');






exports.getAllMembers = async (req, res) => {
    try{
        const {skip, limit} = req.query;// query params it will be in the url
        // console.log(skip, limit);// it will be in the url. it will return skip and limit.(0 9)
        const members = await Member.find({gym:req.gym._id});
        const totalMembers = members.length;

        const limitedNumbers = await Member.find({gym:req.gym._id}).sort({createdAt: -1}).skip(skip).limit(limit);  // sort by createdAt in descending order
        res.status(200).json({
            message:members.length? "Fetched Members successfully":"No any Member Registered yet",
            members: limitedNumbers,
            totalMembers: totalMembers,
            success: true
        })
        
    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

// my code 
function addMonthsToDate(months, joiningDate) {
    // let today = joiningDate;
    // const currentYear = today.getFullYear();
    // const currentMonth = today.getMonth();
    // const currentDay = today.getDate();
    // const date = new Date(joiningDate); // Make a copy so original isn't mutated
    // const day = date.getDate();


    // const futureMonth = currentMonth + months; 
    // const currentDay = currentYear + Math.floor(futureMonth / 12);
    
    // const adjustedMonth = futureMonth % 12;

    // const futureDate = new Date(futureYear , adjustedMonth, 1);
    // const lastDayOfFutureMonth = new Date(futureYear , adjustedMonth + 1 , 0).getDate();
    // const adjustedDay = Math.min(currentDay, lastDayOfFutureMonth);
    // futureDate.setDate(addMonthsToDate);
    // return futureDate;
    
    // Add months to current date
    date.setMonth(date.getMonth() + months);

    // Handle month overflow (e.g., Feb 30 becomes Mar 2)
    const lastDayOfTargetMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // If original day doesn't exist in new month, set to last day
    if (day > lastDayOfTargetMonth) {
        date.setDate(lastDayOfTargetMonth);
    } else {
        date.setDate(day);
    }

    return date;
}
// chatgpt
function addMonthsToDate(months, joiningDate) {
    const date = new Date(joiningDate); // Create a copy to avoid mutation
    const day = date.getDate();

    date.setMonth(date.getMonth() + months);

    // Handle edge cases where original day doesn't exist in the new month
    const lastDayOfTargetMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    if (day > lastDayOfTargetMonth) {
        date.setDate(lastDayOfTargetMonth);
    } else {
        date.setDate(day);
    }

    return date;
}


exports.registerMember = async (req, res) => {
    try{
        const {name,mobileNo,address,membership,profilePic,joiningDate} = req.body;
        const member = await Member.findOne({gym:req.gym._id , mobileNo});
        if(member){
            return res.status(400).json({
                message: "Member already exists on this mobile number.",
                success: false
            })
        }

        const memberShip = await Membership.findOne({_id:membership, gym:req.gym._id});
        // console.log(memberShip); // it will return the membership details
        const membershipMonth = memberShip.months

        if(memberShip){
            let jngDate = new Date(joiningDate)
            const nextBillDate = addMonthsToDate(membershipMonth, jngDate);
            let newMember = new Member ({name, mobileNo,address, membership,gym:req.gym._id, profilePic, nextBillDate});
            await newMember.save();
            res.status(200).json({message:"Member Registered Successfully.", newMember})

        }else{
            return res.status(409).json({error:"No such Membership are there."})
        }
        


    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

exports.searchMember = async(req,res)=>{
    try{
        const {searchTerm} = req.query;
        const member = await Member.find({gym:req.gym._id,
            $or : [{name:{$regex: '^' +searchTerm, $options: 'i' }},
                {mobileNo:{$regex: '^' +searchTerm, $options: 'i' }}
            ] 
        })
        res.status(200).json({message: member.length? "Fetched Member Successfully" :"No Such Member Registered yet.",
            member : member,
            totalMembers : member.length
        })

    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server Error."})
        
    }

}

exports.monthlyMember = async (req, res) => {
    try{

        const now = new Date();
        const startOfMonth = new Date (now.getFullYear(),now.getMonth(), 1);//get the frist day of the current month (2025- 05 - 20)
        const endOfMonth = new Date (now.getFullYear(),now.getMonth()+1, 0 , 23, 59, 999 )

        // console.log(startOfMonth, endOfMonth);//it will be return current date and end of the date

        const mumber = await Member.find({gym:req.gym._id,

            createdAt :{
                $gte : startOfMonth, // Greater then  or equel to the frist day of the month
                $lte : endOfMonth // less then or equel to the last day of the month
            }
        }).sort({createdAt:-1})// sort by createdAt in descending order

        res.status(200).json({
            message: mumber.length? "Fetched Monthly Members Successfully" : "No Member Registered this Month",
            members: mumber,  
            totalMembers: mumber.length  
        })
        
    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

exports.expiringWithin3Days = async (req, res) => {
    try{

        const today = new Date();   
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3); // Add 3 days to the current date

        const mumber = await Member.find({gym:req.gym._id,
            nextBillDate: {
                $gte: today,
                $lte: nextThreeDays
            }
        });
        res.status(200).json({
            message: mumber.length? "Fetched Members Successfully" : "No Member Expiring in 3 Days",
            members: mumber,
            totalMembers: mumber.length
        })

    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

exports.expiringWithin4To7Days = async (req, res) => {
    try{

        const today  = new Date();
        const next4Days = new Date();
        next4Days.setDate(today.getDate() + 4); // Add 4 days to the current date

        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7); // Add 7 days to the current date

        const member = await Member.find({gym:req.gym._id,
            nextBillDate:{
                $gte:next4Days,   // expireing within 4 days 
                $lte: next7Days
            }
        });
        res.status(200).json({
            message: member.length? "Fetched Members Successfully" : "No Member Expiring in 4 to 7 Days",
            members: member,
            totalMembers: member.length
        });

    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

exports.expiredMembers = async (req, res) => {
    try{

        const today = new Date();
        const member =  await Member.find({gym:req.gym._id,status:"Active",
            nextBillDate:{
                $lt: today
            }
        });

        res.status(200).json({
            message: member.length? "Fetched Members Successfully" : "No such Member Expired",
            members: member,
            totalMembers: member.length
        });

    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

exports.inActiveMembers = async (req, res) => {
    try{

        const member = await Member.find({gym:req.gym._id, status:"Pending"});
        res.status(200).json({
            message: member.length? "Fetched Members Successfully" : "No such Member is Pending",
            members: member,
            totalMembers: member.length
        });

    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}

exports.getMemberDetails = async (req, res) => {
    try{

        const {id} = req.params;
        const member = await Member.findOne({_id:id, gym:req.gym._id});
        if(!member){
            return res.status(404).json({error: "No such Member Found"});
        }
        res.status(200).json({
            message: "Member Data Fetched Successfully",
            member: member
        });
    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}
exports.changeStatus = async (req, res) => {
    try{

        const {id} = req.params;
        const {status} = req.body;
        const member = await Member.findOne({_id:id, gym:req.gym._id});
        if(!member){
            return res.status(404).json({error: "No such Member Found"});
        }
        member.status = status;
        await member.save();
        res.status(200).json({
            message: "Status Changed Successfully",
            // member: member
        });

    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

exports.updateMemberPlan = async (req, res) => {
    try{

        const {membership} = req.body;
        const {id} = req.params;
        const memberShip = await Membership.findOne({gym:req.gym._id, _id:membership});
        if(memberShip){
            
            let today = new Date();
            let getMonth = memberShip.months;
            let nextBillDate = addMonthsToDate(getMonth, today);
            const member = await Member.findOne({gym:req.gym._id, _id:id});
            if(!member){
                return res.status(404).json({error: "No such Member Found"});

            }
            member.nextBillDate = nextBillDate;
            member.lastPayment = today;

            await member.save();
            res.status(200).json({
                message: "Member Plan Updated Successfully",
                member: member
            });

        }else{
            return res.status(409).json({error: "No such Membership Found"});
        }

    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}