const router = require("express").Router();
const Order = require("../Models/Order");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//CREATE A ORDER
router.post("/create/:id", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.id;
  const orderedProduct = req.body;
  console.log(req.body, "body re");
  const newOrder = new Order({
    userId,
  });
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json("Can't create order :: " + error);
  }
});

//UPDATE A ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json("Can't update the order ::: " + error);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
  } catch (error) {
    res.status(500).json("Can't delete order ::: " + error);
  }
});

//GET USER ORDERS
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.id });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json("Can't get the error is :::" + error);
  }
});

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (re, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json("Can't get all the orders :::" + error);
  }
});

//STATS (Get Monthly Income)
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
