# Q & A

---

### Q1. callback-lambda 함수 내에서 추가 파이썬 패키지를 import했으나, AI 챗봇이 응답하지 않습니다. (bs4, pandas, numpy, opencv 등)

A1. 추가 파이썬 패키지를 직접 등록해야 합니다. 
1. 실습 시 다운로드 받은 소스코드에서 layer.zip 파일을 찾습니다.
2. layer.zip 파일의 압축을 풉니다. **압축을 푸는 옵션으로 반드시 "파일명 폴더에 풀기" 또는 "layer\에 풀기"를 선택합니다. 만약 layer 디렉터리가 아닌 python 디렉터리로 압축을 풀었다면 layer 디렉터리를 새로 생성하고 python 디렉터리를 layer 디렉터리 내부로 이동시킵니다.**

![layer directory](/img/hackathon/6_qna/layer_python_dir.png)

3. CMD 또는 터미널을 열고, `__pycache__`가 확인되는 위치(경로)로 이동합니다.
4. `pip install --platform=manylinux2014_x86_64 --only-binary=:all: 추가할_패키지_이름1 추가할_패키지_이름2 추가할_패키지_이름3 -t ./` 명령어를 수행하여 필요한 패키지를 디렉터리에 추가합니다.
```python
# Examples

# Install bs4
pip install --platform=manylinux2014_x86_64 --only-binary=:all: beautifulsoup4 -t ./

# Install pandas, numpy
pip install --platform=manylinux2014_x86_64 --only-binary=:all: pandas numpy -t ./
```
5. layer 디렉터리를 다시 layer.zip으로 압축합니다. **python 디렉터리를 압축하는 것이 아닙니다.** 
6. Lambda 콘솔에서 [추가 리소스] -> [계층] -> [LambdaLayer]를 선택합니다. 

![edit layer](/img/hackathon/6_qna/edit_layer.png)

7. [버전 생성]을 선택하고 새로운 layer.zip 파일을 업로드합니다.
8. 추가 설정 변경 없이 [생성]을 선택합니다.
9. Lambda 콘솔에서 [함수] -> [callback-lambda]를 선택합니다.
10. 코드 하단의 [계층]에서 [편집]을 선택합니다.
11. 계층 버전을 최신 숫자로 올리고 [저장]을 선택합니다.
12. AI 챗봇이 제대로 응답하는지 다시 테스트합니다.

---

### Q2. Bedrock 모델 액세스 권한을 요청했는데 `Request failed, INVALID_PAYMENT_INSTRUMENT` 오류가 발생했습니다.

![model access error](/img/hackathon/6_qna/bedrock_model_access_error.png)

A2. 신용 카드가 아닌 수단이 AWS 계정의 결제 방법으로 등록되어 있을 경우, 해당 오류가 발생할 수 있습니다. 아래 이미지를 참고하여 신용 카드를 새로운 결제 방법으로 등록하고 기본값으로 설정합니다. 이후, 모델 액세스 권한 요청을 재시도합니다. 

![credit card](/img/hackathon/6_qna/creditcard.png)

---

### Q3. AI 챗봇이 "잠시 기다려주세요"를 보낸 후 아무리 시간이 지나도 응답을 보내지 않습니다.

A3. 모니터링 기능을 통해 Lambda 로그를 확인합니다. 
1. Lambda 콘솔에서 [함수] - [callback-lambda]를 선택합니다.
2. [모니터링] - [CloudWatch Logs 보기]를 선택합니다.

<img src="/img/hackathon/lambda_log.png" width="480" />

3. [모든 로그 스트림 검색]을 선택합니다.
4. 이벤트 필터링에 "error"를 입력하고 Enter 키를 눌러 검색합니다.
5. 검색 결과를 통해 에러의 원인을 찾아봅니다.

Stable Diffusion Model 사용 시, 프롬프트에 아래와 같이 부적절한 키워드를 포함되면 이미지를 생성하지 않고 오류를 반환합니다.
- 욕설 (f**k) 
- 차별적 표현 (nig**r)
- 선정적 표현 

---

### Q4. AI 챗봇 실습 수업을 복습하고 싶어요.

A4. 복습을 위해 실습 과정을 YouTube 영상([link](https://www.youtube.com/watch?v=g9HyaJp0Zio))으로 녹화해두었습니다.

- Base 소스코드(base.zip) : [link](https://stem-hackathon-2024.s3.us-west-2.amazonaws.com/base.zip)
- Bedrock Chat 소스코드(callback.py) : [link](https://stem-hackathon-2024.s3.us-west-2.amazonaws.com/bedrock-chat/callback.py)
- Bedrock Drawing 소스코드(callback.py) : [link](https://stem-hackathon-2024.s3.us-west-2.amazonaws.com/bedrock-drawing/callback.py)
