---
sidebar_position: 3
---

# No-Code Computer Vision

# 코드 없이 이미지에서 탐지하고 추출하기 🔍
## 컴퓨터 비전(Computer Vision) 이란 무엇입니까?

컴퓨터 비전(Computer Vision) 이 등장하면서 기계가 인간만큼, 또는 그보다 더 정확하게 이미지 속의 인물, 장소, 사물을 매우 빠르고 효율적으로 식별할 수 있게 되었습니다. 흔히 딥 러닝 모델로 구축되는 컴퓨터 비전은 단일 또는 연속되는 이미지로부터 유용한 정보를 자동으로 추출, 분석, 분류 및 이해합니다. 이미지 데이터는 단일 이미지, 비디오 시퀀스, 여러 카메라의 뷰 또는 3차원 데이터 등 다양한 형식을 취할 수 있습니다.

고속 조립 라인에서 결함을 식별하는 것부터 자율 로봇, 의료 이미지 분석, 소셜 미디어에서 제품과 인물을 식별하는 것까지 적용 범위는 무궁무진합니다.

### 컴퓨터 비전 사용 사례와 장점
- **공공 안전 및 주택 보안** : 이미지 및 안면 인식 기능이 있는 컴퓨터 비전은 법에 위배되는 사항이나 특정 인물을 신속하게 식별하여, 지역 사회의 안전을 강화하고 범죄를 예방하는 효과가 있습니다.
- **인증 및 컴퓨터-인간의 상호 작용 향상** : 소매점에서 고객 감정 분석을 기반으로 제품을 제공하거나 고객 신원 및 기본 설정 기반의 신속한 인증을 통해 은행이 서비스 속도를 높이는 등 인간-컴퓨터의 상호 작용 향상은 고객 만족도를 높여 줍니다.
- **콘텐츠 관리 및 분석** : 미디어와 소셜 채널에는 매일 수백만 개의 이미지가 추가됩니다. 메타데이터 추출, 이미지 분류 등의 컴퓨터 비전 기술을 사용하면 효율성과 수익 창출 기회가 크게 향상됩니다.
- **자율 주행** : 컴퓨터 비전 기술 덕분에 자동차 제조업체는 더욱 안전하고 우수한 성능의 자율 주행 차량 내비게이션을 제공함으로써 자율 주행을 현실화하고, 믿음직한 운송 수단의 제공이라는 목표를 달성할 수 있습니다.
- **의료 영상** : 컴퓨터 비전을 이용한 의료 영상 분석은 환자에 대한 의학적 진단의 정확성과 속도를 크게 높여 치료 결과와 기대 수명을 향상시킬 수 있습니다.
- **제조 공정 관리** : 숙련된 컴퓨터 비전과 로봇 공학이 결합되어 제조 분야의 품질 보증 및 운영 효율성을 향상시키므로 보다 안정적이고 비용 효율적인 제품 생산에 기여합니다.

## Overview

이번 시간에는 다음 두 가지 실습을 진행합니다. 

- 객체 탐지로 사진에서 이미지 라벨링하기
- 텍스트 감지로 사진에서 텍스트 추출하기  
  
## 미리 훈련된 모델(Pre-trained models) 이용하기 

### Dataset 업로드

실습에서 사용할 Dataset 을 Canvas 에 업로드 합니다.

1. 데이터셋을 다운로드 합니다: [Download the data](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/datasets/sample-images.zip)

2. Canvas의 왼쪽 메뉴창에서 [Datasets]를 클릭합니다. 그리고, 오른쪽 상단의 [Create] > [Image]를 선택합니다.
   - 데이터셋의 이름은 `sample-images`으로 하겠습니다.

![SageMaker_nocodecv_1](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/datasets.png)

![SageMaker_nocodecv_2](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/dataset-name.png)

3. 다운로드 받은 데이터셋을 업로드합니다. 정상적으로 업로드가 완료되었다면 [Create dataset] 버튼을 클릭합니다.

![SageMaker_nocodecv_3](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/dataset-upload.png)

![SageMaker_nocodecv_4](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/dataset-import.png)

