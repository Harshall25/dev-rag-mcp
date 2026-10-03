import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CouchbaseDocumentLoader } from "@langchain/community/document_loaders/web/couchbase";
import { loadDocuments } from "./loader";
import { Socket } from "node:dgram";

export async function splitDocument(){
    
    const docs = await  loadDocuments();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap : 200
    });
    const chunks = await splitter.splitDocuments(docs);
    return chunks;
}

