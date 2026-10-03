import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddings } from "../embeddings/embeddings";
import "dotenv/config";

// Connect to Qdrant Cloud
const client = new QdrantClient({
  url: process.env.QUADRANT_CLUSTER_ENDPOINT!,
  apiKey: process.env.QUADRANT_API_KEY!,
});

export async function retrieveDocuments(query: string) {
  // Convert the user's question into an embedding vector
  const queryVector = await embeddings.embedQuery(query);

  // Search Qdrant for the most similar document chunks
  const results = await client.query("rag-documents", {
    query: queryVector,
    limit: 3,
    with_payload: true,
  });

  // Display the retrieved chunks
  return results.points;
}

// Test the retriever
retrieveDocuments("Project in document?");