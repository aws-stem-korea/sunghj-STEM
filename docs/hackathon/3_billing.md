# AWS 비용 계산 

(us-west-2 기준)

---

### Lambda + API Gateway ([link](https://aws.amazon.com/ko/lambda/pricing/))

[Lambda]

Lambda 함수 요청 수와 코드를 실행하는 데 걸리는 기간에 따라 요금이 청구됩니다. 신규 가입 고객을 위한 AWS 프리 티어에는 월 100만 건의 무료 요청과 월 40만 GB-초의 컴퓨팅 시간이 포함되어 있으며 x86 및 Graviton2 프로세서로 구동되는 기능에 모두 사용할 수 있습니다. 또한 프리 티어에는 요청당 첫 6MB를 초과하는 월별 100GiB의 HTTP 응답 스트리밍이 무료로 포함됩니다.

컴퓨팅 시간에 따른 비용 : 매달 GB-초당 **0.023원** (USD 0.0000166667)
요청에 따른 비용 : 매달 요청 백만 건당 **281원** (USD 0.20)

<br/>

[API Gateway]

AWS 프리 티어를 사용하는 신규 가입 고객은 최대 12개월 동안 매달 REST API에 대해 수신된 API 호출 100만 개, HTTP API에 대해 수신된 API 호출 100만 개, WebSocket API에 대한 메시지 100만 개와 연결 시간 750,000분을 무료로 제공받습니다.

REST API : 요청 백만 건당 **4,916원** (USD 3.5)

AI 챗봇과의 대화(Lambda 함수 및 REST API 호출) 10회에 대하여 약 **4원**의 요금이 부과됩니다.

---

### Bedrock ([link](https://aws.amazon.com/ko/s3/pricing/))
요금은 전달 방식, 공급자, 모델에 따라 다릅니다.

[Chat]

Antrhopic Claude 3.5 Sonnet :
  - 입력 토큰 1,000개당 **4원** (USD 0.003)
  - 출력 토큰 1,000개당 **21원** (USD 0.015)

10개의 질문(1,024 입력 토큰), 10개의 답변(1,024 출력 토큰)을 처리할 경우, 약 **2,589원**의 요금이 부과됩니다.

<br/>

[Drawing]

Stable Diffusion 3 Large : 생성된 이미지당 **112원** (USD 0.08)	

10개의 이미지를 생성할 경우, 약 **1,120원**의 요금이 부과됩니다.

---

### S3 ([link](https://aws.amazon.com/ko/s3/pricing/))
Bedrock 모델(Stable Diffusion)이 생성한 이미지를 보관하는 저장소(S3 Standard)입니다. 저장 용량에 따라 요금이 부과됩니다. AWS 프리 티어를 사용하는 신규 가입 고객은 S3를 무료로 시작할 수 있습니다. 이 경우, 매달 5GB의 S3 스토리지(S3 Standard), 20,000건의 GET 요청, 2,000건의 PUT, COPY, POST 또는 LIST 요청, 100GB의 데이터 송신 혜택을 받게 됩니다.

[S3 Standard]
- 이미지 저장 : 처음 50TB까지 매달 1GB당 **32원** (USD 0.023)
- 이미지 조회 : 조회 요청(GET,SELECT) 1000개당 **0.6원** (USD 0.0004)

300KB의 .PNG 이미지를 **약 3,333개** 저장하고 조회할 경우 약 **34원**의 요금이 부과됩니다.

---

### Translate ([link](https://aws.amazon.com/ko/translate/pricing/))
프롬프트가 효과적으로 전달되도록 한글 프롬프트를 영문 프롬프트로 번역합니다. 처리한 텍스트의 문자 수를 기준으로 사용한 만큼만 비용을 지불합니다. AWS 프리 티어를 사용하는 신규 가입 고객은 Amazon Translate의 일부를 무료로 시작할 수 있습니다. 이 경우, 표준 텍스트 번역에 대하여 12개월 동안 매월 2백만 자를 무료로 처리할 수 있는 혜택을 받게 됩니다.

[표준 텍스트 번역]
- 한글 -> 영문 번역 : 백만 글자당 **21,000원** (15.00 USD)

프롬프트 1회당 100글자씩 100개의 이미지를 생성했다면 약 **210원**의 요금이 부과됩니다.

---

### 예시

[Bedrock Chat - Claude Model] 

매달 **10회**의 대화를 진행할 경우,
- Lambda 및 API Gateway : **4원**
- Bedrock :  **2,589원**
- ***Toatal : 약 2,593원***

<br/>

[Bedrock Drawing - Stable Diffusion Model]

매달 이미지를 **10개** 생성할 경우,
- Lambda 및 API Gateway : **4원**
- Bedrock : **1,120원**
- S3 : **1원** 
- Translate : **21원**
- ***Total : 약 1,146원***
