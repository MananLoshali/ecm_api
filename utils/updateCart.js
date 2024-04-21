const axios = require("axios");

const updateCart = async (product, previousCartTotalAmount, userId) => {
  console.log("data from function", product, previousCartTotalAmount, userId);
  try {
    const res = await axios.put(`http://localhost:5000/api/carts/${userId}`, {
      product,
      previousCartTotalAmount,
    });
    const data = await res.data;
    return data;
  } catch (error) {
    console.log("big error", error);
  }
};

module.exports = { updateCart };
