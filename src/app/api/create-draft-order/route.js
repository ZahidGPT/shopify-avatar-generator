export async function POST(req) {
    try {
        const { productId, variantId, customImage } = await req.json();

        // For now, we'll create a simple cart URL
        // Later, we can integrate with Shopify's Draft Order API
        const cartUrl = `https://premiumjewelrygift.myshopify.com/cart/${variantId}:1?attributes[Custom Image]=${encodeURIComponent(customImage)}`;

        return new Response(JSON.stringify({ 
            checkoutUrl: cartUrl
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Draft order error:", error);
        return new Response(JSON.stringify({ 
            error: error.message || "Failed to create order"
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
