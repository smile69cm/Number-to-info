export default async function handler(req, res) {
    // 1. Get the number from the request URL
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({ error: "Mobile number is required" });
    }

    // 2. The target URL (Vercel's servers will fetch this securely)
    const targetUrl = `https://ayaanmods.site/number.php?key=annonymous&number=${number}`;

    try {
        // 3. Fetch the data
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 4. Send the data back to your frontend
        return res.status(200).json(data);
        
    } catch (error) {
        console.error("Vercel Server Error:", error);
        return res.status(500).json({ error: "Failed to fetch data from the provider." });
    }
}
