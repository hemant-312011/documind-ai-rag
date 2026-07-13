import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function loadPdfDocument(filePath) {
  const loader = new PDFLoader(filePath);

  const docs = await loader.load();

  return docs;
}