4. 데이터셋이 정상적으로 업로드 되었는지 확인합니다.  

![SageMaker_nocodecv_5](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/dataset-ready.png)

### 객체 탐지로 사진에서 이미지 라벨링하기 

객체 탐지는 하나의 이미지에서 물체, 개념, 장면, 행위를 식별할 수 있는 강력한 컴퓨터 비전 기능입니다. [다음 문서](https://docs.aws.amazon.com/ko_kr/rekognition/latest/dg/labels.html) 에서 객체 탐지가 지원하는 전체 라벨과 항목을 확인할 수 있습니다. 


**Ready-to-use models** 탭으로 이동하고, **Object detection in images** 모델을 선택합니다.

![SageMaker_nocodecv_6](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/ready-to-use-models.png)

다음은 샘플 이미지와 예측 결과입니다. 예측 결과에서는 예측된 라벨과 신뢰도를 확인할 수 있습니다.  

![SageMaker_nocodecv_7](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/object-detection-home.png)

새로운 이미지로 객체 탐지를 하고 싶다면, `Upload image` 를 선택하여 이미지를 업로드하면, 이미지로부터 생성된 라벨들을 확인할 수 있습니다.

#### 배치로 예측 생성하기

여러 이미지에서 예측을 수행할 때는 **Batch Prediction** 을 사용할 수 있습니다. 

Batch prediction 는 Canvas 에 업로드 된 데이터를 사용합니다. **Select dataset** 을 클릭하여 사용 가능한 데이터셋을 확인합니다.

![SageMaker_nocodecv_8](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/select-dataset.png)

이전에 업로드한 `sample-images` 데이터셋을 선택한 후 `Generate predictions` 을 클릭합니다.

![SageMaker_nocodecv_9](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/generate-predictions.png)

배치 작업은 `Generating predictions` 의 상태일 것입니다. 데이터셋에 얼마나 많은 이미지가 들어있는지에 따라 예측이 완료되기까지 시간이 소요될 수 있습니다. 예측이 완료되면, 배치 작업의 상태가 `Ready` 로 바뀔 것입니다. 
Canvas 에서 **View prediction** 을 선택하여 아래와 같이 결과를 확인할 수 있습니다. 

![SageMaker_nocodecv_10](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/prediction-results.png)


다음과 같이 새 창에서 각 이미지의 예측된 라벨과 관련 신뢰도를 확인할 수 있습니다. 예측 결과는 다음 화면 뿐만 아니라 CSV 나 Zip 파일로 저장하여 확인할 수 있습니다. 

![SageMaker_nocodecv_11](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/view-results.png)

### 텍스트 감지로 이미지에서 텍스트 추출하기      

텍스트 감지(Text detection) 은 이미지에서 자동으로 텍스트를 식별하고 추출할 수 있는 기능입니다. 만약 이미지가 텍스트를 포함한다면, 텍스트를 디지털 형태로 바꾸어 분석이나 다른 복잡한 처리로 활용하여 효율적으로 사용할 수 있을 것입니다. 

이번 시간에는 미리 학습된 모델을 이용하여 이미지에서 텍스트를 추출하는 실습을 진행합니다. 

**Ready-to-use models** 탭으로 이동하여, **Object detection in images** 모델을 선택합니다.

![SageMaker_nocodecv_12](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/text-detection.png)

이 페이지에는 텍스트 감지하는 기능을 시연하기 위한 샘플 이미지를 확인할 수 있습니다. 
오른쪽의 예측 결과에서 추출한 텍스트와 신뢰도를 확인할 수 있습니다. 

![SageMaker_nocodecv_13](https://static.us-east-1.prod.workshops.aws/public/968c6fb1-eb62-4247-bc1e-17a978e70e81/static/lab11/text-detection-home.png)

**Upload image** 를 클릭하여 텍스트가 포함된 이미지를 업로드하여 결과를 확인해보세요.

하나의 이미지를 업로드하여 실습을 수행하였다면, [객체 탐지로 사진에서 이미지 라벨링하기 ] 에서 사용했던  **Batch prediction** 을 참고하여 여러 이미지의 예측 결과를 확인해보세요. 