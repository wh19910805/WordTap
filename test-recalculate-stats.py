import requests
import json

# 测试重新计算用户统计数据API

base_url = "http://localhost:8000"
# 假设已经有一个登录用户，这里需要替换为实际的JWT令牌
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzIwMjYwMTExNjIwMzI0XzA3NGYzYTUwIiwiZXhwIjoxNzMxNjA1MDQ4fQ.1h5Fz1z4Z1z4Z1z4Z1z4Z1z4Z1z4Z1z4Z1z4Z1z4Z1z4"
}

def test_recalculate_stats():
    """测试重新计算用户统计数据"""
    url = f"{base_url}/api/users/stats/recalculate"
    
    try:
        response = requests.post(url, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 重新计算统计数据成功")
            print("响应结果:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return True
        else:
            print(f"❌ 请求失败，状态码: {response.status_code}")
            print("错误信息:")
            print(response.text)
            return False
    except Exception as e:
        print(f"❌ 发生异常: {str(e)}")
        return False

if __name__ == "__main__":
    test_recalculate_stats()
