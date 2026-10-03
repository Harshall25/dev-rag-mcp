import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

//pdf loader loads the pds 

export async function loadDocuments() {
  const loader = new PDFLoader("documents/Harshal_FDE_OCT.pdf");
  return await loader.load();
}
 
