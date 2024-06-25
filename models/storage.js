const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorageSchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
});

StorageSchema.virtual("url").get(function () {
  return `/shopwiki/storage/${this._id}`;
});

module.exports = mongoose.model("Storage", StorageSchema);
