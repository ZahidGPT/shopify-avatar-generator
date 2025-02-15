"use client";

import { useState } from "react";

export default function GenerateAvatar() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState(null);

    const avatarImage = "/avatar.webp";  // Avatar stored in public folder

    // Handle user image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Call API to generate face swap image
    const generateAvatar = async () => {
        try {
            setIsLoading(true);
            setProgress('Uploading image...');
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
            console.log("Complete API Response:", JSON.stringify(data, null, 2));
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            if (!data.generatedImage) {
                throw new Error("No generated image in response");
            }

            // Handle array or single string output
            const imageUrl = Array.isArray(data.generatedImage) 
                ? data.generatedImage[0] 
                : data.generatedImage;
            
            setGeneratedImage(imageUrl);
            setProgress('Generating avatar...');
        } catch (error) {
            console.error("Error generating avatar:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
            setProgress('Complete!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-4">Generate Your AI Avatar</h1>

            <div className="mb-4">
                <h3 className="text-lg">Avatar Image</h3>
                <img src={avatarImage} alt="Avatar" className="w-32 h-32 rounded-full border-2 border-white" />
            </div>

            <div className="mb-4">
                <h3 className="text-lg">Upload Your Image</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="bg-gray-700 p-2 rounded" />
            </div>

            <button
                onClick={generateAvatar}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white font-bold"
            >
                {isLoading ? "Generating..." : "Generate Avatar"}
            </button>

            {isLoading && <div>Please wait, generating your avatar...</div>}

            {progress && <div className="text-sm text-gray-600">{progress}</div>}

            {/* Show uploaded image preview */}
            {uploadedImage && (
                <div className="mt-6">
                    <h3 className="text-lg">Uploaded Image:</h3>
                    <img src={uploadedImage} alt="Uploaded" className="w-40 h-40 rounded-full border-2 border-white" />
                </div>
            )}
            
            {/* Show generated image */}
            {generatedImage && (
                <div className="mt-6">
                    <h3 className="text-lg">Generated Avatar:</h3>
                    <img src={generatedImage} alt="Generated Avatar" className="w-40 h-40 rounded-full border-2 border-white" />
                    <a href={`/customize?image=${generatedImage}`} className="block mt-2">
                        <button className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white font-bold">
                            Proceed to Product Selection
                        </button>
                    </a>
                </div>
            )}

            {error && (
                <div className="text-red-500">
                    {error}
                    <button 
                        onClick={() => {
                            setError(null);
                            generateAvatar();
                        }}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}
