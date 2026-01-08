#!/usr/bin/env python3
"""
MarketPulse AI Backend API Testing Suite
Tests all backend endpoints systematically
"""

import requests
import sys
import json
from datetime import datetime
import time

class MarketPulseAPITester:
    def __init__(self, base_url="https://market-analyzer-225.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test data
        self.test_user = {
            "email": f"test_user_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "full_name": "Test User",
            "company_name": "Test Company SAS"
        }
        
        self.test_analysis = {
            "title": "Test Market Analysis - SaaS B2B France",
            "industry": "SaaS",
            "target_market": "PME françaises 10-50 employés",
            "competitors": ["Competitor1", "Competitor2"],
            "description": "Test analysis for market opportunities"
        }

    def log_test(self, name, success, details="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "response_data": response_data
        })

    def make_request(self, method, endpoint, data=None, expected_status=200):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                return False, f"Unsupported method: {method}", {}

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            return success, f"Status: {response.status_code}", response_data

        except requests.exceptions.Timeout:
            return False, "Request timeout (30s)", {}
        except requests.exceptions.ConnectionError:
            return False, "Connection error", {}
        except Exception as e:
            return False, f"Request error: {str(e)}", {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        # Test root endpoint
        success, details, data = self.make_request('GET', '')
        self.log_test("Root endpoint", success, details, data)
        
        # Test health endpoint
        success, details, data = self.make_request('GET', 'health')
        self.log_test("Health check", success, details, data)

    def test_user_registration(self):
        """Test user registration"""
        print("\n🔍 Testing User Registration...")
        
        success, details, data = self.make_request('POST', 'auth/register', self.test_user)
        self.log_test("User registration", success, details, data)
        
        if success and 'access_token' in data:
            self.token = data['access_token']
            self.user_id = data['user']['id']
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        print("\n🔍 Testing User Login...")
        
        login_data = {
            "email": self.test_user["email"],
            "password": self.test_user["password"]
        }
        
        success, details, data = self.make_request('POST', 'auth/login', login_data)
        self.log_test("User login", success, details, data)
        
        if success and 'access_token' in data:
            self.token = data['access_token']
            return True
        return False

    def test_auth_me(self):
        """Test get current user"""
        print("\n🔍 Testing Auth Me...")
        
        success, details, data = self.make_request('GET', 'auth/me')
        self.log_test("Get current user", success, details, data)
        return success

    def test_dashboard_stats(self):
        """Test dashboard stats"""
        print("\n🔍 Testing Dashboard Stats...")
        
        success, details, data = self.make_request('GET', 'dashboard/stats')
        self.log_test("Dashboard stats", success, details, data)
        return success

    def test_create_analysis(self):
        """Test creating market analysis"""
        print("\n🔍 Testing Analysis Creation...")
        
        success, details, data = self.make_request('POST', 'analyses', self.test_analysis, 200)
        self.log_test("Create analysis", success, details, data)
        
        if success and 'id' in data:
            self.analysis_id = data['id']
            # Wait for AI processing
            print("⏳ Waiting for AI analysis to complete...")
            time.sleep(5)
            return True
        return False

    def test_get_analyses(self):
        """Test getting user analyses"""
        print("\n🔍 Testing Get Analyses...")
        
        success, details, data = self.make_request('GET', 'analyses')
        self.log_test("Get analyses list", success, details, data)
        return success

    def test_get_single_analysis(self):
        """Test getting single analysis"""
        if not hasattr(self, 'analysis_id'):
            self.log_test("Get single analysis", False, "No analysis ID available")
            return False
            
        print("\n🔍 Testing Get Single Analysis...")
        
        success, details, data = self.make_request('GET', f'analyses/{self.analysis_id}')
        self.log_test("Get single analysis", success, details, data)
        return success

    def test_get_opportunities(self):
        """Test getting opportunities"""
        print("\n🔍 Testing Get Opportunities...")
        
        success, details, data = self.make_request('GET', 'opportunities')
        self.log_test("Get opportunities", success, details, data)
        return success

    def test_create_report(self):
        """Test creating AI report"""
        if not hasattr(self, 'analysis_id'):
            self.log_test("Create report", False, "No analysis ID available")
            return False
            
        print("\n🔍 Testing Report Creation...")
        
        report_data = {
            "analysis_id": self.analysis_id,
            "report_type": "market_overview"
        }
        
        success, details, data = self.make_request('POST', 'reports', report_data)
        self.log_test("Create AI report", success, details, data)
        
        if success and 'id' in data:
            self.report_id = data['id']
            return True
        return False

    def test_get_reports(self):
        """Test getting reports"""
        print("\n🔍 Testing Get Reports...")
        
        success, details, data = self.make_request('GET', 'reports')
        self.log_test("Get reports list", success, details, data)
        return success

    def test_get_single_report(self):
        """Test getting single report"""
        if not hasattr(self, 'report_id'):
            self.log_test("Get single report", False, "No report ID available")
            return False
            
        print("\n🔍 Testing Get Single Report...")
        
        success, details, data = self.make_request('GET', f'reports/{self.report_id}')
        self.log_test("Get single report", success, details, data)
        return success

    def test_delete_analysis(self):
        """Test deleting analysis"""
        if not hasattr(self, 'analysis_id'):
            self.log_test("Delete analysis", False, "No analysis ID available")
            return False
            
        print("\n🔍 Testing Delete Analysis...")
        
        success, details, data = self.make_request('DELETE', f'analyses/{self.analysis_id}')
        self.log_test("Delete analysis", success, details, data)
        return success

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting MarketPulse AI Backend Tests")
        print(f"🎯 Target API: {self.base_url}")
        print("=" * 60)
        
        # Health checks
        self.test_health_endpoints()
        
        # Authentication flow
        if not self.test_user_registration():
            print("❌ Registration failed, stopping tests")
            return self.print_summary()
        
        if not self.test_auth_me():
            print("❌ Auth verification failed")
        
        # Dashboard
        self.test_dashboard_stats()
        
        # Analysis workflow
        if self.test_create_analysis():
            self.test_get_analyses()
            self.test_get_single_analysis()
            self.test_get_opportunities()
            
            # Report workflow
            if self.test_create_report():
                self.test_get_reports()
                self.test_get_single_report()
            
            # Cleanup
            self.test_delete_analysis()
        
        return self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        # Show failed tests
        failed_tests = [r for r in self.test_results if not r['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = MarketPulseAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())