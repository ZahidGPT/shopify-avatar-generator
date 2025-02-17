import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const config = {
  maxDuration: 300  // 5 minutes
};

export async function POST(req) {
  try {
    console.log("Starting avatar generation...");
    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: "No user image provided" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const prediction = await replicate.predictions.create({
      version: "278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34",
      input: {
        swap_image: image,
        input_image: "https://replicate.delivery/pbxt/MT8BpvahV4TDIunSeLb2OEY7PI8NS3O34gajgGuIRAKf9bzN/il_1588xN.6451848706_f1ym.webp",
      }
    });

    console.log("Prediction created:", prediction.id);

    // Increase timeout and polling interval
    const maxAttempts = 60;  // 2 minutes total with 2-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      const finalPrediction = await replicate.predictions.get(prediction.id);
      console.log(`Attempt ${attempts + 1}: Status ${finalPrediction.status}`);

      if (finalPrediction.status === "succeeded") {
        return new Response(JSON.stringify({ 
          generatedImage: finalPrediction.output[0],
          status: "succeeded"
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (finalPrediction.status === "failed") {
        throw new Error("Face swap generation failed");
      }

      // Wait for 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error("Generation timed out - please try again");

  } catch (error) {
    console.error("Error details:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to generate avatar",
      details: error.toString()
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}