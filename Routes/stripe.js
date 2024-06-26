const router = require("express").Router();
const stripes = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res) => {
  console.log(req.body, "checkout");
  stripes.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
        console.log(stripeErr, "err");
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
