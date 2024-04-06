const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    filename:{
      type:String
    },
  },
  { timestamps: true }
);
const userSchema = mongoose.model("user", Schema);
module.exports = userSchema;




