const mongoose = require("mongoose");
const { DateTime } = require("luxon");

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

MechPartInstanceSchema.virtual("dateReceived_formatted").get(function () {
  return this.dateReceived
    ? this.dateReceived.toLocaleDateString(DateTime.DATETIME_MED)
    : `???`;
});

MechPartInstanceSchema.virtual("dateSold_formatted").get(function () {
  return this.dateSold
    ? this.dateSold.toLocaleDateString(DateTime.DATETIME_MED)
    : `???`;
});
module.exports = mongoose.model("MechPartInstance", MechPartInstanceSchema);
