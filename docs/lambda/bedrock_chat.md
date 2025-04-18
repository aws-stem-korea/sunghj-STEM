# Lambda x Bedrock Chat
### Anthropic Claude Model

![KakaotalkAiChatbotBedrockChatArch](../../static/img/hackathon/kakaotalk_ai_chatbot_bedrock_chat_arch.png)

이번 실습에서는 Anthropic Claude Model을 활용하여 지능형 AI 챗봇을 만듭니다. 

## 1. callback 함수 수정

이번 실습에서는 Amazon Bedrock을 이용해 손쉽게 생성형 AI 애플리케이션을 구축합니다. 

Amazon Bedrock에 접속한 뒤, 이번 실습에서 사용할 AI 모델`Claude 3.5 Sonnet`을 현재 리전에서 사용할 수 있도록 활성화합니다.
![모델활성화](../../static/img/hackathon/4_bedrock_chat/1.png)

![모델사용설정](../../static/img/hackathon/4_bedrock_chat/2.png)

![활성화확인](../../static/img/hackathon/4_bedrock_chat/3.png)

이제 다시 AWS Lambda 콘솔로 돌아가서, [함수] -> [callback-lambda]를 선택합니다. 

코드 소스에서 `callback.py` 함수를 아래와 같이 수정하고 Deploy를 선택합니다.

![코드](../../static/img/hackathon/4_bedrock_chat/3.5.png)

- [bedrock-chat] callback.py

```python
import requests
import json
import boto3

# https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html
def bedrock_chatbot(text):
    response = boto3.client('bedrock-runtime').invoke_model(
        modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0', 
        body = json.dumps({
            'anthropic_version': 'bedrock-2023-05-31',
            'messages': [ { 'role': 'user', 'content': text } ], # "role" : "user" or "assistant"
            'max_tokens': 2048,
            'temperature': 0.5
        }),
        accept='application/json', 
        contentType='application/json'
    )
    return json.loads(response.get('body').read())['content'][0]['text']

def lambda_handler(event, context):
    text_input = event['text_input']
    callback_url = event['callback_url']

    result = bedrock_chatbot(text_input)

    # https://kakaobusiness.gitbook.io/main/tool/chatbot/skill_guide/ai_chatbot_callback_guide#skillresponse
    requests.post(callback_url, json={
        'version': '2.0',
        'useCallback': False,
        'template': { 'outputs': [ { 'simpleText': { 'text': f'{result}' } } ] }
    })
    return True
```

## 2. 배포 및 테스트

함수 수정이 완료되었다면, Lambda 함수와 챗봇을 배포합니다.

![테스트](../../static/img/hackathon/4_bedrock_chat/4.png)
