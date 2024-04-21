const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./Routes/user");
const registerRoute = require("./Routes/auth");
const productRoute = require("./Routes/product");
const cartRoute = require("./Routes/cart");
const orderRoute = require("./Routes/order");
const changePasswordRoute = require("./Routes/changepassword");
const searchedProducts = require("./Routes/searchproducts");
const paymentRoute = require("./Routes/stripe");
const cors = require("cors");

const app = express();

//CONFIGURING DOTENV FILE
dotenv.config();

//CONNECTION TO DATABASE
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "test",
  })
  .then((data) => {
    console.log("Databse connected", data);
  })
  .catch((err) => {
    console.log("ERROR", err);
  });

app.use(cors());

//USING MIDDLEWARE TO USE JSON
app.use(express.json());

//DEFINING ROUTES
app.use("/api/users", userRoute);
app.use("/api/users", registerRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/users", changePasswordRoute);
app.use("/api/products", searchedProducts);
app.use("/api/checkout", paymentRoute);

//LISTENING TO THE SERVER
app.listen(5000, () => {
  console.log("Port 5000");
});
