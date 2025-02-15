require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/generate-avatar", upload.single("image"), async (req, res) => {
    try {
        const userImage = req.file.path;
        const avatarUrl = req.body.avatarUrl;

        // Call Replicate API for face swap
        const response = await axios.post(
            "https://api.replicate.com/v1/predictions",
            {
                version: "278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34",
                input: {
                    swap_image: avatarUrl,
                    input_image: userImage
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ generatedImage: response.data.output });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Image generation failed" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
