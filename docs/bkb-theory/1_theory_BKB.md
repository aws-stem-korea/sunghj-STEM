# Bedrock Knowledge Bases (BKB)

대규모 언어 모델(LLM)은 방대한 텍스트 데이터로 학습된 인공지능 모델로, 텍스트 생성, 번역, 요약 등 다양한 자연어 처리 작업에서 놀라운 성능을 보여주며 큰 주목을 받았습니다. 

하지만 LLM은 몇 가지 중요한 한계점을 가지고 있습니다. 학습 데이터가 특정 시점으로 제한되어 있어 최신 정보를 반영하지 못하고, 때로는 그럴듯하지만 사실이 아닌 정보를 생성하는 할루시네이션(환각) 현상이 발생하는 문제가 존재했습니다. 또한, 기업의 내부 문서나 특정 도메인의 전문 지식을 활용하기 어렵다는 제약도 있었습니다.

이러한 한계를 극복하기 위해 RAG(Retrieval-Augmented Generation)이라는 기술이 등장했습니다. RAG는 '검색'과 '생성'이라는 두 단계로 작동하는데, 먼저 사용자의 질문과 관련된 문서를 미리 해당 문서가 저장된 벡터 데이터베이스에서 찾아내고, 이 검색된 정보를 바탕으로 LLM이 응답을 생성하게 됩니다. 이러한 방식을 통해 최신 정보 반영, 기업 특화 데이터 활용, 환각 현상 감소 등의 장점을 얻을 수 있게 되었습니다.

RAG를 효과적으로 구현하기 위해서는 문서를 적절한 크기로 나누고 효과적인 임베딩 방식을 선택하는 등의 문서 처리 과정이 중요합니다. 또한 검색의 정확도를 높이고 속도와 비용을 최적화하는 것도 필수적인 요소 중 하나입니다. 이러한 배경에서 Amazon Bedrock Knowledge Base가 개발되었으며, 이는 AWS 환경에서 기존에 저장된 데이터를 기반으로 RAG를 더욱 효율적이고 사용하기 쉽게 구현할 수 있도록 지원합니다. 기존 LLM의 강력한 언어 이해 및 생성 능력과 RAG의 장점을 결합하여, 더욱 신뢰성 있고 실용적인 AI 서비스를 제공할 수 있게 되었습니다.

## Knowledge Base (지식 기반)

기본적으로 Amazon Bedrock에서 제공하는 Foundation 모델은 일반적인 지식을 보유하고 있지만, 앞서 살펴봤듯이 RAG(Retrieval Augmented Generation) 기술을 활용하면 응답의 품질을 한층 더 개선할 수 있습니다. Amazon Bedrock에서는 Knowledge Base 기능을 통해 사용자가 가지고 있는 정보를 생성형 AI 애플리케이션에 통합하고, 쿼리에 대한 관련 정보를 검색하여 더 정확한 응답을 생성할 수 있습니다.

Amazon Bedrock Knowledge Base는 다음과 같은 주요 기능들을 가지고 있습니다.

주요 기능

* 동기화된 데이터 소스에서 관련 정보를 검색하여 사용자 쿼리에 응답
* 자연어를 SQL과 같은 구조화된 쿼리로 변환하여 데이터베이스에서 검색
* Amazon Bedrock Agents와 통합
* 리랭크 모델을 통한 검색 결과 최적화
* 이미지가 포함된 복잡한 문서에 대한 처리 지원
* 검색된 관련 정보 기반으로 프롬프트를 생성하여 생성형 AI 응답 품질 향상


사용자가 가지고 있는 정보를 애플리케이션 통합하기 위해서는 해당 정보를 저장할 저장소가 필요하며, 현재 Amazon Bedrock Knowledge Base에서는 1) Vector store, 2) Structured store, 3) Amazon Kendra GenAI index로 총 3가지 저장소를 지원하고 있습니다.





### 1. Vector Store

비정형 데이터는 미리 정의된 데이터 모델이나 구조가 없는 정보를 의미하며, 다양한 형식과 구조를 가질 수 있습니다. 이러한 데이터는 복잡한 처리와 분석 과정이 필요하며, 일반적으로 자연어 처리나 머신러닝과 같은 고급 분석 기술이 요구됩니다. 데이터의 크기가 크고 형식이 다양하여 저장과 처리에 더 많은 리소스가 필요하지만, 다양한 정보를 저장할 수 있다는 장점이 있습니다.

Amazon Bedrock Knowledge Base에서 연결할 수 있는 비정형 데이터 저장소의 유형은 다음과 같습니다.

* Amazon S3
* Confluence (preview)
* Microsoft SharePoint (preview)
* Salesforce (preview)
* Web Crawler (preview)
* Custom data source (allows direct ingestion of data into knowledge bases without needing to sync)

### 2. Structured Data (정형 데이터)
정형 데이터는 미리 정의된 데이터 모델이나 스키마를 따르며, 주로 관계형 데이터베이스나 스프레드시트 형태로 저장됩니다. 이러한 데이터는 명확한 구조와 규칙을 가지고 있어 검색과 분석이 용이하며, 데이터 간의 관계를 쉽게 파악할 수 있습니다. 따라서 SQL과 같은 표준화된 쿼리 언어를 사용하여 데이터를 쉽게 조작하고 관리할 수 있다는 특징이 있습니다.

Amazon Bedrock Knowledge Base에서 연결할 수 있는 정형 데이터 저장소의 유형은 다음과 같습니다.

* Amazon Redshift
* AWS Glue Data Catalog (AWS Lake Formation)

## Structured Data vs Unstructured Data

| 특성 | Structured Data | Unstructured Data |
|---|---|---|
| 데이터 형식 | 고정된 형식 | 가변적인 형식 |
| 저장 방식 | 관계형 DB | NoSQL DB, 파일 시스템 |
| 검색 용이성 | 쉬움 | 상대적으로 어려움 |
| 확장성 | 제한적 | 높음 |
| 분석 난이도 | 쉬움 | 복잡함 |
| 저장 공간 | 효율적 | 더 많은 공간 필요 |

