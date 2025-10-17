const mongoose = require("mongoose");

// funcction ten la connect (tu dinh nghia)
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect Success");
  } catch(error) {
    console.log("Connect Error");
  }
}


