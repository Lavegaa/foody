#!/usr/bin/env python3
"""
API 서버만 실행하는 스크립트
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    """API 서버 실행"""
    current_dir = Path(__file__).parent
    src_dir = current_dir / "src"
    main_py_path = src_dir / "main.py"
    
    if not main_py_path.exists():
        print(f"❌ main.py를 찾을 수 없습니다: {main_py_path}")
        return 1
    
    # .env 파일 확인
    env_file = current_dir / ".env"
    if not env_file.exists():
        print("⚠️  .env 파일이 없습니다.")
        print("💡 .env.example을 복사하여 .env 파일을 생성하고 OPENAI_API_KEY를 설정하세요.")
        return 1
    
    print("🚀 API 서버를 실행합니다...")
    print(f"📂 실행 경로: {main_py_path}")
    print("🌐 서버 주소: http://localhost:8000")
    print("📖 API 문서: http://localhost:8000/docs")
    print("-" * 50)
    
    try:
        # src 디렉토리에서 main.py 실행
        os.chdir(src_dir)
        subprocess.run([sys.executable, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 API 서버가 종료되었습니다.")
        return 0
    except Exception as e:
        print(f"❌ API 서버 실행 중 오류 발생: {e}")
        return 1

if __name__ == "__main__":
    exit(main())