import requests
import json

# 测试注册新用户API
register_url = "http://localhost:8000/api/auth/register"
register_data = {
    "username": "testuser456",
    "email": "testuser456@example.com",
    "password": "testpassword123"
}

print("测试注册新用户API...")
try:
    response = requests.post(register_url, json=register_data)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("注册成功")
        # 从响应中获取token
        data = response.json()
        if "token" in data:
            print(f"获取到token: {data['token']}")
            # 使用token获取用户信息
            token = data["token"]
            headers = {"Authorization": f"Bearer {token}"}
            me_url = "http://localhost:8000/api/auth/me"
            me_response = requests.get(me_url, headers=headers)
            print(f"\n测试获取当前用户信息...")
            print(f"状态码: {me_response.status_code}")
            print(f"响应内容: {me_response.text}")
    else:
        print("注册失败")
except Exception as e:
    print(f"请求失败: {e}")
