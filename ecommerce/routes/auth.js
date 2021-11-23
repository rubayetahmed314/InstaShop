const express = require("express");
const router = express.Router();

const { signup, signin, signout, subscribe } = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/subscribe", subscribe);

module.exports = router;
