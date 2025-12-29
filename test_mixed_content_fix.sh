#!/bin/bash

echo "=========================================="
echo "TESTING MIXED CONTENT FIX"
echo "=========================================="
echo ""

echo "1. Checking backend health..."
BACKEND_STATUS=$(curl -s http://localhost:8001/ | grep -o "healthy")
if [ "$BACKEND_STATUS" == "healthy" ]; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is not responding"
fi
echo ""

echo "2. Checking frontend environment..."
if [ -f "/app/frontend/.env" ]; then
    echo "   ✅ Frontend .env exists"
    echo "   Checking USE_WEBPACK_PROXY..."
    PROXY_VALUE=$(grep "USE_WEBPACK_PROXY" /app/frontend/.env | cut -d'=' -f2)
    if [ "$PROXY_VALUE" == "false" ]; then
        echo "   ✅ USE_WEBPACK_PROXY=false (correct for production)"
    else
        echo "   ⚠️  USE_WEBPACK_PROXY=$PROXY_VALUE (should be false for HTTPS)"
    fi
    echo "   Checking REACT_APP_BACKEND_URL..."
    BACKEND_URL=$(grep "REACT_APP_BACKEND_URL" /app/frontend/.env | cut -d'=' -f2)
    echo "   📍 REACT_APP_BACKEND_URL=$BACKEND_URL"
    if [[ "$BACKEND_URL" == /api* ]]; then
        echo "   ✅ Using relative URL (correct)"
    elif [[ "$BACKEND_URL" == https://* ]]; then
        echo "   ✅ Using HTTPS URL (correct)"
    elif [[ "$BACKEND_URL" == http://* ]]; then
        echo "   ⚠️  Using HTTP URL (will be upgraded to HTTPS by axios)"
    fi
else
    echo "   ❌ Frontend .env not found"
fi
echo ""

echo "3. Checking api.js modifications..."
if grep -q "CRITICAL FIX: Force HTTPS" /app/frontend/src/services/api.js; then
    echo "   ✅ HTTPS enforcement at initialization found"
else
    echo "   ❌ HTTPS enforcement at initialization NOT found"
fi
if grep -q "CRITICAL FIX: Enforce HTTPS protocol when page is HTTPS" /app/frontend/src/services/api.js; then
    echo "   ✅ HTTPS enforcement in interceptor found"
else
    echo "   ❌ HTTPS enforcement in interceptor NOT found"
fi
echo ""

echo "4. Testing API endpoint (simulating frontend call)..."
# Test the client projects endpoint that was failing
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/client/projects \
    -H "Authorization: Bearer dummy-token-for-test" 2>/dev/null)
if [ "$RESPONSE" == "401" ] || [ "$RESPONSE" == "200" ]; then
    echo "   ✅ API endpoint reachable (got $RESPONSE - expected 401/200)"
else
    echo "   ⚠️  API endpoint returned $RESPONSE"
fi
echo ""

echo "5. Checking supervisor services..."
BACKEND_STATUS=$(sudo supervisorctl status backend | grep -o "RUNNING")
FRONTEND_STATUS=$(sudo supervisorctl status frontend | grep -o "RUNNING")
if [ "$BACKEND_STATUS" == "RUNNING" ] && [ "$FRONTEND_STATUS" == "RUNNING" ]; then
    echo "   ✅ Both backend and frontend are running"
else
    echo "   ❌ Services not running properly"
    sudo supervisorctl status
fi
echo ""

echo "=========================================="
echo "FIX VERIFICATION COMPLETE"
echo "=========================================="
echo ""
echo "NEXT STEPS:"
echo "1. Open your browser to the HTTPS URL"
echo "2. Login to client dashboard"
echo "3. Check browser console for [API] logs"
echo "4. Verify Network tab shows HTTPS requests"
echo ""
echo "Expected console output:"
echo "  [API Request] GET /api/client/projects"
echo "  [API] Protocol: https: | BaseURL: /api"
echo ""
