import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: "No user image provided" }), { status: 400 });
    }

    const avatarImage = "https://replicate.delivery/pbxt/MT8BpvahV4TDIunSeLb2OEY7PI8NS3O34gajgGuIRAKf9bzN/il_1588xN.6451848706_f1ym.webp";

    // Start the prediction
    const prediction = await replicate.predictions.create({
      version: "278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34",
      input: {
        swap_image: image,
        input_image: avatarImage,
      },
    });

    // Wait for the prediction to complete
    let finalPrediction = await replicate.predictions.get(prediction.id);

    // Keep polling until the prediction is complete
    while (finalPrediction.status !== "succeeded" && finalPrediction.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      finalPrediction = await replicate.predictions.get(prediction.id);
      console.log("Prediction status:", finalPrediction.status);
    }

    if (finalPrediction.status === "failed") {
      throw new Error("Face swap generation failed");
    }

    console.log("Final prediction:", finalPrediction);

    return new Response(JSON.stringify({ 
      generatedImage: finalPrediction.output,
      status: finalPrediction.status
    }), { status: 200 });

  } catch (error) {
    console.error("Face swap error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to generate avatar",
      details: error
    }), { status: 500 });
  }
}

const generateAvatar = async () => {
    try {
        const response = await fetch("/api/generate-avatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: uploadedImage,
            }),
        });
    
        const data = await response.json();
        console.log("API Response:", data); // Add this debug line
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Handle different response formats
        if (typeof data.generatedImage === 'string') {
            setGeneratedImage(data.generatedImage);
        } else if (Array.isArray(data.generatedImage)) {
            setGeneratedImage(data.generatedImage[0]);
        } else {
            console.error("Raw response data:", data);
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Error generating avatar:", error);
        alert(error.message || "Error generating image!");
    }
};