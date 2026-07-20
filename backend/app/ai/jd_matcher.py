from langchain_openai import ChatOpenAI
from app.config import get_settings
from app.schemas.analysis import JDMatchResponse

settings = get_settings()

MOCK_JD_MATCH = JDMatchResponse(
    match_score=58,
    missing_keywords=["Kubernetes", "CI/CD", "microservices", "REST APIs", "Agile/Scrum", "unit testing"],
    recommendations=[
        "Add your experience with REST API development to the experience section",
        "Mention any CI/CD pipelines you've used (GitHub Actions, Jenkins, etc.)",
        "Include team collaboration and Agile methodology experience",
        "Add a projects section showcasing relevant technical work"
    ],
    tailoring_summary="Your CV has a solid technical foundation but is missing several keywords that ATS systems will scan for this role. Focus on adding specific tools mentioned in the job description and quantifying your impact in previous roles."
)

class JDMatcher:
    def __init__(self):
        self.mock_mode = settings.mock_ai_mode
        if not self.mock_mode:
            self.llm = ChatOpenAI(model="gpt-4o", api_key=settings.openai_api_key)

    async def match(self, cv_text: str, jd_text: str) -> JDMatchResponse:
        if self.mock_mode:
            return MOCK_JD_MATCH
            
        system_prompt = """You are an expert recruiter. Compare the CV to the Job Description.
        Extract missing keywords, match score, recommendations, and a summary.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"CV:\n{cv_text}\n\nJob Description:\n{jd_text}"}
        ]
        
        llm_with_struct = self.llm.with_structured_output(JDMatchResponse)
        return llm_with_struct.invoke(messages)
