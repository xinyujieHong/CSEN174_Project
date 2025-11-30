#!/bin/bash

# CampusPool Test Runner Script

echo "=========================================="
echo "CampusPool Unit Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Jest is installed
if ! command -v jest &> /dev/null; then
    echo "Installing test dependencies..."
    npm install --save-dev jest ts-jest @types/jest
fi

# Run tests based on argument
case "$1" in
    "coverage")
        echo -e "${BLUE}Running tests with coverage report...${NC}"
        npm test -- --coverage
        ;;
    "watch")
        echo -e "${BLUE}Running tests in watch mode...${NC}"
        npm test -- --watch
        ;;
    "verbose")
        echo -e "${BLUE}Running tests with verbose output...${NC}"
        npm test -- --verbose
        ;;
    "user")
        echo -e "${BLUE}Running UserValidator tests...${NC}"
        npm test -- UserValidator.test.ts
        ;;
    "profile")
        echo -e "${BLUE}Running ProfileValidator tests...${NC}"
        npm test -- ProfileValidator.test.ts
        ;;
    "carpool")
        echo -e "${BLUE}Running CarpoolRequestValidator tests...${NC}"
        npm test -- CarpoolRequestValidator.test.ts
        ;;
    "message")
        echo -e "${BLUE}Running MessageHandler tests...${NC}"
        npm test -- MessageHandler.test.ts
        ;;
    "datetime")
        echo -e "${BLUE}Running DateTimeUtil tests...${NC}"
        npm test -- DateTimeUtil.test.ts
        ;;
    *)
        echo -e "${BLUE}Running all tests...${NC}"
        npm test
        ;;
esac

echo ""
echo -e "${GREEN}Test run complete!${NC}"
echo ""
echo "Available commands:"
echo "  ./run-tests.sh          - Run all tests"
echo "  ./run-tests.sh coverage - Run with coverage report"
echo "  ./run-tests.sh watch    - Run in watch mode"
echo "  ./run-tests.sh verbose  - Run with verbose output"
echo "  ./run-tests.sh user     - Run UserValidator tests only"
echo "  ./run-tests.sh profile  - Run ProfileValidator tests only"
echo "  ./run-tests.sh carpool  - Run CarpoolRequestValidator tests only"
echo "  ./run-tests.sh message  - Run MessageHandler tests only"
echo "  ./run-tests.sh datetime - Run DateTimeUtil tests only"
