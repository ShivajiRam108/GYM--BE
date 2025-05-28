const express = require("express");
const router = express.Router();
const GymController = require("../Controllers/gym");
const auth = require("../AUTH/auth")

router.post("/register",GymController.register);
router.post('/login', GymController.login);


router.post("/reset-password/sendOtp",GymController.sendOtp);
router.post("/reset-password/verifyOtp",GymController.verifyOtp);
router.post("/reset-password/updatePassword",GymController.resetPassword );

// router.get("/checking", auth, GymController.checking);
router.post("/logout", auth, GymController.logout);

module.exports = router;
