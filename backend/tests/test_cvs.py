import pytest
from httpx import AsyncClient
import io

@pytest.mark.asyncio
async def test_upload_cv_invalid_type(async_client: AsyncClient, auth_headers):
    file_content = b"dummy content"
    files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    response = await async_client.post("/api/v1/cvs/upload", headers=auth_headers, files=files)
    assert response.status_code == 415

@pytest.mark.asyncio
async def test_list_cvs(async_client: AsyncClient, auth_headers, test_cv):
    response = await async_client.get("/api/v1/cvs/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["cvs"]) >= 1

@pytest.mark.asyncio
async def test_delete_cv(async_client: AsyncClient, auth_headers, test_cv):
    response = await async_client.delete(f"/api/v1/cvs/{test_cv.id}", headers=auth_headers)
    assert response.status_code == 204
