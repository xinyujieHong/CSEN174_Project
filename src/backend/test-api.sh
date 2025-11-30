#!/bin/bash

# CampusPool Backend API Test Script
# Tests all major API endpoints

BASE_URL="http://localhost:3001"
API_URL="${BASE_URL}/api"

echo "🧪 CampusPool Backend API Tests"
echo "==============================="
echo ""
echo "Testing backend at: $BASE_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local auth=$5
    
    echo -n "Testing $name... "
    
    if [ -z "$auth" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"} \
            "${BASE_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth" \
            ${data:+-d "$data"} \
            "${BASE_URL}${endpoint}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
        echo "  Response: $body"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# 1. Health Check
echo "=== Health Check ==="
test_endpoint "Health endpoint" "GET" "/health"
echo ""

# 2. Sign Up
echo "=== Authentication ==="
TIMESTAMP=$(date +%s)
TEST_EMAIL="test-${TIMESTAMP}@college.edu"
TEST_PASSWORD="TestPassword123"
TEST_NAME="Test User ${TIMESTAMP}"

signup_response=$(curl -s -X POST "${API_URL}/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${TEST_EMAIL}\",
        \"password\": \"${TEST_PASSWORD}\",
        \"name\": \"${TEST_NAME}\"
    }")

if echo "$signup_response" | grep -q "token"; then
    echo -e "${GREEN}✓ PASS${NC} Sign up successful"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    TOKEN=$(echo "$signup_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$signup_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    
    echo "  Token: ${TOKEN:0:20}..."
    echo "  User ID: $USER_ID"
else
    echo -e "${RED}✗ FAIL${NC} Sign up failed"
    echo "  Response: $signup_response"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi

# 3. Sign In
signin_response=$(curl -s -X POST "${API_URL}/auth/signin" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${TEST_EMAIL}\",
        \"password\": \"${TEST_PASSWORD}\"
    }")

if echo "$signin_response" | grep -q "token"; then
    echo -e "${GREEN}✓ PASS${NC} Sign in successful"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC} Sign in failed"
    echo "  Response: $signin_response"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# 4. Get Session
test_endpoint "Get session" "GET" "/api/auth/session" "" "$TOKEN"
echo ""

# 5. User Profile
echo "=== User Profile ==="
test_endpoint "Create profile" "POST" "/api/users/$USER_ID" \
    "{\"name\":\"$TEST_NAME\",\"college\":\"State University\",\"hasCar\":true,\"carModel\":\"Honda Civic\"}" \
    "$TOKEN"

test_endpoint "Get profile" "GET" "/api/users/$USER_ID" "" "$TOKEN"
echo ""

# 6. Carpool Requests
echo "=== Carpool Requests ==="
create_request_response=$(curl -s -X POST "${API_URL}/carpool-requests" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "destination": "Downtown Campus",
        "date": "2025-11-01",
        "time": "09:00",
        "seats": 3,
        "notes": "Test carpool request"
    }')

if echo "$create_request_response" | grep -q "request"; then
    echo -e "${GREEN}✓ PASS${NC} Create carpool request"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    REQUEST_ID=$(echo "$create_request_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "  Request ID: $REQUEST_ID"
else
    echo -e "${RED}✗ FAIL${NC} Create carpool request"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

test_endpoint "List requests" "GET" "/api/carpool-requests" "" "$TOKEN"

if [ ! -z "$REQUEST_ID" ]; then
    test_endpoint "Update request" "PUT" "/api/carpool-requests/$REQUEST_ID" \
        '{"notes":"Updated notes"}' "$TOKEN"
    
    test_endpoint "Delete request" "DELETE" "/api/carpool-requests/$REQUEST_ID" "" "$TOKEN"
fi
echo ""

# 7. Messaging
echo "=== Messaging ==="
test_endpoint "Get conversations" "GET" "/api/conversations" "" "$TOKEN"

# Create a test conversation by sending a message
CONV_ID="test-conversation-$(date +%s)"
test_endpoint "Send message" "POST" "/api/conversations/$CONV_ID/messages" \
    "{\"content\":\"Test message\",\"otherUserId\":\"test-user-id\"}" "$TOKEN"

test_endpoint "Get messages" "GET" "/api/conversations/$CONV_ID/messages" "" "$TOKEN"
test_endpoint "Update conversation" "PUT" "/api/conversations/$CONV_ID" \
    '{"status":"accepted"}' "$TOKEN"
echo ""

# Summary
echo "==============================="
echo "📊 Test Summary"
echo "==============================="
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo "Total Tests:  $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ All tests passed!${NC}"
    echo "Your backend is working correctly. 🎉"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed.${NC}"
    echo "Check the output above for details."
    exit 1
fi
