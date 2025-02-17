"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
 
export default function PreviewPage() {
    const router = useRouter();
    const [generatedImage, setGeneratedImage] = useState(null);
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        // Get both the generated image and product details from localStorage
        const savedImage = localStorage.getItem('generatedImage');
        const savedProduct = localStorage.getItem('selectedProduct');
        
        console.log('Saved Image:', savedImage);
        console.log('Saved Product:', savedProduct);
        
        if (savedImage) {
            setGeneratedImage(savedImage);
        }
        
        if (savedProduct) {
            try {
                const parsedProduct = JSON.parse(savedProduct);
                console.log('Parsed Product Details:', parsedProduct);
                setProductDetails(parsedProduct);
            } catch (error) {
                console.error('Error parsing product details:', error);
            }
        }
    }, []);

    const handleCheckout = () => {
        console.log('Handling checkout...');
        console.log('Product Details:', productDetails);
        console.log('Generated Image:', generatedImage);

        if (productDetails && productDetails.variantId && generatedImage) {
            const checkoutUrl = `https://premiumjewelrygift.myshopify.com/cart/${productDetails.variantId}:1?attributes[Custom_Image]=${encodeURIComponent(generatedImage)}`;
            console.log('Redirecting to:', checkoutUrl);
            window.location.href = checkoutUrl;
        } else {
            console.error('Missing required data:');
            console.log('Product Details:', productDetails);
            console.log('Generated Image:', generatedImage);
        }
    };

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

                    {/* Debug Info - Remove this in production */}
                    <div className="text-sm text-gray-500">
                        <p>Product ID: {productDetails?.productId}</p>
                        <p>Variant ID: {productDetails?.variantId}</p>
                        <p>Title: {productDetails?.title}</p>
                        <p>Price: ${productDetails?.price}</p>
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
                            onClick={handleCheckout}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}