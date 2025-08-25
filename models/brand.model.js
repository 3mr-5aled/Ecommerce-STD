const mongoose = require("mongoose");
const { setImageURL } = require("../utils/helpers");
// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// findOne, findAll and update
brandSchema.post("init", (doc) => {
  setImageURL(doc, "brands", "image");
});

// create
brandSchema.post("save", (doc) => {
  setImageURL(doc, "brands", "image");
});

// 2- Create model
module.exports = mongoose.model("Brand", brandSchema);
