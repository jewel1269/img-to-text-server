import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(
  { model: 'gemini-1.5-vision' },
  { apiVersion: 'v1' }
);

const uploadImage = async (req, res) => {
  try {
    const { imgUrl } = req.body;

    if (!imgUrl) {
      return res
        .status(400)
        .json({ success: false, message: 'Image URL is required' });
    }

    console.log('Received image URL:', imgUrl);

    const result = await model.generateContent([
      { text: 'Extract text from this image:' },
      { inline_data: { mime_type: 'image/jpeg', url: imgUrl } },
    ]);
    const extractedText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No text found';

    res.status(200).json({
      success: true,
      message: 'Image processed successfully',
      extractedText,
    });
    console.log(extractedText);
  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the image',
    });
  }
};

export default uploadImage;
