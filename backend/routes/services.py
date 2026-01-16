from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import List
from schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from database import services_collection
from utils import serialize_document
from models import Service
from datetime import datetime
import os
import shutil
from pathlib import Path
import uuid

router = APIRouter(prefix="/services", tags=["services"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("/app/public/uploads/services")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/", response_model=List[ServiceResponse])
async def get_services():
    """Get all services"""
    cursor = services_collection.find().sort("order", 1)
    services = await cursor.to_list(length=100)
    return [serialize_document(service) for service in services]

@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: str):
    """Get a specific service by ID"""
    service = await services_collection.find_one({"id": service_id})
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    return serialize_document(service)

@router.post("/", response_model=ServiceResponse)
async def create_service(service_data: ServiceCreate):
    """Create a new service"""
    service = Service(**service_data.model_dump())
    doc = service.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await services_collection.insert_one(doc)
    return serialize_document(doc)

@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: str, service_data: ServiceUpdate):
    """Update a service"""
    # Check if service exists
    existing = await services_collection.find_one({"id": service_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Update only provided fields
    update_data = service_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await services_collection.update_one(
        {"id": service_id},
        {"$set": update_data}
    )
    
    updated_service = await services_collection.find_one({"id": service_id})
    return serialize_document(updated_service)

@router.delete("/{service_id}")
async def delete_service(service_id: str):
    """Delete a service"""
    result = await services_collection.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    return {"message": "Service deleted successfully"}

@router.post("/upload-image")
async def upload_service_image(file: UploadFile = File(...)):
    """
    Upload service image file (public endpoint - no auth required for admin panel use)
    Supported formats: JPG, PNG, WEBP
    """
    try:
        # Validate file type
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return URL path (relative to public directory)
        file_url = f"/uploads/services/{unique_filename}"
        
        return {
            "success": True,
            "url": file_url,
            "filename": file.filename,
            "message": "Image uploaded successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}"
        )
