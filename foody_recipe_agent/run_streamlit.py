#!/usr/bin/env python3
"""
Streamlit 앱을 실행하는 스크립트
"""

import subprocess
import sys
import os
from pathlib import Path

def run_streamlit():
    """Streamlit 앱 실행"""
    try:
        # 현재 스크립트의 디렉토리로 이동
        current_dir = Path(__file__).parent
        os.chdir(current_dir)
        
        # Streamlit 앱 실행
        cmd = [
            sys.executable, "-m", "streamlit", "run", "streamlit_app.py",
            "--server.port=8501",
            "--server.address=0.0.0.0",
            "--server.headless=true"
        ]
        
        print("🚀 Streamlit 앱을 실행합니다...")
        print("📱 브라우저에서 http://localhost:8501 으로 접속하세요")
        print("⚠️  API 서버가 http://localhost:8000 에서 실행 중인지 확인하세요")
        print("🔧 API 서버 실행: python src/main.py")
        print("-" * 50)
        
        subprocess.run(cmd, check=True)
        
    except KeyboardInterrupt:
        print("\n👋 Streamlit 앱이 종료되었습니다.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Streamlit 실행 중 오류 발생: {e}")
        print("💡 streamlit 패키지가 설치되어 있는지 확인하세요: pip install streamlit")
    except Exception as e:
        print(f"❌ 예상치 못한 오류 발생: {e}")

if __name__ == "__main__":
    run_streamlit()