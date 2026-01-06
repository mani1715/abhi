"""
Seed script to add multiple website services with the engagement site as example
Run with: python scripts/seed/seed_multiple_services.py
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

async def seed_multiple_services():
    """Seed multiple website services"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    services_collection = db.services
    
    # Clear ALL existing services
    await services_collection.delete_many({})
    print("✅ Cleared all existing services")
    
    # Multiple website services
    services = [
        {
            "id": str(uuid.uuid4()),
            "title": "Engagement / Proposal Website",
            "description": "Beautiful, romantic websites perfect for proposals and engagement announcements. Share your love story with stunning visuals and interactive elements. Perfect for making your special moment unforgettable.",
            "icon": "Heart",
            "image": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
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
            "title": "Wedding Invitation Website",
            "description": "Elegant wedding invitation website to share your big day details with family and friends. Include venue, schedule, RSVP form, and photo gallery all in one beautiful place.",
            "icon": "Heart",
            "image": "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
            "link": "https://wedding-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Beautiful wedding theme design",
                "Event schedule & venue details",
                "Online RSVP form",
                "Photo gallery",
                "Gift registry links",
                "Google Maps integration"
            ],
            "price": "₹3,499",
            "active": True,
            "order": 2,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Birthday Party Website",
            "description": "Fun and colorful birthday party invitation website. Perfect for kids' birthdays, milestone celebrations, or surprise parties. Share all party details in style!",
            "icon": "Cake",
            "image": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
            "link": "https://birthday-party-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Colorful party theme",
                "Event countdown timer",
                "RSVP form",
                "Party games & activities info",
                "Gift wishlist",
                "Location & directions"
            ],
            "price": "₹1,999",
            "active": True,
            "order": 3,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Baby Shower Website",
            "description": "Sweet and adorable baby shower invitation website. Share the joy of your upcoming arrival with beautiful designs, gift registries, and celebration details.",
            "icon": "Baby",
            "image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
            "link": "https://babyshower-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Cute baby-themed design",
                "Gender reveal section",
                "Baby registry links",
                "RSVP form",
                "Photo gallery",
                "Games & activities page"
            ],
            "price": "₹2,499",
            "active": True,
            "order": 4,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Anniversary Celebration Website",
            "description": "Celebrate years of love and togetherness with a beautiful anniversary website. Share your journey, memories, and celebration details with loved ones.",
            "icon": "HeartHandshake",
            "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
            "link": "https://anniversary-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Elegant anniversary theme",
                "Journey timeline",
                "Memory photo gallery",
                "Event details & RSVP",
                "Message board for guests",
                "Special moments highlight"
            ],
            "price": "₹2,799",
            "active": True,
            "order": 5,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Corporate Event Website",
            "description": "Professional corporate event website for conferences, seminars, product launches, and company celebrations. Includes agenda, speaker profiles, and registration.",
            "icon": "Building",
            "image": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
            "link": "https://corporate-event-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Professional business design",
                "Event schedule & agenda",
                "Speaker profiles",
                "Online registration form",
                "Venue information",
                "Sponsor showcase"
            ],
            "price": "₹4,999",
            "active": True,
            "order": 6,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Graduation Celebration Website",
            "description": "Celebrate academic achievements with a graduation party website. Share your journey, achievements, and party details with family and friends.",
            "icon": "GraduationCap",
            "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
            "link": "https://graduation-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Academic achievement theme",
                "Journey & accomplishments",
                "Photo gallery",
                "Party details & RSVP",
                "Message board",
                "Future plans section"
            ],
            "price": "₹2,299",
            "active": True,
            "order": 7,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Festival/Holiday Party Website",
            "description": "Festive website for holiday parties, cultural celebrations, and seasonal gatherings. Spread the joy with beautiful themes and easy event management.",
            "icon": "Sparkles",
            "image": "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80",
            "link": "https://festival-party-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Festive themed design",
                "Event countdown",
                "Party schedule",
                "RSVP & guest list",
                "Gift exchange details",
                "Photo sharing section"
            ],
            "price": "₹2,199",
            "active": True,
            "order": 8,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Reunion Event Website",
            "description": "Bring everyone together with a reunion website. Perfect for school reunions, family gatherings, or friend meetups. Stay connected and organized!",
            "icon": "Users",
            "image": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
            "link": "https://reunion-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Group reunion theme",
                "Attendee list & RSVP",
                "Memory lane gallery",
                "Event schedule",
                "Contact directory",
                "Discussion forum"
            ],
            "price": "₹3,299",
            "active": True,
            "order": 9,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Charity/Fundraiser Website",
            "description": "Make a difference with a charity event website. Share your cause, collect donations, and organize fundraising events with a professional platform.",
            "icon": "Heart",
            "image": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
            "link": "https://charity-demo.netlify.app/",
            "link_text": "View Demo",
            "features": [
                "Charity-focused design",
                "Cause & mission statement",
                "Donation integration",
                "Event details",
                "Impact stories",
                "Volunteer registration"
            ],
            "price": "₹3,999",
            "active": True,
            "order": 10,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    ]
    
    # Insert services
    result = await services_collection.insert_many(services)
    print(f"✅ Inserted {len(result.inserted_ids)} services")
    
    # Print summary
    print("\n📋 Services Summary:")
    print("=" * 80)
    for i, service in enumerate(services, 1):
        print(f"\n{i}. ✨ {service['title']}")
        print(f"   💰 Price: {service['price']}")
        print(f"   🔗 Link: {service['link']}")
        print(f"   ✨ Features: {len(service['features'])} features")
    print("\n" + "=" * 80)
    print("✅ Services seeding completed successfully!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    print("🌱 Seeding multiple website services...")
    asyncio.run(seed_multiple_services())
