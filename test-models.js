import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

    if (match && match[1]) {
        const apiKey = match[1].trim();
        console.log("Found API Key:", apiKey.substring(0, 5) + "...");

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log("Fetching models from:", url);

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("\nAvailable Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.error("Error listing models:", data);
        }
    } else {
        console.error("Could not find VITE_GEMINI_API_KEY in .env");
    }
} catch (err) {
    console.error("Error reading .env or fetching models:", err);
}
