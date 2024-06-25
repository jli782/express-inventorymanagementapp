const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 25 },
  weightMin: { type: Number, required: true },
  weightMax: { type: Number, required: true },
  description: { type: String, required: true },
});

CategorySchema.virtual("url").get(function () {
  return `/shopwiki/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
