const Product = require("../Models/Product");

const router = require("express").Router();

router.post("/getsearchproduct", async (req, res) => {
  //use query instead of sending data in body like "/getsearchproduct/?type=men"
  const data = await req.body.input;
  try {
    let product = (await Product.find()).filter((item) =>
      item.categories.includes(data)
    );
    if (product.length === 0) {
      res.status(404).json({ msg: "No products found", success: false });
      return;
    }
    res.status(200).json({ data: product, success: true });
  } catch (error) {
    res.status(500).json({ msg: error, success: false });
  }
});

module.exports = router;
