const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Untitled Form",
  },
  formElements: [
    {
      label: {
        type: String,
        required: false,
        default: "Title",
      },
      type: {
        type: String,
      },
      placeholder: {
        type: String,
        required: false,
        default: "Type here",
      },
    },
  ],
});

module.exports = mongoose.model("Form", formSchema);
