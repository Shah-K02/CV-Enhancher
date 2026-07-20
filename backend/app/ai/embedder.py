import random
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from app.config import get_settings

settings = get_settings()

class CVEmbedder:
    def __init__(self):
        self.mock_mode = settings.mock_ai_mode
        if not self.mock_mode:
            self.client = OpenAIEmbeddings(model="text-embedding-3-small", api_key=settings.openai_api_key)
    
    def chunk_text(self, text: str) -> list[str]:
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        return splitter.split_text(text)
        
    def embed_chunks(self, chunks: list[str]) -> list[list[float]]:
        if self.mock_mode:
            return [self._mock_embedding() for _ in chunks]
        return self.client.embed_documents(chunks)
    
    def _mock_embedding(self) -> list[float]:
        return [random.gauss(0, 0.1) for _ in range(1536)]
