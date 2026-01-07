"""
Script to remove old services from services collection
"""
import asyncio
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_dir))

from database import services_collection

async def remove_old_services():
    """Remove all services from the old services collection"""
    
    print("🗑️  Removing old services...")
    
    # Count existing services
    count = await services_collection.count_documents({})
    print(f"Found {count} old services")
    
    if count > 0:
        # Delete all
        result = await services_collection.delete_many({})
        print(f"✅ Deleted {result.deleted_count} old services")
    else:
        print("✅ No old services found")

async def main():
    try:
        await remove_old_services()
        print("\n🎉 Cleanup completed successfully!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
