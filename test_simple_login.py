import requests
import json

# 测试登录API
login_url = "http://localhost:8000/api/auth/login"
login_data = {
    "usernameOrEmail": "testuser",
    "password": "testpassword123"
}

print("测试登录API...")
try:
    response = requests.post(login_url, json=login_data, timeout=5)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("登录成功")
        data = response.json()
        if "token" in data:
            print(f"获取到token: {data['token']}")
    else:
        print("登录失败")
except Exception as e:
    print(f"请求失败: {e}")
