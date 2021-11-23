const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth"); // require use না করলে 'expected callback function, got an Object instead' error

const {
    userById,
    read,
    update,
    purchaseHistory,
    setEligible,
    setCouponUsed,
    setSubscriber,
} = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);
router.put("/discount/eligible/:userId", requireSignin, isAuth, setEligible);
router.put("/discount/coupon/:userId", requireSignin, isAuth, setCouponUsed);
router.put("/subscribe/:userId", requireSignin, isAuth, setSubscriber);
// router.get('/discount/get/:userId', requireSignin, isAuth, getEligible);

router.param("userId", userById); // make the user info available in req.profile whenever userID is present in the route

module.exports = router;
