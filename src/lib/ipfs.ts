import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: "your-gateway.mypinata.cloud", // Optional
});

export async function uploadMoodToIPFS(
  image: Blob,
  moodType: string,
  title: string,
  caption: string,
  timestamp: number
) {
  try {
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error("Pinata JWT missing - please set NEXT_PUBLIC_PINATA_JWT");
    }

    console.log("Uploading image to Pinata...");

    // Upload image using SDK - CORRECTED: use pinata.upload.public.file()
    const imageFile = new File([image], `${moodType}-${timestamp}.png`, {
      type: "image/png",
    });

    const imageUpload = await pinata.upload.public.file(imageFile);
    console.log("Image uploaded:", imageUpload);

    const imageUri = `ipfs://${imageUpload.cid}`;

    // Create metadata
    const metadata = {
      name: title,
      description: caption,
      image: imageUri,
      attributes: [
        { trait_type: "Mood", value: moodType },
        { trait_type: "Title", value: title },
        { trait_type: "Timestamp", value: timestamp.toString() },
      ],
    };

    console.log("Uploading metadata to Pinata...");

    // Upload metadata using SDK - CORRECTED: use pinata.upload.public.json()
    const metadataUpload = await pinata.upload.public.json(metadata);
    console.log("Metadata uploaded:", metadataUpload);

    return `ipfs://${metadataUpload.cid}`;
  } catch (error) {
    console.error("Pinata upload failed:", error);
    throw error;
  }
}
