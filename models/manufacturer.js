const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  location: { type: String, required: true, maxLength: 50 },
  description: { type: String },
});

ManufacturerSchema.virtual("url").get(function () {
  return `/shopwiki/manufacturer/${this._id}`;
});

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
