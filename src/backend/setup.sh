#!/bin/bash

# CampusPool Backend Setup Script
# This script sets up the backend server and installs dependencies

echo "🚗 CampusPool Backend Setup"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js found: $NODE_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp .env.example .env
    
    # Generate a secure JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Replace the default JWT_SECRET in .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env
    else
        # Linux
        sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env
    fi
    
    echo "✅ Created .env file with secure JWT secret"
else
    echo "ℹ️  .env file already exists, skipping creation"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review your .env file: nano .env"
echo "  2. Start the server:"
echo "     npm start          # Production mode"
echo "     npm run dev        # Development mode with auto-reload"
echo ""
echo "  3. Test the server:"
echo "     curl http://localhost:3001/health"
echo ""
echo "Happy coding! 🚀"
