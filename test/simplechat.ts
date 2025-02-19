import fetch from "node-fetch";
import readline from "readline";

interface Message {
  role: string;
  content: string;
}

// Array to store chat history
const messages: Message[] = [];

// Initialize readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to interact with the Ollama API
async function chat(messages: Message[]): Promise<Message> {
  const body = {
    model: "deepseek-r1:1.5b", // Replace with your desired model name
    messages: messages,
  };

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.body) {
    throw new Error("Failed to read response body");
  }

  let content = "";
  for await (const chunk of response.body) {
    const rawjson = chunk.toString();
    const json = JSON.parse(rawjson);

    if (json.done === false) {
      process.stdout.write(json.message.content);
      content += json.message.content;
    }
  }

  return { role: "assistant", content };
}

// Recursive function to handle user input and responses
async function askQuestion(): Promise<void> {
  return new Promise((resolve) => {
    rl.question("\n\nAsk a question: (press enter alone to quit)\n\n", async (user_input) => {
      if (user_input.trim() === "") {
        rl.close();
        console.log("Thank you. Goodbye.\n\n");
        console.log("Here is the message history that was used in this conversation:");
        messages.forEach((message) => console.log(message));
        resolve();
      } else {
        console.log(`You asked: ${user_input}`);
        messages.push({ role: "user", content: user_input });
        messages.push(await chat(messages)); // Get assistant's response
        await askQuestion(); // Continue conversation
      }
    });
  });
}

// Main function to start the chat app
async function main() {
  console.log("Welcome to the simple chat app!");
  await askQuestion();
}

main().catch((error) => console.error(error));

// to start use command
// tsx simplechat.ts