const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MechsSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  model: { type: String, required: true, maxLength: 50 },
  name: { type: String, required: true, maxLength: 50 },
  tech: {
    type: String,
    required: true,
    enum: ["Clan", "Inner Sphere", "Star League"],
    default: "Inner Sphere",
  },
  description: { type: String, required: true },
  era: { type: String, maxLength: 50 },
  weight: { type: Number, required: true },
  price: { type: Number, required: true },
  battle_value: { type: Number, required: true },
  equipment: [{ type: String }],
  imageURL: { type: String, required: true },
});

MechsSchema.virtual("url").get(function () {
  return `/shopwiki/mechs/${this._id}`;
});

module.exports = mongoose.model("Mechs", MechsSchema);
