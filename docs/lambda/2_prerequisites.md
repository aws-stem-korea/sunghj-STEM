# 사전 준비 ② - AWS & Python
### 본격적인 실습 전, 준비 사항을 확인해주세요.

## AWS SAM CLI
> 💡 AWS SAM(AWS Serverless Application Model)은 IaC(Infrastructure as Code)의 형태로 서버리스 애플리케이션을 빌드할 때 사용되는 오픈소스 프레임워크입니다.

AWS SAM CLI (AWS Serverless Application Model Command Line Interface) 최신 버전을 설치합니다.

### AWS CLI 설치

[AWS CLI 설치](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html) 문서에서 본인의 OS 환경에 맞는 설치 방법을 참고하여 AWS CLI를 설치합니다. 

### AWS SAM CLI 설치 

[AWS SAM CLI 설치](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) 문서에서 본인의 OS 환경에 맞는 설치 방법을 참고하여 AWS SAM CLI를 설치합니다.

## Python
Python 3.12 버전을 설치합니다. 

### Python 3.12 설치

1. Python 패키지 파일 다운로드

- [Windows 64-bit installer](https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe)
- [macOS 64-bit universal2 installer](https://www.python.org/ftp/python/3.12.7/python-3.12.7-macos11.pkg)

기타 OS에 대한 Python 3.12 설치 파일은 [링크](https://www.python.org/downloads/release/python-3120/)를 통해 확인하실 수 있습니다. 

다운로드받은 설치 파일을 실행하여 Python 3.12 설치를 진행합니다.

2. Python 버전 확인

```
python --version
python3 --version
```

### Python 버전 변경
기존에 설치되어 있던 다른 버전의 Python이 있을 경우, Python 3.12 설치를 진행한 뒤, `python` 또는 `python3` 의 디폴트 버전을 변경합니다. 

```
# Python 3.12 경로 확인
ls -l /usr/local/bin/python*

# `python` 버전 변경
ln -s -f /usr/local/bin/python3.12 /usr/local/bin/python

# Python 버전 확인
python --version
```