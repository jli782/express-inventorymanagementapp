const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: { type: String, required: true, maxLength: 25 },
  description: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
});

ClientSchema.virtual("url").get(function () {
  return `/shopwiki/client/${this._id}`;
});

module.exports = mongoose.model("Client", ClientSchema);
