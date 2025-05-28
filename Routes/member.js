const express = require('express');
const router = express.Router();

const auth = require('../AUTH/auth');
const MemberController = require("../Controllers/member"); 



router.get("/all-mamber", auth,MemberController.getAllMembers);
router.post("/register-member",auth,MemberController.registerMember);

router.get("/searched-members",auth,MemberController.searchMember)
router.get("/monthly-member", auth, MemberController.monthlyMember )
router.get("/within-3-days-expiring" , auth, MemberController.expiringWithin3Days)
router.get("/within-4-to-7-days-expiring" , auth, MemberController.expiringWithin4To7Days)
router.get("/expired-members", auth, MemberController.expiredMembers)
router.get("/inactive-members", auth, MemberController.inActiveMembers);


router.get("/get-member/:id", auth, MemberController.getMemberDetails );
router.post("/change-status/:id", auth, MemberController.changeStatus);
router.put("/update-member-plan/:id", auth, MemberController.updateMemberPlan);

module.exports = router;