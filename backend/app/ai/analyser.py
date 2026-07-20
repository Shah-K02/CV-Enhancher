import json
from langchain_openai import ChatOpenAI
from app.config import get_settings
from app.schemas.analysis import CVAnalysisResponse, AnalysisSectionFeedback

settings = get_settings()

MOCK_ANALYSIS_RESPONSE = CVAnalysisResponse(
    overall_score=67,
    sections=[
        AnalysisSectionFeedback(
            name="Structure & Formatting",
            score=70,
            feedback=["Clear section headings are present", "Consistent formatting throughout"],
            suggestions=["Add a professional summary at the top", "Use bullet points consistently across all experience entries"]
        ),
        AnalysisSectionFeedback(
            name="ATS Compatibility",
            score=60,
            feedback=["Standard section names are used", "No tables or columns detected"],
            suggestions=["Include more industry-standard keywords", "Spell out acronyms at first use"]
        ),
        AnalysisSectionFeedback(
            name="Keywords & Skills",
            score=65,
            feedback=["Technical skills section is present"],
            suggestions=["Add quantified metrics to skill descriptions", "Include more tools and technologies relevant to target roles"]
        ),
        AnalysisSectionFeedback(
            name="Experience Descriptions",
            score=55,
            feedback=["Job titles and dates are clearly listed"],
            suggestions=["Start each bullet with a strong action verb", "Quantify achievements (e.g. 'Reduced load time by 40%')", "Focus on impact, not just responsibilities"]
        ),
        AnalysisSectionFeedback(
            name="Achievements",
            score=50,
            feedback=["Some accomplishments are mentioned"],
            suggestions=["Add specific numbers and percentages", "Include awards, publications, or notable projects", "Use the STAR method for key achievements"]
        ),
        AnalysisSectionFeedback(
            name="Grammar & Clarity",
            score=80,
            feedback=["No major grammatical errors detected", "Writing is generally clear"],
            suggestions=["Avoid passive voice", "Keep bullet points to one line where possible"]
        ),
    ],
    analysis_type="full"
)

class CVAnalyser:
    def __init__(self):
        self.mock_mode = settings.mock_ai_mode
        if not self.mock_mode:
            self.llm = ChatOpenAI(model="gpt-4o", api_key=settings.openai_api_key)

    async def analyse(self, text: str) -> CVAnalysisResponse:
        if self.mock_mode:
            return MOCK_ANALYSIS_RESPONSE
            
        system_prompt = """You are an expert ATS and CV reviewer. Analyse the provided CV text.
        Provide a structured JSON output with an overall score (0-100) and detailed sections feedback.
        Sections must include: 'Structure & Formatting', 'ATS Compatibility', 'Keywords & Skills', 'Experience Descriptions', 'Achievements', 'Grammar & Clarity'.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ]
        
        # Pydantic structured output using Langchain
        llm_with_struct = self.llm.with_structured_output(CVAnalysisResponse)
        result = llm_with_struct.invoke(messages)
        return result
