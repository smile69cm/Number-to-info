export default async function handler(req, res) {
    // 1. Get the number from the request URL
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({ error: "Mobile number is required" });
    }

    // 2. The target URL
    const targetUrl = `https://ayaanmods.site/number.php?key=annonymous&number=${number}`;

    try {
        // 3. Fetch the data from the provider
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        // 4. Parse the JSON data
        let data = await response.json();
        
        // 5. CLEAN UP: Delete the promotional fields so no one sees them
        delete data.channel_name;
        delete data.link;
        delete data.app_developer;
        delete data.developer; // Added just in case
        delete data.telegram;  // Added just in case
        
        // 6. Send the clean data back to your frontend
        return res.status(200).json(data);
        
    } catch (error) {
        console.error("Vercel Server Error:", error);
        return res.status(500).json({ error: "Failed to fetch data from the provider." });
    }
}
