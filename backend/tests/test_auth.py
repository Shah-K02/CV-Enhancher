import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_success(async_client: AsyncClient):
    response = await async_client.post(
        "/api/v1/auth/register",
        json={"name": "New", "email": "new@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_register_duplicate(async_client: AsyncClient, test_user):
    response = await async_client.post(
        "/api/v1/auth/register",
        json={"name": "New", "email": test_user.email, "password": "password123"}
    )
    assert response.status_code == 409

@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient, test_user):
    response = await async_client.post(
        "/api/v1/auth/login",
        json={"email": test_user.email, "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_get_me(async_client: AsyncClient, auth_headers, test_user):
    response = await async_client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == test_user.email
