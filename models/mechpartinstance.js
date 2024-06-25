const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MechPartInstanceSchema = new Schema({
  mechs: { type: Schema.Types.ObjectId, ref: "Mechs", required: true },
  storage: { type: Schema.Types.ObjectId, ref: "Storage", required: true },
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  serialNo: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Reserved", "Sold"],
    default: "Available",
  },
  dateReceived: { type: Date, required: true },
  dateSold: { type: Date },
});

MechPartInstanceSchema.virtual("url").get(function () {
  return `/shopwiki/mechpartinstance/${this._id}`;
});

module.exports = mongoose.model("MechPartInstance", MechPartInstanceSchema);
