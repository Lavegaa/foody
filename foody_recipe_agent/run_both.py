#!/usr/bin/env python3
"""
API 서버와 Streamlit 앱을 동시에 실행하는 스크립트
"""

import subprocess
import threading
import time
import os
import sys
from pathlib import Path

def run_api_server():
    """API 서버 실행"""
    try:
        current_dir = Path(__file__).parent
        src_dir = current_dir / "src"
        main_py_path = src_dir / "main.py"
        
        if not main_py_path.exists():
            print(f"❌ main.py를 찾을 수 없습니다: {main_py_path}")
            return
        
        print("🚀 API 서버를 실행합니다...")
        print(f"📂 실행 경로: {main_py_path}")
        
        # 작업 디렉토리를 src로 변경하고 main.py 실행
        subprocess.run([sys.executable, str(main_py_path)], 
                      cwd=str(src_dir), check=True)
    except KeyboardInterrupt:
        print("\n👋 API 서버가 종료되었습니다.")
    except Exception as e:
        print(f"❌ API 서버 실행 중 오류 발생: {e}")

def run_streamlit():
    """Streamlit 앱 실행"""
    try:
        current_dir = Path(__file__).parent
        streamlit_app_path = current_dir / "streamlit_app.py"
        
        if not streamlit_app_path.exists():
            print(f"❌ streamlit_app.py를 찾을 수 없습니다: {streamlit_app_path}")
            return
        
        # API 서버가 시작될 때까지 대기
        print("⏳ API 서버 시작 대기 중...")
        time.sleep(5)
        
        print("🎨 Streamlit 앱을 실행합니다...")
        print(f"📂 실행 경로: {streamlit_app_path}")
        
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", str(streamlit_app_path),
            "--server.port=8501",
            "--server.address=0.0.0.0"
        ], cwd=str(current_dir), check=True)
    except KeyboardInterrupt:
        print("\n👋 Streamlit 앱이 종료되었습니다.")
    except Exception as e:
        print(f"❌ Streamlit 실행 중 오류 발생: {e}")

def main():
    """메인 함수"""
    print("🔧 Foody Recipe Agent 시작")
    print("=" * 50)
    
    # 환경 변수 확인
    env_file = Path(__file__).parent / ".env"
    if not env_file.exists():
        print("⚠️  .env 파일이 없습니다.")
        print("💡 .env.example을 복사하여 .env 파일을 생성하고 OPENAI_API_KEY를 설정하세요.")
        return
    
    try:
        # API 서버를 백그라운드에서 실행
        api_thread = threading.Thread(target=run_api_server, daemon=True)
        api_thread.start()
        
        # Streamlit 앱 실행 (메인 스레드)
        run_streamlit()
        
    except KeyboardInterrupt:
        print("\n👋 모든 서비스가 종료되었습니다.")
    except Exception as e:
        print(f"❌ 예상치 못한 오류 발생: {e}")

if __name__ == "__main__":
    main()