// export async function generateMoodImage(prompt: string): Promise<Blob> {
//   try {
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//         body: JSON.stringify({
//           inputs: prompt,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Hugging Face API error: ${response.status} - ${response.statusText}`
//       );
//     }

//     // Handle binary image response
//     const blob = await response.blob();
//     if (blob.type !== "image/png" && blob.type !== "image/jpeg") {
//       throw new Error(`Unexpected response type: ${blob.type}`);
//     }

//     return blob;
//   } catch (error) {
//     console.error("generateMoodImage failed:", error);
//     throw error;
//   }
// }

// THE ABOVE IS VERY STABLE
import { InferenceClient } from "@huggingface/inference";

// Initialize Hugging Face Inference Client
const client = new InferenceClient(
  process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || ""
);

// Generate AI-based review
export async function generateAIReview(
  moodCounts: { [key: string]: number },
  period: "weekly" | "monthly"
): Promise<string> {
  try {
    const prompt = `You are a friendly mood coach. Based on these mood counts for the past ${period}: ${JSON.stringify(
      moodCounts
    )}, write a short, positive review (max 50 words). If most moods are positive, congratulate and encourage consistency. If mostly negative, give a short uplifting suggestion to improve the next ${period}.`;

    const response = await client.textGeneration({
      model: "tiiuae/falcon-7b-instruct",
      inputs: prompt,
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    return (
      response.generated_text?.trim() ||
      "A balanced week! Keep expressing yourself!"
    );
  } catch (error) {
    console.error("AI review generation failed:", error);
    return "A balanced week! Keep expressing yourself!";
  }
}

// Existing image generation function
export async function generateMoodImage(prompt: string): Promise<Blob> {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Hugging Face API error: ${response.status} - ${response.statusText}`
      );
    }

    const blob = await response.blob();
    if (blob.type !== "image/png" && blob.type !== "image/jpeg") {
      throw new Error(`Unexpected response type: ${blob.type}`);
    }

    return blob;
  } catch (error) {
    console.error("generateMoodImage failed:", error);
    throw error;
  }
}
