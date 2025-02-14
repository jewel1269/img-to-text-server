import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.GEMINI_API_KEY;
console.log(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
});

const fetchImageAsBase64 = async (imgUrl) => {
  try {
    const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary").toString("base64");
  } catch (error) {
    console.error("Error fetching image:", error.message);
    return null;
  }
};

const uploadImage = async (req, res) => {
  try {
    const { imgUrl } = req.body;

    if (!imgUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Image URL is required" });
    }

    console.log("Received image URL:", imgUrl);

    // Convert image to base64
    const base64Image = await fetchImageAsBase64(imgUrl);
    if (!base64Image) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to fetch image" });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: base64Image } },
            { text: "Extract text from this image:" },
          ],
        },
      ],
    });

    console.log("API Response:", result);

    const extractedText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No text found";

    res.status(200).json({
      success: true,
      message: "Image processed successfully",
      extractedText,
    });

    console.log("Extracted Text:", extractedText);
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the image",
    });
  }
};

export default uploadImage;
