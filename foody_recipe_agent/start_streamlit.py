#!/usr/bin/env python3
"""
Streamlit 앱만 실행하는 스크립트
"""

import subprocess
import sys
import time
import requests
from pathlib import Path

def check_api_server():
    """API 서버 상태 확인"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=2)
        return response.status_code == 200
    except:
        return False

def main():
    """Streamlit 앱 실행"""
    current_dir = Path(__file__).parent
    streamlit_app_path = current_dir / "streamlit_app.py"
    
    if not streamlit_app_path.exists():
        print(f"❌ streamlit_app.py를 찾을 수 없습니다: {streamlit_app_path}")
        return 1
    
    # API 서버 상태 확인
    if not check_api_server():
        print("⚠️  API 서버가 실행되지 않았습니다.")
        print("💡 먼저 API 서버를 실행하세요: python start_api.py")
        print("⏳ API 서버 시작을 5초간 대기합니다...")
        time.sleep(5)
        
        if not check_api_server():
            print("❌ API 서버에 연결할 수 없습니다.")
            print("🔧 수동으로 API 서버를 먼저 실행해주세요.")
    
    print("🎨 Streamlit 앱을 실행합니다...")
    print(f"📂 실행 경로: {streamlit_app_path}")
    print("🌐 앱 주소: http://localhost:8501")
    print("-" * 50)
    
    try:
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", str(streamlit_app_path),
            "--server.port=8501",
            "--server.address=0.0.0.0"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Streamlit 앱이 종료되었습니다.")
        return 0
    except Exception as e:
        print(f"❌ Streamlit 실행 중 오류 발생: {e}")
        return 1

if __name__ == "__main__":
    exit(main())