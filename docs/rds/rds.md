# Amazon RDS MySQL 실습
## Amazon RDS(Relational Database Services)에 대하여

![RDS_001](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.001.jpeg)

Amazon Relational Database Service(RDS)를 사용하면 클라우드에서 관계형 데이터베이스를 간편하게 설정, 운영 및 확장할 수 있습니다. 하드웨어 프로비저닝, 데이터베이스 설정, 패치 및 백업과 같은 시간 소모적인 관리 작업을 자동화하면서 비용 효율적이고 크기 조정 가능한 용량을 제공합니다. 사용자가 애플리케이션에 집중하여 애플리케이션에 필요한 빠른 성능, 고가용성, 보안 및 호환성을 제공할 수 있도록 지원합니다.

AWS는 모든 애플리케이션의 요구 사항에 맞는 가장 포괄적인 옵션을 제공하는 목적별 데이터베이스를 제공합니다. AWS는 특별히 구축된 [데이터베이스](https://aws.amazon.com/ko/products/databases/?nc1=h_ls)를 광범위하게 선택하여 비용 절감, 성장 및 혁신을 더 빠르게 구현할 수 있습니다.

수십만 명의 고객이 다음과 같은 특성을 가진 AWS 데이터베이스를 사용하고 있습니다:
- 목적별 데이터베이스
- 대규모 성능
- 완전관리형
- 보안 및 고가용성

다양한 산업의 고객들은 AWS에서 제공하는 목적별 데이터베이스를 사용하여 다음과 같은 주용한 애플리케이션을 구동합니다:
- 확장 가능한 인터넷기반 애플리케이션
- 실시간 애플리케이션
- 오픈 소스 애플리케이션
- 엔터프라이즈 애플리케이션

> 본 실습을 완료하기 위해서는 EC2 Linux 실습이 선행되어야 합니다. 

![RDS_002](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.002.png)

아래의 순서대로 실습을 진행합니다:
1. VPC 보안 그룹 생성하기
2. RDS 인스턴스 시작하기
3. RDS 인스턴스 접근하기
4. RDS 인스턴스 크기 조정하기
5. RDS 스냅샷 생성하기
6. RDS 인스턴스 삭제하기

# [1] VPC 보안 그룹 생성하기

사전 실습: EC2 Linux 실습

## VPC 보안 그룹 생성

EC2 Linux 실습에서 웹 서버용으로 TCP 80번 포트를 허용하는 `Stem Day - Web Server`라는 보안 그룹을 생성하고 웹 서버 EC2 인스턴스를 생성했습니다.

먼저 웹 계층의 트래픽만을 허용하는 데이터베이스 계층에 대해 새로운 VPC 보안 그룹 `Stem Day - DB Tier`를 생성합니다.

1. [VPC 콘솔](https://console.aws.amazon.com/vpc)에서 Security Groups를 클릭한 다음 Create Security Group 버튼을 클릭합니다.
    

2. 아래와 같이 보안 그룹 이름과 설명을 입력하고 VPC 설정을 EC2 인스턴스가 생성되었던 VPC와 동일하게 유지합니다.

   ![security_group_set](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.005.jpeg)

    |키|값|
    |-|-|
    |Security group name(보안 그룹 이름)| `Stem Day DB Tier`|
    |Description(설명)|`Stem Day DB Tier`|
    |VPC|`VPC-xxxxxx (default)` – EC2 가 있는 VPC 와 동일한 VPC 를 선택|

3. "**Inbound Rule**"에서 **Add Rule** 버튼을 클릭합니다.
   
4. 웹 계층의 EC2 서버에 대한 새로운 인바운드 규칙을 추가합니다.
   유형은 **MySQL/Aurora(3306)**, 프로토콜 **TCP(6)**을 선택하며, Souce에 EC2 인스턴스가 속한 보안 그룹의 이름을 입력합니다.
   입력하는 동안 해당 이름과 일치하는 보안 그룹 목록이 표시되어야 합니다.

   ![security_group](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.006.jpeg)

5. Name 태그와 그룹 이름을 `Stem Day DB Tier`로 설정합니다.
   
6. 아래로 스크롤 하여 Create security group 버튼을 클릭합니다. 
   
   ![create_sg_click](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.007.jpeg)

이제 RDS 인스턴스에 대한 보안 그룹이 생성되었습니다.

# [2] RDS 인스턴스 시작하기
## RDS 인스턴스 구성
이제 데이터베이스용 VPC 보안 그룹이 준비되었으므로 MySQL RDS 인스턴스를 구성하고 시작하겠습니다.

1. [RDS 콘솔](https://ap-northeast-2.console.aws.amazon.com/rds)을 엽니다.
   
2. **Create database**를 클릭합니다

   ![RDS_003](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-01.png)

3. "**Choose a database creation method**"에서 `표준 옵션(Standard create)`을 선택합니다. 
   (참고) **Easy Create** 옵션은 데이터베이스 배포를 시작할 때 권장되는 모범 사례 구성을 제공합니다.
   **Engine Options**에서 **MySQL**을 선택합니다. 
   MySQL을 데이터베이스 엔진으로 선택하면 최신 버전이 자동으로 선택됩니다. 이번 실습에서는 `MySQL 5.7.x`를 선택합니다.

   ![db_setting](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-02.png)

4. **Templates**의 경우, Production, Dev/Test, Free tier 세 가지 옵션을 선택할 수 있습니다. 이번 실습에서는 `Free tier`를 선택합니다.

   ![Template_select](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-03.jpg)

5. **Settings** 섹션에서 각 필드에 대해 다음과 같이 입력합니다.

    ![db_setting_2](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-04.png)

    | 키 | 값 |
    | - | - |
    | DB instance identifier | awsdb |
    | Master username | awsuser |
    | Master password | awspassword |


6. DB Instance size 섹션에서 **DB instance class**에 대해 `burstable classes-db.t2.micro`를 선택합니다. 

   ![instance_class](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-05.jpg)

7. Storage 섹션에서 **Storage Type**을 `General Purpose SSD`로 선택합니다.

   ![storage_setting](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-06.png)

8. 템플릿 옵션을 실습 또는 애플리케이션 테스트의 목적으로만 사용하는 Free tier로 선택했기 때문에 Multi-AZ deployment가 필요하지 않습니다. **Availability & durability** (가용성 및 내구성) 섹션은 비활성화됩니다.

   ![availability_durability](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/db/rds_multiAZ.png)

9.  **Connectivity** 섹션은 아래와 같이 구성합니다.

    ![connectivity](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.014.png)
    
    |키|값|
    |-|-|
    |VPC|`Default VPC`|
    |DB subnet group|`default`|
    |Public access|`No`|
    |VPC security group(s)|`existing VPC security groups` > `Stem Day DB Tier`|
    |Availability zone|`No preference`|
    |Database port|`3306`|

10. **Database authentication**의 경우, 두 가지 옵션 중에서 선택할 수 있습니다.

    이번 실습에서는 `Password and IAM database authentication`을 선택합니다.

    ![db_auth](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-08.jpg)

    -  **Password authentication**: 데이터베이스 비밀번호로만 사용자 인증
    -  **Password and IAM database authentication**: 사용자가 데이터베이스 암호와 IAM 역할 및 정책을 통해 사용자 자격 증명으로 인증

   

11. **Additional Configuration**을 펼칩니다.
    - Database options에 대해 아래와 같이 설정합니다.

        ![db_options](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.016.jpeg)

        - Initial database name: `stemday`
        - DB parameter group: `default.mysql5.7`
        - Option group: `default:mysql-5-7`

    - Backup은 아래와 같이 설정합니다.

    ![backup](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-create-10.jpg)

      - Enbale automatic backups: 활성화 (체크 표시)
      - Backup retention period: `7 days`
      - Backup Window: `No preference`

    - Log exports는 CloudWatch에서 분석하려는 로그 유형을 다양한 옵션 중에서 선택할 수 있도록 합니다. 이 항목은 기본 값을 그대로 사용합니다.
    - Maintentace의 기본 옵션은 자동 마이너 버전 업그레이드 활성화하도록 되어 있으며, Maintenance window(유지 관리 기간)은 'No preference'(기본 설정 없음)으로 선택됩니다.
    - Deletion protection을 선택하면 데이터베이스가 실수로 삭제되지 않도록 보호하고, 이 옵션이 활성화되어 있는 동안에는 데이터베이스를 삭제할 수 없습니다. 이 항목은 기본 값을 그대로 사용합니다.
    
    ![setting](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/db/rds_misc.png)

12. 마지막으로 선택한 구성에 대한 예상 비용이 표시됩니다. 

    ![billing](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.019.png)

13. 설정을 검토하고 **Create database**를 클릭합니다.
    
14. RDS 대시보드에서 상태가 "**creating**"에서 "**backing up**" > "**available**"으로 변경될 때까지 새로운 DB 인스턴스를 모니터링 합니다.
    > 데이터베이스가 생성되고 백업되는 동안 최대 5분 소요될 수 있습니다.

# [3] RDS 인스턴스에 접근하기
## RDS 인스턴스 접근

생성된 RDS MySQL 로 접속해도록 합니다.

1. 접속 정보를 확인합니다. 생성된 RDS 인스턴스를 콘솔에서 확인하고 인스턴스명을 클릭하고 들어갑니다. 

   ![check_instance](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.020.jpeg)

2. Connectivity & security 탭의 **Endpoint** 정보를 확인합니다.

   ![endpoint_info](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.021.jpeg)
   이 값을 메모장에 따로 기록해둡니다.

3. PUTTY.exe 터미널 프로그램을 열고, 이전에 접속했던 **web-server 접속**을 눌러(Load > Open) 터미널로 접속합니다.

   ![putty_connect](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.022.jpeg)

4. `ec2-user`로 접속하고, 다음의 명령을 수행하여 db client를 설치하고 db에 접속합니다.

   ![putty_login](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.023.png)

   - db client 설치: `sudo dnf install mariadb105`
   - db 접속: `mysql -h <DB엔드포인트> -P 3306 -u awsuser -p`
     - `-P`: 포트 번호 설정
     - `-u`: 유저 설정
    

5. 데이터베이스 생성 등의 SQL 명령어를 입력할 수 있습니다.
    - test 데이터베이스 생성: `create database test;`
    - test 데이터베이스 사용 설정: `use test;`
    - stem 테이블 생성: `create table(col1 int, col2 varchar(10));`
    - 테이블에 값 삽입: `insert into stem values(1, 'stem')`
    - 테이블의 전체 값 조회: `select * from stem;`

# [4] RDS 인스턴스 크기 조정하기
## RDS 인스턴스 크기 수정
1. **RDS DB 인스턴스**를 선택하고 **Instance actions**을 클릭한 다음 **Modify**를 클릭합니다.

   ![RDS_004](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-optional-03.jpg)

2. Large instance (t2.samll)로 편집하고 원하는 경우 데이터베이스 사이즈를 동시에 확장합니다. 

   ![db_instance_modify](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.025.jpeg)
   - DB instance class: `db.t3.small`
   - Allocated storage: `30`GiB

3. 다음 화면에서 Apply Immediately을 클릭합니다. 클릭하지 않으면 변경 사항이 다음 유지 관리 기간 동안에 변경 사항이 적용됩니다.

   ![RDS_005](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-optional-05.jpg)

이와 같이 언제든지 인스턴스의 크기를 늘리거나 줄일 수 있습니다. 그러나 데이터베이스를 확장한 후에는 축소할 수 없습니다. 
백업과 바찬가지로 이러한 작업을 수행하는 동안 다운타임이 발생하게 됩니다.
일반적으로 데이터베이스 크기 또는 시스템 크기 조정과 같은 주요 RDS 재구성에는 4분~12분이 소요됩니다.

# [5] RDS 스냅샷 생성하기
## RDS 스냅샷 생성
스냅샷을 생성하면 알려진 상태의 DB 인스턴스를 원하는 만큼 자주 백업한 다음 언제든지 특정 상태로 복원할 수 있습니다.

1. RDS 콘솔에서 RDS 인스턴스를 선택하고 **Actions** 메뉴를 클릭한 후, **Take snapshot**을 선택합니다.

   ![take_sanpshot](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.027.jpeg)

2. 스냅샷의 이름(Snapshot Name)으로 `Stem-day-snapshot`을 입력하고, **Take snapshot** 버튼을 클릭합니다. 

   ![stem_snapshot](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.028.jpeg)

   이번 실습에서 사용하는 데이터베이스는 사이즈가 작기 때문에 총 백업 시간도 매우 짧습니다.
  
3. 데이터베이스 스냅샷은 화면 왼쪽의 **Snapshots 메뉴**를 클릭하여 확인할 수 있습니다. 

   ![db_backup](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.029.jpeg)

   **Actions** 메뉴에서 **Restore snapshot**을 선택하여 이전 스냅샷에서 동일한 새로운 RDS 인스턴스를 쉽게 만들 수 있습니다.
    
   ![restore_snapshot](https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.b552e671-f493-4121-8a99-799535ec60b4.030.jpeg)

  

# [6] 실습 자원 삭제하기
## RDS 인스턴스 삭제하기

1. 이번 실습에서 생성한 RDS 인스턴스를 선택합니다. 오른쪽 상단의 **Actions** 메뉴에서 **Delete**를 클릭합니다.
    
   ![delete_click](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-cleanup-01.jpg)

2. 최종 스냅샷 생성 옵션과 함께 DB 인스턴스를 삭제할 것인지 묻는 팝업이 표시됩니다.
    
   ![check_popup](https://static.us-east-1.prod.workshops.aws/public/444df362-a211-4686-869b-77496f0dd3be/static/images/rds/gid-rds-cleanup-02.jpg)
    
   - **Create final snapshot** 옵션을 선택 해제 합니다.
   - 본인이 이 인스턴스를 삭제했을 때 시스템 스냅샷 및 특정 시점 복구를 포함한 자동 백업을 더 이상 사용할 수 없음을 인지하고 있다는 메세지를 클릭합니다.
   - `delete me`를 입력합니다.
   - **Delete** 버튼을 클릭하여 DB 인스턴스를 완전히 삭제합니다.