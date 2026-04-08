export default async function handler(req, res) {
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({ error: "Mobile number is required" });
    }

    const targetUrl = `https://ayaanmods.site/number.php?key=annonymous&number=${number}`;
    const maxRetries = 3; // It will try up to 3 times if it gets a fake "Not found"

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(targetUrl);
            
            if (!response.ok) {
                if (attempt === maxRetries) throw new Error(`API responded with status: ${response.status}`);
                continue; // Skip to the next attempt
            }
            
            let data = await response.json();
            
            // Check if the API sent a fake "Not Found" (0 records)
            if ((!data.result || data.result.length === 0) && attempt < maxRetries) {
                // Wait for half a second before trying again so we don't overwhelm it
                await new Promise(resolve => setTimeout(resolve, 500));
                continue; 
            }
            
            // Clean up the junk data
            delete data.channel_name;
            delete data.channel_link;
            delete data.app_developer;
            delete data.developer;
            delete data.telegram;
            
            // Send the data back
            return res.status(200).json(data);
            
        } catch (error) {
            if (attempt === maxRetries) {
                console.error("Vercel Server Error:", error);
                return res.status(500).json({ error: "Failed to fetch data from the provider after 3 attempts." });
            }
        }
    }
}
