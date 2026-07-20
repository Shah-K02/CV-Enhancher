from langchain_openai import ChatOpenAI
from app.config import get_settings
from app.ai.embedder import CVEmbedder
from app.ai.vector_store import CVVectorStore
from app.models.chat_history import ChatHistory

settings = get_settings()

class CVChatbot:
    def __init__(self):
        self.mock_mode = settings.mock_ai_mode
        if not self.mock_mode:
            self.llm = ChatOpenAI(model="gpt-4o-mini", api_key=settings.openai_api_key)
        self.embedder = CVEmbedder()
        self.vector_store = CVVectorStore()

    async def get_response(self, query: str, user_id: str, cv_id: str, history: list[ChatHistory]) -> str:
        if self.mock_mode:
            q = query.lower()
            if "experience" in q:
                return "Your experience section highlights 3 major roles. You could improve it by adding more quantified achievements."
            elif "skills" in q:
                return "You have listed Python and SQL. Consider adding any cloud tools (AWS, GCP) you've worked with."
            elif "rewrite" in q or "improve" in q:
                return "Here is a better version of that bullet point: 'Spearheaded backend development using FastAPI, increasing system performance by 30%.'"
            else:
                return "I'm your AI CV Assistant. I can help you rewrite bullet points, identify missing skills, or match your CV to a job description. How can I help?"
                
        # Real Mode
        query_emb = self.embedder.embed_chunks([query])[0]
        context_chunks = self.vector_store.similarity_search(user_id, cv_id, query_emb)
        context = "\n".join(context_chunks)
        
        messages = [{"role": "system", "content": "You are a helpful AI assistant helping the user improve their CV based on the provided context.\nContext:\n" + context}]
        for msg in history[-5:]: # Last 5 messages
            messages.append({"role": msg.role, "content": msg.content})
            
        messages.append({"role": "user", "content": query})
        
        response = self.llm.invoke(messages)
        return response.content
