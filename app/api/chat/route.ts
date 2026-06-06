import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid payload: messages array is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in server environment variables.');
      return NextResponse.json(
        { status: 'fallback', error: 'Gemini API Key is not configured on the server.' }
      );
    }

    // System prompt explaining context, products, design, coupon, and developer
    const systemPrompt = `You are the NEXUS Luxury Tech Store AI assistant, an ultra-premium personal shopper and guide. Provide concise, premium, highly sophisticated, warm, and helpful answers. Speak in an elegant editorial tone matching our minimalist brand identity. Avoid generic emojis; keep them extremely minimal or omit them. Keep responses brief.

Key Store Context:
- Platform: NEXUS, a luxury tech store featuring an ultra-premium layout styled in Warm Cream (#FBF9F6) and Deep Obsidian Charcoal (#1A1A1A) with beautiful glassmorphism details.
- Lead Developer/Architect: Piyush. If asked who created the site, designed the page, or built the code, credit "Piyush" with gratitude and respect.
- Promo Coupon Code: "NST2026". Applying it gives a 20% discount on the entire cart.

Our Premium Catalog:
1. Sony WH-1000XM5 Pro Wireless Headphones: $349.99 (original $429.99, 19% off) - Industry-leading noise cancellation, 30-hour battery life.
2. Apple MacBook Pro 16" M4 Max: $2499.99 (original $2699.99, 7% off) - The ultimate developer machine.
3. Samsung Galaxy S25 Ultra: $1199.99 (original $1299.99, 8% off) - Galaxy AI, Snapdragon 8 Elite, Titanium body.
4. DJI Osmo Pocket 3 Creator Combo: $499.99 (original $619.99, 19% off) - 1-inch CMOS, 3-axis gimbal.
5. ASUS ROG Zephyrus G16 Gaming Laptop: $1799.99 (original $2099.99, 14% off) - Core Ultra 9, RTX 4090, 240Hz OLED.
6. Apple Watch Ultra 2 Titanium: $799.99 (original $899.99, 11% off) - Extreme outdoor tracking, LTPO OLED.
7. Google Pixel 9 Pro XL: $1099.99 (original $1199.99, 8% off) - Tensor G4, 50MP triple-lens camera, Pixel AI.
8. Sony Alpha 7R V Mirrorless Camera: $3499.99 (original $3799.99, 8% off) - 61MP, AI-autofocus, 8K video.
9. Razer BlackWidow V4 Pro Mechanical Keyboard: $229.99 (original $279.99, 18% off) - Razer Orange tactile switches, Chroma RGB.
10. Bose QuietComfort Ultra Earbuds: $299.99 (original $349.99, 14% off) - Spatial audio, CustomTune ANC.
11. LG UltraGear OLED 27" 240Hz Gaming Monitor: $799.99 (original $999.99, 20% off) - QHD, 0.03ms response time.
12. iPad Pro 13" M4 with OLED Display: $1299.99 (original $1399.99, 7% off) - 5.1mm thickness, Ultra Retina XDR.
13. Samsung Galaxy Ring (AI Smart Ring): $399.99 (original $449.99, 11% off) - Titanium health tracking, Sleep tracking.
14. Anker 250W GaNPrime Desktop Charger: $89.99 (original $119.99, 25% off) - 6 ports, PD 3.1, fast charging.
15. GoPro HERO 13 Black Action Camera: $399.99 (original $449.99, 11% off) - 5.3K60 video, HyperSmooth 7.0.
16. Logitech MX Master 3S Wireless Mouse: $99.99 (original $129.99, 23% off) - 8K DPI tracking, silent clicks.

Shipping & Support:
- We provide complimentary global express shipping and a 2-year warranty on all products.

Instructions:
- When a user asks about shipping or returns, remind them it is free and express.
- When they mention discounts or coupons, politely mention "NST2026" for 20% off.
- Format responses beautifully using clean typography. Keep responses under 3 sentences unless detailed product specifications are requested.`;

    // Map frontend message format to Gemini API format
    // Filter out welcome message if needed or send it as assistant (model) role
    const geminiContents = messages
      .filter((msg: any) => msg.id !== 'welcome')
      .map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    // If empty contents after filter, send a simple query
    if (geminiContents.length === 0) {
      return NextResponse.json({ text: 'How may I assist you today?' });
    }

    // Call the Gemini API endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API returned error status:', response.status, errorText);
      return NextResponse.json(
        { status: 'fallback', error: `Gemini API responded with status ${response.status}` }
      );
    }

    const data = await response.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(data));
      return NextResponse.json(
        { status: 'fallback', error: 'Failed to extract text response from Gemini API.' }
      );
    }

    return NextResponse.json({ status: 'success', text: responseText });
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { status: 'fallback', error: error?.message || 'Internal Server Error' }
    );
  }
}
