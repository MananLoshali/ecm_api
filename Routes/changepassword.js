const User = require("../Models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();

router.post("/changepassword", async (req, res) => {
  const email = await req.body.email;
  const password = await req.body.password;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: "User not found", success: false });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.save();
    res.status(200).json({ user: user, success: true });
  } catch (error) {
    res.status(500).json({ msg: error, success: false });
  }
});

module.exports = router;
