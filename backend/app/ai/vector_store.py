import os
import pickle
from pathlib import Path
import numpy as np
import faiss
from app.config import get_settings

settings = get_settings()

class CVVectorStore:
    def __init__(self):
        self.faiss_dir = Path(settings.faiss_dir)
        self.faiss_dir.mkdir(parents=True, exist_ok=True)
    
    def _index_path(self, user_id: str, cv_id: str) -> Path:
        return self.faiss_dir / f"{user_id}_{cv_id}.index"
        
    def _chunks_path(self, user_id: str, cv_id: str) -> Path:
        return self.faiss_dir / f"{user_id}_{cv_id}_chunks.pkl"
    
    def build_index(self, user_id: str, cv_id: str, chunks: list[str], embeddings: list[list[float]]) -> None:
        if not embeddings:
            return
            
        dim = len(embeddings[0])
        index = faiss.IndexFlatL2(dim)
        
        vectors = np.array(embeddings).astype('float32')
        index.add(vectors)
        
        faiss.write_index(index, str(self._index_path(user_id, cv_id)))
        
        with open(self._chunks_path(user_id, cv_id), "wb") as f:
            pickle.dump(chunks, f)
        
    def similarity_search(self, user_id: str, cv_id: str, query_embedding: list[float], k: int = 5) -> list[str]:
        if not self.index_exists(user_id, cv_id):
            return []
            
        index = faiss.read_index(str(self._index_path(user_id, cv_id)))
        with open(self._chunks_path(user_id, cv_id), "rb") as f:
            chunks = pickle.load(f)
            
        query_vec = np.array([query_embedding]).astype('float32')
        distances, indices = index.search(query_vec, k)
        
        results = []
        for idx in indices[0]:
            if idx < len(chunks):
                results.append(chunks[idx])
        return results
        
    def index_exists(self, user_id: str, cv_id: str) -> bool:
        return self._index_path(user_id, cv_id).exists() and self._chunks_path(user_id, cv_id).exists()
    
    def delete_index(self, user_id: str, cv_id: str) -> None:
        idx_path = self._index_path(user_id, cv_id)
        chk_path = self._chunks_path(user_id, cv_id)
        if idx_path.exists():
            os.remove(idx_path)
        if chk_path.exists():
            os.remove(chk_path)
