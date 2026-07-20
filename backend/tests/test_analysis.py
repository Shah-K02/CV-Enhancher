import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_trigger_analysis(async_client: AsyncClient, auth_headers, test_cv):
    response = await async_client.post(f"/api/v1/analysis/{test_cv.id}/analyse", headers=auth_headers)
    assert response.status_code == 200
    assert "overall_score" in response.json()

@pytest.mark.asyncio
async def test_match_jd(async_client: AsyncClient, auth_headers, test_cv):
    response = await async_client.post(
        f"/api/v1/analysis/{test_cv.id}/match-jd",
        headers=auth_headers,
        json={"cv_id": str(test_cv.id), "job_description": "We need a Python developer"}
    )
    assert response.status_code == 200
    assert "match_score" in response.json()
