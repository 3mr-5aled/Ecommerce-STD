const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    // percentage value to be subtracted from total cart price
    discount: {
      type: Number,
      required: [true, "Coupon discount value required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);

// Additional functionalities:
// Pre-save hook to format coupon name to uppercase
couponSchema.pre("save", function (next) {
  this.name = this.name.toUpperCase();
  next();
});

// Add index to expire field for automatic deletion of expired coupons
couponSchema.index({ expire: 1 }, { expireAfterSeconds: 0 });

// Instance method to check if coupon is valid (not expired)
couponSchema.methods.isValid = function () {
  return this.expire > Date.now();
};

// Static method to find coupon by name
couponSchema.statics.findByName = function (name) {
  return this.findOne({ name: name.toUpperCase() });
};
