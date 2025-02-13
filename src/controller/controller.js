import express from "express";

const uploadImage = async (req, res) => {
  try {
    const { imgUrl } = req.body;
    console.log("Received image URL:", imgUrl);


    res.status(200).json({
      success: true,
      message: "Image URL saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the image",
    });
  }
};

export default uploadImage;
