const express = require("express");
const paymentRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

paymentRouter.post("/payment/verify",userAuth, async (req, res) => {
  try {
    const { orderID, planName, emailId } = req.body;
    console.log(emailId);
    if (!orderID || !planName || !emailId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isPremium = true;


    user.membershipType = planName;

    await user.save();

    res.send(user);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = paymentRouter;
