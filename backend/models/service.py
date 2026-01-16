from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    title: str
    description: str
    icon: str
    image: Optional[str] = None  # Primary service image/photo URL (backward compatibility)
    images: List[str] = []  # Multiple service images (URLs or uploaded file paths)
    link: Optional[str] = None  # External or internal link
    link_text: Optional[str] = "Learn More"  # Link button text
    features: List[str] = []
    price: Optional[str] = None
    active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Web Development",
                "description": "Custom web applications",
                "icon": "Code",
                "image": "https://example.com/web-dev-image.jpg",
                "link": "https://example.com/web-development",
                "link_text": "View Details",
                "features": ["Responsive Design", "SEO Optimized"],
                "price": "Starting at $2,999",
                "active": True,
                "order": 1
            }
        }
