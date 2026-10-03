import { generateAnswer } from "./generation/llm";
import { retrieveDocuments } from "./retrieval/retriever";

async function rag(userQuery: string) {
    const points = await retrieveDocuments(userQuery);

    const response = await generateAnswer(userQuery, points);

    return response;
}

async function main() {
    const userQuery = "What are the skills of this resume?";
    const answer = await rag(userQuery);
    console.log(answer);
}

main();

