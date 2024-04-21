const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Cart = require("../Models/Cart");
const { getCartItems } = require("../utils/getCartItems");
const { updateCart } = require("../utils/updateCart");

const router = require("express").Router();

//CREATE CART
router.post("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.id;
  const product = req.body.products;
  console.log("product from create ", product);
  try {
    const previousCartTotalAmount = await getCartItems(userId);
    let totalAmount = 0;

    if (previousCartTotalAmount) {
      const data = updateCart(product, previousCartTotalAmount, userId);
      data
        .then((data) => {
          res.status(200).json({ msg: "Cart Updated successfully" });
        })
        .catch(() => {
          res.status(500).json({ msg: "Some error in updating" });
        });
      return;
    }
    totalAmount = req.body.products.amount;
    console.log(req.body.products.amount, "AMONT");
    const newCart = new Cart({
      userId: userId,
      products: {
        productId: req.body.products.productId,
        quantity: req.body.products.quantity,
        color: req.body.products.color,
        size: req.body.products.size,
        amount: req.body.products.amount,
      },
      totalAmount: totalAmount,
    });
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json("Can't create the cart :: " + error);
  }
});

//UPDATE CART
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const product = req.body.product;
  const previousCartTotalAmount = req.body.previousCartTotalAmount;
  const totalAmount = previousCartTotalAmount + product.amount;
  console.log(product, previousCartTotalAmount, totalAmount, userId);
  try {
    const cart = await Cart.findOne({ userId });
    console.log(cart);
    cart.products.push(product);
    cart.totalAmount = totalAmount;

    cart.save();
    res.status(201).json({ msg: "Cart updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error form update cart", error: error });
  }
});

//DELETE CART
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart deleted");
  } catch (error) {
    res.status(500).json("can't delete the cart ::" + error);
  }
});

//GET USER CART
router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json("can't get cart items ::" + error);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json("can't get all cart  ::" + error);
  }
});
module.exports = router;
