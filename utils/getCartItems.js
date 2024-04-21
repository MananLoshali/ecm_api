const axios = require("axios");

const getCartItems = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/carts/${userId}`);
    const data = await res.data;
    if (data) {
      return data.totalAmount;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCartItems };
