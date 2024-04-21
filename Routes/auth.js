// const router = require("express").Router();
// const User = require("../Models/User");
// var bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// //REGISTER
// router.post("/register", async (req, res) => {
//   const newUser = User({
//     username: req.body.username,
//     email: req.body.email,
//     password: await bcrypt.hash(req.body.password, 8),
//     // password: req.body.password,
//   });
//   try {
//     const saveduser = await newUser.save();
//     res.status(200).json(saveduser);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // LOGIN

// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });

//     !user && res.status(401).json("Wrong credentials");

//     const hashedpass = CryptoJS.AES.decrypt(
//       user.password,
//       process.env.PASS_SEC,
//       {
//         expiresIn: "3d",
//       }
//     );

//     const originalpassword = hashedpass.toString(CryptoJS.enc.Utf8);

//     originalpassword !== req.body.password &&
//       res.status(401).json("Wrong password");

//     const accessToken = jwt.sign(
//       {
//         id: user._id,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SEC,
//       { expiresIn: "3d" }
//     );

//     const { password, ...others } = user._doc;

//     res.status(200).json({ ...others, accessToken });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;
const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

//REGISTER

router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    image: req.body.img,
  });
  try {
    const saveduser = await newUser.save();
    res.status(200).json(saveduser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.route("/").get((req, res) => {
//   res.json("SHDjhgbsdjgk");
// });

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json({ msg: "User not found", success: false });
      return;
    } else {
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (isMatch) {
        const { password, ...others } = user._doc;
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );

        res.status(200).json({ ...others, accessToken });
      } else {
        res.status(400).json({ msg: "Wrong password", success: false });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
