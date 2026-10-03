import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

//create gemini llm
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY
});

//generate answer using the retrieved documents
export async function generateAnswer(query : String, documents: any[]){
    //exact original text retrieved from vector db
    const context = documents
    .map((doc) => doc.payload?.text ?? "")
    .join("\n\n");

    //prompt containing context + users query
    const prompt = `
        You are a helpful assistant.

        Answer the user's question using only the provided context.

        If the answer cannot be found in the context, say:
        "I don't know based on the provided documents."

        Context:
            ${context}

        Question:
            ${query}
    `;

    const response = await llm.invoke(prompt);

    return response.content;
}