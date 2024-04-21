const router = require("express").Router();
const Product = require("../Models/Product");
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("./verifyToken");

//CREATE PRODUCT
router.post("/addproduct", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json("Product can't be created ::" + error);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json("Product can't be created ::  " + error);
  }
});

// router.get("/:id", async (req, res) => {
//   const productId = req.params.id;
//   try {
//     const product = await Product.findById( productId );
//     res.status(200).json(product);
//     console.log(product);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ msg: "Internal server array", error: error, success: false });
//   }
// });

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("product deleted");
  } catch (error) {
    res.status(500).json("cannot delete the product :::" + error);
  }
});

//GET a product with user login
router.get("/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json("Can't get product :: " + error);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new; //  new is the name of query => /api/products/?new=true
  const qCategory = req.query.category; //  category is the name of query => /api/products/?category=men

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(2);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json("can't get product ::" + error);
  }
});

module.exports = router;
