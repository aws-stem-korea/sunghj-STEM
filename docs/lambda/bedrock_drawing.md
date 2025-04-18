# Lambda x Bedrock Drawing
### Stable Diffusion Model (text-to-image)

![KakaotalkAiChatbotBedrockDrawingArch](../../static/img/hackathon/kakaotalk_ai_chatbot_bedrock_drawing_arch.png)

이번 실습에서는 Stable Diffusion 모델을 활용하여 입력한 값을 기반으로 이미지를 생성하는 챗봇을 만듭니다. 

## 1. callback 함수 수정

이번 실습에서는 Amazon Bedrock을 이용해 손쉽게 생성형 AI 애플리케이션을 구축합니다. 

Amazon Bedrock에 접속한 뒤, 이번 실습에서 사용할 AI 모델 `SD3 Large 1.0`을 현재 리전에서 사용할 수 있도록 활성화합니다.
![모델활성화](../../static/img/hackathon/5_bedrock_drawing/1.png)

이제 다시 AWS Lambda 콘솔로 돌아가서, [함수] -> [callback-lambda]를 선택합니다. 

코드 소스에서 `callback.py` 함수를 아래와 같이 수정하고 Deploy를 선택합니다.

![코드](../../static/img/hackathon/5_bedrock_drawing/1.5.png)

- [bedrock-drawing] callback.py

```python
import requests
import boto3
import os
from datetime import datetime
import base64
import json

TEXT_TO_IMAGE_S3_BUCKET_NAME = os.getenv('TEXT_TO_IMAGE_S3_BUCKET_NAME')
AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')

def lambda_handler(event, context):
    text_input = event['text_input']
    callback_url = event['callback_url']

    # https://docs.aws.amazon.com/ko_kr/translate/latest/dg/examples-ct.html
    english_text = boto3.client('translate').translate_text(
        Text=text_input, 
        SourceLanguageCode='ko', 
        TargetLanguageCode='en'
    )['TranslatedText']

    # https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_StableDiffusion_section.html
    response = boto3.client('bedrock-runtime').invoke_model(
        modelId='stability.sd3-large-v1:0',
        # https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/model-parameters-diffusion-3-text-image.html
        body=json.dumps({
        'prompt': english_text,
        'negative_prompt': '(worst quality), (low quality:1.3), (text:1.8), (logo:1.8), (nsfw), low resolution, deformed, blurred, bad anatomy, disfigured, badly drawn face, mutation, mutated, extra limb, missing limb, blurred, floating limbs, detached limbs, blurred, watermark, bad proportion, cropped image'
        })
    )
    image_data = base64.b64decode(json.loads(response['body'].read().decode('utf-8'))['images'][0])
    image_path = os.path.join('/tmp', 'stability.png')
    with open(image_path, 'wb') as file:
        file.write(image_data)

    image_name = f'{datetime.now().strftime('%Y%m%d%H%M%S')}.png'
    boto3.client('s3').upload_file(image_path, TEXT_TO_IMAGE_S3_BUCKET_NAME, image_name)
    image_url = f'https://{TEXT_TO_IMAGE_S3_BUCKET_NAME}.s3.{AWS_REGION_NAME}.amazonaws.com/{image_name}'

    # https://kakaobusiness.gitbook.io/main/tool/chatbot/skill_guide/ai_chatbot_callback_guide#skillresponse
    requests.post(callback_url, json={
        'version': '2.0',
        'useCallback': False,
        'template': { 'outputs': [ { 'simpleImage': { 'imageUrl': image_url, 'altText' : 'text-to-image' } } ] }
    })

    os.remove(image_path)
    return True
```

## 2. 배포 및 테스트

함수 수정이 완료되었다면, Lambda 함수와 챗봇을 배포합니다.

![테스트](../../static/img/hackathon/5_bedrock_drawing/2.png)
