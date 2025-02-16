"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PreviewPage() {
    const router = useRouter();
    const [generatedImage, setGeneratedImage] = useState(null);

    useEffect(() => {
        // Get the generated image from localStorage
        const savedImage = localStorage.getItem('generatedImage');
        if (!savedImage) {
            // If no image found, redirect back to generate page
            router.push('/generate');
            return;
        }
        setGeneratedImage(savedImage);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Preview Your Avatar</h1>

            {generatedImage ? (
                <div className="space-y-8">
                    {/* Generated Avatar */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Your Generated Avatar</h2>
                        <img
                            src={generatedImage}
                            alt="Generated Avatar"
                            className="max-w-xs rounded-lg shadow-md"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/generate')}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                            Generate New Avatar
                        </button>
                        <button
                            onClick={() => {
                                // Add checkout logic here
                                alert('Proceeding to checkout...');
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}