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
    response = requests.post(login_url, json=login_data)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("登录成功")
        # 测试获取当前用户信息
        print("\n测试获取当前用户信息...")
        # 从响应中获取token
        data = response.json()
        if "token" in data:
            token = data["token"]
            headers = {"Authorization": f"Bearer {token}"}
            me_url = "http://localhost:8000/api/auth/me"
            me_response = requests.get(me_url, headers=headers)
            print(f"状态码: {me_response.status_code}")
            print(f"响应内容: {me_response.text}")
    else:
        print("登录失败")
except Exception as e:
    print(f"请求失败: {e}")
