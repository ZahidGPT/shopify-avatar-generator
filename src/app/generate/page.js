"use client";

import { useState } from "react";

export default function GenerateAvatar() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState({
        id: 1,
        category: "Historical Emperor",
        name: "Professional Emperor Avatar",
        url: "https://replicate.delivery/pbxt/MT8BpvahV4TDIunSeLb2OEY7PI8NS3O34gajgGuIRAKf9bzN/il_1588xN.6451848706_f1ym.webp",
        description: "Transform yourself into a historical emperor style portrait"
    });

    // Updated avatar options with categories
    const avatarOptions = [
        {
            id: 1,
            category: "Historical Emperor",
            name: "Professional Emperor Avatar",
            url: "https://replicate.delivery/pbxt/MT8BpvahV4TDIunSeLb2OEY7PI8NS3O34gajgGuIRAKf9bzN/il_1588xN.6451848706_f1ym.webp",
            description: "Transform yourself into a historical emperor style portrait"
        }
        // Add more avatars here in the future
    ];

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
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Avatar Selection Section */}
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            1. Select Avatar Style
                        </h2>
                        
                        {/* Dropdown and Preview Container */}
                        <div className="space-y-6">
                            {/* Dropdown Selection */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Choose Style Category
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:ring-blue-500 focus:border-blue-500 
                                        bg-white text-gray-900 font-medium"
                                    value={selectedAvatar.id}
                                    onChange={(e) => {
                                        const selected = avatarOptions.find(
                                            avatar => avatar.id === parseInt(e.target.value)
                                        );
                                        setSelectedAvatar(selected);
                                    }}
                                >
                                    {avatarOptions.map((avatar) => (
                                        <option 
                                            key={avatar.id} 
                                            value={avatar.id}
                                            className="text-gray-900 bg-white"
                                        >
                                            {avatar.category} - {avatar.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Large Preview of Selected Avatar */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {selectedAvatar.category}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {selectedAvatar.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Larger Image Preview */}
                                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-white shadow-inner">
                                        <img
                                            src={selectedAvatar.url}
                                            alt={selectedAvatar.name}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="mb-12 border-t pt-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            2. Upload Your Photo
                        </h2>
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section - Modified for larger previews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {uploadedImage && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-gray-900">Your Photo</h3>
                                <div className="mt-4">
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded"
                                        className="max-w-xs rounded-lg shadow-md"
                                        width={300}
                                        height={300}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {generatedImage && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-gray-900">Generated Avatar</h3>
                                <div className="mt-8">
                                    <img
                                        src={generatedImage}
                                        alt="Generated Avatar"
                                        className="max-w-xs rounded-lg shadow-md"
                                        width={300}
                                        height={300}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Button and Messages */}
                    <div className="flex flex-col items-center">
                        <button
                            onClick={generateAvatar}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white font-bold"
                        >
                            {isLoading ? "Generating..." : "Generate Avatar"}
                        </button>

                        {isLoading && <div>Please wait, generating your avatar...</div>}

                        {progress && <div className="text-sm text-gray-600">{progress}</div>}

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
                </div>
            </div>
        </div>
    );
}
