import requests
import os
import random

# CONFIGURATION
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZWthaHRyYXZlbEBnbWFpbC5jb20iLCJleHAiOjQ5MjY3OTU3NzksImp0aSI6IjY2N2M0ODA1LWMwYjUtNDE2MS05OWViLTE3OGU1NjRlODJkMCJ9.MQ6JJSZXLd8XE7NSRkIb8AElT0wbT3qB4WRwYFO9-4g"
MANAGED_USER = "@cruisesbyalan" # Updated to match your exact handle
BASE_URL = "https://api.upload-post.com/api/upload_photos"

# TOPICS & CAPTIONS
POSTS = [
    {
        "topic": "Icon vs Wonder",
        "caption": "Icon of the Seas vs Wonder of the Seas: The 2026 Verdict 🚢 Stop booking the wrong ship! Read the full expert comparison at the link in my bio. #cruisesbyalan #iconoftheseas #royalcaribbean #travelagent",
        "url": "https://cruisesbyalan.com/blog/icon-vs-wonder-of-the-seas-comparison.html"
    },
    {
        "topic": "Virgin Voyages",
        "caption": "Is Virgin Voyages actually worth the hype? ⚓️ No kids, no buffets, no hidden fees. See the 2026 first-timer's guide at the link in bio! #virginvoyages #adultsonly #cruisedeals",
        "url": "https://cruisesbyalan.com/blog/virgin-voyages-first-timers-guide.html"
    },
    {
        "topic": "Cabin Upgrades",
        "caption": "7 Secrets to Scoring a FREE Cabin Upgrade 💎 Move from interior to balcony without paying full price. Link in bio for the secrets! #cruisetips #travelhacks #cruiseupgrade",
        "url": "https://cruisesbyalan.com/blog/how-to-get-cruise-cabin-upgrades.html"
    },
    {
        "topic": "Adults-Only Cruises",
        "caption": "Top 5 Adults-Only Cruises for 2026 🥂 Ditch the crowds and enjoy a sophisticated getaway. Link in bio for the full list! #adultsonly #luxurytravel #cruisereview",
        "url": "https://cruisesbyalan.com/blog/best-adults-only-cruises-2026.html"
    }
]

def run_auto_post():
    # Pick a random post topic
    post_data = random.choice(POSTS)
    print(f"🚀 Preparing automated post for: {post_data['topic']}")

    # Collect images (Using favicon as fallback, replace with ship photos in /images for best results)
    image_path = os.path.abspath("../favicon.png")
    
    # Files array for the API
    # In a real scenario, you'd want 6 different images here
    files = [
        ('photos[]', ('photo1.png', open(image_path, 'rb'), 'image/png')),
        ('photos[]', ('photo2.png', open(image_path, 'rb'), 'image/png'))
    ]

    # Form Data
    data = {
        "user": MANAGED_USER,
        "platforms[]": ["tiktok", "instagram"],
        "caption": post_data['caption'],
        "auto_add_music": "true",
        "privacy_level": "PUBLIC_TO_EVERYONE"
    }

    # Headers
    headers = {
        "Authorization": f"Apikey {API_KEY}"
    }

    try:
        response = requests.post(BASE_URL, headers=headers, data=data, files=files)
        if response.status_code == 200:
            print("✅ SUCCESS! Post has been sent to the queue.")
            print(response.json())
        else:
            print(f"❌ FAILED: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    run_auto_post()
