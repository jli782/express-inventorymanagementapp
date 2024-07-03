// Require the cloudinary library
const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
require("dotenv").config();

exports.imageHandler = asyncHandler(async (req, res, next) => {
  // Configuration
  cloudinary.config({
    cloud_name: "diu9rddtm",
    api_key: "842122296482341",
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
  });

  if (req.file) {
    console.log(`req.file.path: ${req.file.path}`);
    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(req.file.path)
      .catch((error) => {
        console.log(error);
      });

    console.log(`uploadResult: `, uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
      width: 300,
    });

    console.log(`optimizeUrl: `, optimizeUrl);

    // Transform the image: auto-crop to square aspect_ratio
    /*     const autoCropUrl = cloudinary.url("shoes", {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    }); 

    console.log(autoCropUrl);*/

    req.file.url = optimizeUrl; //uploadResult.secure_url;
  }
  next();
});
