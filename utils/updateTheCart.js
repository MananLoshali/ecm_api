const axios = require("axios");

const updateTheCart = async ({ userId, ...body }) => {
  console.log("body from updateCart", body);

  console.log("id from updateCart", userId);
  try {
    const res = await axios.get(`http://localhost:5000/api/carts/${userId}`);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { updateTheCart };
