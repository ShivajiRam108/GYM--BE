const express = require('express');
const router = express.Router();
// const Membership = require("../MODELS/membership")
const MembershipController = require("../Controllers/membership");
const auth = require('../AUTH/auth');

router.post("/add-membership",auth,MembershipController.addMembership);
router.get("/get-membership",auth,MembershipController.getMembership);

module.exports = router;