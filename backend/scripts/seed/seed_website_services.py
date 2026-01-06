"""
Seed script to populate the services collection with website template offerings
Run with: python scripts/seed/seed_website_services.py
"""
import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_dir))

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import uuid
from datetime import datetime

# Load environment variables
load_dotenv(backend_dir / '.env')

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "prompt_forge_db")

async def seed_services():
    """Seed services collection with website template offerings"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    services_collection = db.services
    
    # Clear existing services
    await services_collection.delete_many({})
    print("✅ Cleared existing services")
    
    # Website template services
    services = [
        {
            "id": str(uuid.uuid4()),
            "title": "Engagement / Proposal Website",
            "description": "Beautiful, romantic websites perfect for proposals and engagement announcements. Share your love story with stunning visuals and interactive elements.",
            "icon": "Heart",
            "image": "https://images.unsplash.com/photo-1542460532-50ac46fb13d7?w=800&q=80",
            "link": "https://engagement-proposal-website.netlify.app/",
            "link_text": "View Live Demo",
            "features": [
                "Romantic design with stunning visuals",
                "Love story timeline section",
                "Photo gallery with lightbox",
                "Interactive proposal reveal",
                "Mobile-responsive design",
                "24-hour activation"
            ],
            "price": "₹2,999",
            "active": True,
            "order": 1,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "E-Commerce Store",
            "description": "Full-featured online store with shopping cart, product catalog, and checkout system. Perfect for launching your online business quickly.",
            "icon": "ShoppingCart",
            "image": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
            "link": "/demo/ecommerce",
            "link_text": "View Demo",
            "features": [
                "Product catalog with search & filters",
                "Shopping cart & checkout",
                "Product detail pages",
                "Responsive design",
                "Admin dashboard",
                "Payment integration ready"
            ],
            "price": "₹14,999",
            "active": True,
            "order": 2,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Corporate Business Website",
            "description": "Professional corporate website showcasing your business, services, and team. Perfect for establishing your online presence.",
            "icon": "Building",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
            "link": "/demo/corporate",
            "link_text": "View Demo",
            "features": [
                "Professional design",
                "Services showcase",
                "Team member profiles",
                "Contact forms",
                "Blog integration",
                "SEO optimized"
            ],
            "price": "₹9,999",
            "active": True,
            "order": 3,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Restaurant & Booking Website",
            "description": "Elegant restaurant website with online table booking, menu display, and gallery. Attract more customers with a stunning online presence.",
            "icon": "UtensilsCrossed",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
            "link": "/demo/restaurant-booking",
            "link_text": "View Demo",
            "features": [
                "Online table reservation",
                "Digital menu display",
                "Photo gallery",
                "Location & contact info",
                "Special offers section",
                "Mobile-friendly design"
            ],
            "price": "₹7,999",
            "active": True,
            "order": 4,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "SaaS Landing Page",
            "description": "High-converting landing page for software products and services. Designed to showcase features and drive sign-ups.",
            "icon": "Rocket",
            "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
            "link": "/demo/saas-landing",
            "link_text": "View Demo",
            "features": [
                "Modern, clean design",
                "Feature highlights",
                "Pricing tables",
                "Call-to-action sections",
                "Integration showcase",
                "Testimonials section"
            ],
            "price": "₹6,999",
            "active": True,
            "order": 5,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Portfolio Website",
            "description": "Stunning portfolio website to showcase your work, projects, and skills. Perfect for freelancers, designers, and developers.",
            "icon": "Briefcase",
            "image": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
            "link": "/portfolio",
            "link_text": "View Example",
            "features": [
                "Project showcase grid",
                "About & skills section",
                "Contact form",
                "Blog integration",
                "Responsive design",
                "Fast loading"
            ],
            "price": "₹5,999",
            "active": True,
            "order": 6,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Real Estate Website",
            "description": "Property listing website with search, filters, and detailed property pages. Perfect for real estate agents and agencies.",
            "icon": "Home",
            "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
            "link": "/demo/real-estate",
            "link_text": "View Demo",
            "features": [
                "Property listings with filters",
                "Advanced search",
                "Property detail pages",
                "Image galleries",
                "Contact forms",
                "Map integration"
            ],
            "price": "₹12,999",
            "active": True,
            "order": 7,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Learning Management System (LMS)",
            "description": "Complete online learning platform with courses, lessons, and student management. Launch your online courses today.",
            "icon": "GraduationCap",
            "image": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
            "link": "/demo/lms",
            "link_text": "View Demo",
            "features": [
                "Course catalog",
                "Lesson management",
                "Student dashboard",
                "Progress tracking",
                "Video integration",
                "Certificate generation"
            ],
            "price": "₹19,999",
            "active": True,
            "order": 8,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    ]
    
    # Insert services
    result = await services_collection.insert_many(services)
    print(f"✅ Inserted {len(result.inserted_ids)} services")
    
    # Print summary
    print("\n📋 Services Summary:")
    print("=" * 70)
    for service in services:
        print(f"\n✨ {service['title']}")
        print(f"   Price: {service['price']}")
        print(f"   Link: {service['link']}")
        print(f"   Features: {len(service['features'])} features")
    print("\n" + "=" * 70)
    print("✅ Services seeding completed successfully!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    print("🌱 Seeding services collection...")
    asyncio.run(seed_services())
