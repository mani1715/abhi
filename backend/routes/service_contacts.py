from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import uuid
from database import db
from models.service_contact import ServiceContact, ServiceContactCreate, ServiceContactUpdate
from auth.admin_auth import get_current_admin

router = APIRouter(prefix="/api/service-contacts", tags=["service-contacts"])

# Public endpoint - Create service contact request
@router.post("/", response_model=ServiceContact)
async def create_service_contact(contact: ServiceContactCreate):
    """
    Create a new service contact request (Public endpoint)
    """
    try:
        contact_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        contact_data = {
            "id": contact_id,
            "service_id": contact.service_id,
            "service_name": contact.service_name,
            "customer_name": contact.customer_name,
            "customer_email": contact.customer_email,
            "customer_phone": contact.customer_phone,
            "message": contact.message or "",
            "status": "new",
            "admin_notes": None,
            "created_at": now,
            "updated_at": now
        }
        
        result = await db.service_contacts.insert_one(contact_data)
        
        if result.inserted_id:
            return contact_data
        else:
            raise HTTPException(status_code=500, detail="Failed to create service contact")
            
    except Exception as e:
        print(f"Error creating service contact: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin endpoints
@router.get("/", response_model=List[ServiceContact])
async def get_all_service_contacts(
    status: Optional[str] = None,
    current_admin = Depends(get_current_admin)
):
    """
    Get all service contact requests (Admin only)
    """
    try:
        query = {}
        if status:
            query["status"] = status
        
        contacts = await db.service_contacts.find(query).sort("created_at", -1).to_list(length=None)
        
        return contacts
        
    except Exception as e:
        print(f"Error fetching service contacts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{contact_id}", response_model=ServiceContact)
async def get_service_contact(
    contact_id: str,
    current_admin = Depends(get_current_admin)
):
    """
    Get a specific service contact by ID (Admin only)
    """
    try:
        contact = await db.service_contacts.find_one({"id": contact_id})
        
        if not contact:
            raise HTTPException(status_code=404, detail="Service contact not found")
        
        return contact
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching service contact: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{contact_id}", response_model=ServiceContact)
async def update_service_contact(
    contact_id: str,
    update_data: ServiceContactUpdate,
    current_admin = Depends(get_current_admin)
):
    """
    Update a service contact (Admin only)
    """
    try:
        db = await get_database()
        
        # Prepare update data
        update_dict = {}
        if update_data.status is not None:
            update_dict["status"] = update_data.status
        if update_data.admin_notes is not None:
            update_dict["admin_notes"] = update_data.admin_notes
        
        update_dict["updated_at"] = datetime.utcnow().isoformat()
        
        result = await db.service_contacts.update_one(
            {"id": contact_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Service contact not found")
        
        updated_contact = await db.service_contacts.find_one({"id": contact_id})
        return updated_contact
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating service contact: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{contact_id}")
async def delete_service_contact(
    contact_id: str,
    current_admin = Depends(get_current_admin)
):
    """
    Delete a service contact (Admin only)
    """
    try:
        db = await get_database()
        result = await db.service_contacts.delete_one({"id": contact_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Service contact not found")
        
        return {"message": "Service contact deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting service contact: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/summary")
async def get_service_contacts_stats(current_admin = Depends(get_current_admin)):
    """
    Get statistics for service contacts (Admin only)
    """
    try:
        db = await get_database()
        
        total = await db.service_contacts.count_documents({})
        new = await db.service_contacts.count_documents({"status": "new"})
        contacted = await db.service_contacts.count_documents({"status": "contacted"})
        converted = await db.service_contacts.count_documents({"status": "converted"})
        closed = await db.service_contacts.count_documents({"status": "closed"})
        
        return {
            "total": total,
            "new": new,
            "contacted": contacted,
            "converted": converted,
            "closed": closed
        }
        
    except Exception as e:
        print(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
