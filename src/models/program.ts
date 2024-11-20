const mongoose = require("mongoose");

const Program = mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      required: true,
    },
    value: {
      type: String,
      default: "",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Program", Program);
