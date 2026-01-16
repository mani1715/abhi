"""
Seed script to ADD new invitation website services
CRITICAL: This script ONLY ADDS new services, does NOT delete or modify existing ones
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid

load_dotenv()

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "mspn_dev_db")

async def seed_invitation_services():
    """Add new invitation website services to the database WITHOUT touching existing ones"""
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    feelings_services_collection = db['feelings_services']
    
    # Get the highest display_order to append new services at the end
    existing_services = await feelings_services_collection.find().sort("display_order", -1).limit(1).to_list(1)
    next_order = existing_services[0]["display_order"] + 1 if existing_services else 1
    
    # New Invitation Services Data
    invitation_services = [
        {
            "id": str(uuid.uuid4()),
            "name": "Birthday Celebration Website",
            "event_type": "Birthday",
            "description": "Create a stunning birthday invitation website with photo galleries, RSVP system, and personalized messages to make the celebration unforgettable.",
            "features": [
                "Custom photo gallery with memories",
                "RSVP and guest management system",
                "Personalized birthday message section",
                "Event timeline and schedule",
                "24-hour active invitation link",
                "WhatsApp sharing ready",
                "Beautiful floral design themes",
                "Mobile-responsive layout"
            ],
            "original_price": 599,
            "offer_price": 399,
            "currency": "₹",
            "images": [
                "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
            ],
            "demo_url": "https://birthday-website-for-parents-by-pfin.netlify.app/",
            "is_active": True,
            "display_order": next_order,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "created_by": "system-seed"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Engagement Invitation Website",
            "event_type": "Engagement",
            "description": "Beautiful engagement invitation website with couple story, photo gallery, and RSVP system to share your special moment with loved ones.",
            "features": [
                "Romantic couple story section",
                "Photo gallery showcase",
                "RSVP system for guests",
                "Event location with map integration",
                "24-hour active invitation link",
                "WhatsApp delivery ready",
                "Elegant design templates",
                "Guest message board"
            ],
            "original_price": 699,
            "offer_price": 449,
            "currency": "₹",
            "images": [
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
            ],
            "demo_url": "https://birthday-website-for-parents-by-pfin.netlify.app/",
            "is_active": True,
            "display_order": next_order + 1,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "created_by": "system-seed"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Wedding Invitation Website",
            "event_type": "Wedding",
            "description": "Elegant wedding invitation website with complete wedding details, photo galleries, ceremony timeline, and guest RSVP to celebrate your big day.",
            "features": [
                "Complete wedding ceremony details",
                "Photo galleries and video sections",
                "Wedding timeline and schedule",
                "RSVP and attendance tracking",
                "Gift registry integration",
                "24-hour active invitation link",
                "Beautiful wedding themes",
                "Location maps and directions",
                "Guest accommodation info"
            ],
            "original_price": 899,
            "offer_price": 599,
            "currency": "₹",
            "images": [
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80"
            ],
            "demo_url": "https://birthday-website-for-parents-by-pfin.netlify.app/",
            "is_active": True,
            "display_order": next_order + 2,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "created_by": "system-seed"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Event & Function Invitation Website",
            "event_type": "Event",
            "description": "Professional event invitation website perfect for any special occasion - anniversaries, parties, corporate events, or family functions.",
            "features": [
                "Customizable event details section",
                "Photo and video galleries",
                "RSVP and guest management",
                "Event schedule and agenda",
                "24-hour active invitation link",
                "WhatsApp sharing enabled",
                "Multiple design themes",
                "Contact and location details",
                "Special instructions section"
            ],
            "original_price": 699,
            "offer_price": 449,
            "currency": "₹",
            "images": [
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
            ],
            "demo_url": "https://birthday-website-for-parents-by-pfin.netlify.app/",
            "is_active": True,
            "display_order": next_order + 3,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "created_by": "system-seed"
        }
    ]
    
    try:
        print("🔍 Checking existing services...")
        existing_count = await feelings_services_collection.count_documents({})
        print(f"✅ Found {existing_count} existing services (will NOT be touched)")
        
        # Check if any of our new services already exist
        new_services_to_add = []
        for service in invitation_services:
            existing = await feelings_services_collection.find_one({
                "name": service["name"],
                "event_type": service["event_type"]
            })
            if not existing:
                new_services_to_add.append(service)
            else:
                print(f"⚠️  Service '{service['name']}' already exists, skipping...")
        
        # Insert ONLY new services
        if new_services_to_add:
            result = await feelings_services_collection.insert_many(new_services_to_add)
            print(f"\n✅ Successfully ADDED {len(result.inserted_ids)} new invitation services:")
            
            for service in new_services_to_add:
                print(f"   ✓ {service['name']} - {service['currency']}{service['offer_price']}")
        else:
            print("\n⚠️  All invitation services already exist. No new services added.")
        
        # Verify total count
        final_count = await feelings_services_collection.count_documents({})
        print(f"\n📊 Total services in database: {final_count}")
        print(f"   - Existing services: {existing_count}")
        print(f"   - Newly added: {len(new_services_to_add)}")
        
        print("\n🎉 Invitation services seeded successfully!")
        print("✅ Existing services remain UNTOUCHED")
        
    except Exception as e:
        print(f"❌ Error seeding invitation services: {e}")
        raise
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_invitation_services())
