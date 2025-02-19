/**
 * This script demonstrates how to use Ollama (an AI model for managing chat sessions) from "ollama" npm package in TypeScript.
 * It creates an instance of this tool and sets up an async function to use Ollama's chat method,
 * providing multiple messages for processing in real-time, then outputs them one at a time on console using process.stdout.write().
 */
import { Ollama } from "ollama";

const ollama = new Ollama();

(async () => {
    try {
        const responses = await ollama.chat({
            model: "deepseek-r1:1.5b",
            messages: [
                { role: "system", content: "You are a helpful artificial intelligence assistant" }
            ],
            stream: true
        });

        if (responses) {
            for await (const r of responses) {
                process.stdout.write(r?.message?.content || '');
            }
            console.log('\nFinished processing responses');
        } else {
            console.log('No responses received');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
