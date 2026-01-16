from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class ServiceContact(BaseModel):
    """
    Model for Service Contact Requests (Simple contact form for services)
    """
    id: str
    service_id: str  # Reference to service (e.g., 'birthday-service')
    service_name: str
    
    # Customer Details
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    
    # Additional message
    message: Optional[str] = None
    
    # Request Status
    status: str = "new"  # new, contacted, converted, closed
    admin_notes: Optional[str] = None
    
    created_at: str
    updated_at: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "contact-123",
                "service_id": "5",
                "service_name": "Custom Birthday & Event Websites",
                "customer_name": "John Doe",
                "customer_email": "john@example.com",
                "customer_phone": "+91-9876543210",
                "message": "Interested in birthday website",
                "status": "new",
                "created_at": "2025-01-16T10:00:00Z",
                "updated_at": "2025-01-16T10:00:00Z"
            }
        }

class ServiceContactCreate(BaseModel):
    service_id: str
    service_name: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    message: Optional[str] = None

class ServiceContactUpdate(BaseModel):
    status: Optional[str] = None
    admin_notes: Optional[str] = None
