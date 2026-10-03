import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddings } from "../embeddings/embeddings";
import { splitDocument } from "../ingestion/splitter";
import "dotenv/config";

// Create a client to connect to Qdrant Cloud
const client = new QdrantClient({
  url: process.env.QUADRANT_CLUSTER_ENDPOINT!,
  apiKey: process.env.QUADRANT_API_KEY!,
});

// Create the collection only if it does not already exist
async function ensureCollection() {
  const exists = await client.collectionExists("rag-documents");

  if (!exists) {
    await client.createCollection("rag-documents", {
      vectors: {
        size: 3072,
        distance: "Cosine",
      },
    });
    console.log("Collection created");
  } else {
    console.log("Collection already exists");
  }
}

async function storeDocuments() {
  //Make sure the Qdrant collection exists before inserting data
  await ensureCollection();

  //Load the PDF and split it into smaller chunks
  const chunks = await splitDocument();

  //Extract the text from each document chunk
  const texts = chunks.map((chunk) => chunk.pageContent);

  // Convert all document chunks into embedding vectors using Gemini
  const vectors = await embeddings.embedDocuments(texts);

  // Combine each vector with its original text and metadata
  const points = chunks.map((chunk, index) => ({
    id: index,
    vector: vectors[index],
    payload: {
      text: chunk.pageContent,
      metadata: chunk.metadata,
    },
  }));

  // Store the vectors and metadata in Qdrant
  await client.upsert("rag-documents", {
    points,
  });

  console.log(`Stored ${points.length} chunks in Qdrant`);
}

// Start the process
storeDocuments();