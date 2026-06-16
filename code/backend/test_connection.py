#!/usr/bin/env python
import sys
import os
from dotenv import load_dotenv

load_dotenv()

# Test imports
try:
    print("✓ Dotenv loaded")
except Exception as e:
    print(f"✗ Error loading dotenv: {e}")
    sys.exit(1)

# Test database connection
try:
    from app.database import engine, get_db
    print("✓ Database imported successfully")
except Exception as e:
    print(f"✗ Error importing database: {e}")
    sys.exit(1)

# Test models
try:
    from app.models.user import User
    print("✓ User model imported")
except Exception as e:
    print(f"✗ Error importing User model: {e}")
    sys.exit(1)

# Test schemas
try:
    from app.schemas.user import UserCreate, Token, TokenData, User as UserSchema
    print("✓ Schema classes imported")
except Exception as e:
    print(f"✗ Error importing schemas: {e}")
    sys.exit(1)

# Test routes
try:
    from app.routes import auth, dangers
    print("✓ Routes imported successfully")
except Exception as e:
    print(f"✗ Error importing routes: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test app
try:
    from app.main import app
    print("✓ FastAPI app created successfully")
except Exception as e:
    print(f"✗ Error creating app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n✅ All tests passed! Server should start correctly.")
