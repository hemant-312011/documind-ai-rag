# DocuMind AI RAG

DocuMind is a full-stack Retrieval-Augmented Generation application that allows users to upload PDF documents and ask natural-language questions about their content.

The application retrieves relevant document sections, sends the retrieved context to an AI model, and returns grounded answers with file-name and page-level source citations.

---

## Project Preview

DocuMind provides a clean and responsive interface for:

- Uploading multiple PDF documents
- Managing the document knowledge base
- Creating vector embeddings
- Performing semantic document retrieval
- Asking questions about uploaded documents
- Generating grounded AI answers
- Displaying document and page citations
- Switching between light and dark themes

---

## Features

- Multi-PDF upload support
- Drag-and-drop PDF upload
- Document library management
- Delete individual documents
- Clear all uploaded documents
- PDF text extraction
- Recursive text chunking
- Local embeddings using Ollama
- In-memory vector storage
- Semantic similarity search
- Retrieval-Augmented Generation
- Groq-powered AI responses
- Page-level source citations
- Hallucination-control prompt
- Automatic index rebuilding
- Responsive user interface
- Light and dark mode
- Copy AI responses
- Error and loading states

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express.js
- Multer
- CORS
- Dotenv

### AI and RAG

- LangChain.js
- Groq
- Ollama
- `nomic-embed-text`
- MemoryVectorStore
- PDFLoader
- RecursiveCharacterTextSplitter

---

## How It Works

```text
PDF Upload
    ↓
PDF Text Extraction
    ↓
Document Chunking
    ↓
Ollama Embeddings
    ↓
Memory Vector Store
    ↓
Semantic Retriever
    ↓
Relevant Document Context
    ↓
Groq Large Language Model
    ↓
Grounded Answer with Citations