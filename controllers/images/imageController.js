// Require the cloudinary library
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.imageHandler = async function (req, res, next) {
  // Configuration
  cloudinary.config({
    cloud_name: "diu9rddtm",
    api_key: "842122296482341",
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
  });

  console.log(`req.file.path: ${req.file.path}`);
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(req.file.path)
    .catch((error) => {
      console.log(error);
    });

  console.log(`uploadResult: `, uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);

  req.file.url = uploadResult.secure_url;
  next();
};
