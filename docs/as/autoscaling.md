# EC2 오토스케일링 실습

<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.001.png" />

본 실습에서는 먼저 CloudFormation으로 생성된 웹에서 Amazon Machine Image(AMI)를 생성하는 과정을 안내합니다. 그런 다음 시작 템플릿을 만들고 Appliction Load Balancer(ALB) 뒤에 있는 오토 스케일링 그룹 내에서 웹을 설정하는 과정을 안내합니다. 최종 결과는 호스트의 CPU 사용률에 따라 로드 밸런서 뒤의 오토 스케일링 그룹이 확장되는 것을 확인할 수 있습니다.

- 본 실습에 포함된 서비스 및 개념
  - 주요 내용: 오토 스케일링, 시작 템플릿, 보안 그룹 생성 및 구성
  - 부수적인 내용: AMI(아마존 머신 이미지), 애플리케이션 로드 밸런서

- 본 실습은 아래의 순서로 진행됩니다
    - 실습 준비
        - 시작 템플릿 생성하기
        - 오토 스케일링 그룹 설치하기
        - 보안 그룹 구성하기
        - 오토 스케일링 그룹 테스트하기
        - 실습 자원 삭제하기

- 실습 텍스트 범례
  - "회색 강조 표시가 있는 따옴표로 묶은 텍스트" - 콘솔에서 헤더, 제목 또는 이름을 참조합니다.
  - **굵은 글씨** - 클릭하거나 선택해야 하는 버튼, 링크 또는 드롭다운을 나타냅니다.
  - 인라인 코드 - 입력을 위해 복사해야 하는 텍스트입니다(더 긴 텍스트에는 복사 버튼이 있으며, 더 짧은 텍스트는 강조 표시됩니다).
  - 괄호가 포함된 인라인 코드 - 괄호 안의 텍스트는 고유한 입력이 필요한 텍스트를 나타냅니다.

 

### 실습 준비

**Auto-Scaling 그룹에 대한 AMI(Amazon Machine Image)를 생성하려면 먼저 웹 호스트를 설정해야 합니다. 인스턴스에서 AMI를 생성한 다음 로드 밸런서 뒤에서 인스턴스의 개수를 자동으로 조정합니다. [CloudFormation](https://aws.amazon.com/cloudformation/)을 사용하여 EC2에서 웹 호스트를 구축합니다.**

#### CloudFormation 템플릿 다운로드 및 실행하기
1. CloudFormation 템플릿인 "EC2-Auto-Scaling-Lab.yaml" 파일을 생성하고 아래 코드를 **복사 및 붙여넣기**하여 로컬 드라이브에 파일을 저장합니다.
  ```yaml
  AWSTemplateFormatVersion: 2010-09-09
  Description: This CloudFormation template will produce the web host to build your AMI
  Parameters:
    AmiID:
      Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
      Description: The AMI ID - Leave as Default
      Default: '/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2'
    InstanceType:
      Description: Web Host EC2 instance type
      Type: String
      Default: m5.large
      AllowedValues:
        - t2.micro
        - m5.large
    MyVPC:
      Description: Select Your VPC (Most Likely the Default VPC)
      Type: 'AWS::EC2::VPC::Id'
    MyIP:
      Description: Please enter your local IP address followed by a /32 to restrict HTTP(80) access. To find your IP use an internet search phrase "What is my IP".
      Type: String
      AllowedPattern: '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(32))$'
      ConstraintDescription: Must be a valid IP CIDR range of the form x.x.x.x/32
    PublicSubnet:
      Description: Select a Public Subnet from your VPC that has access to the internet
      Type: 'AWS::EC2::Subnet::Id'

  Resources:
    WebhostSecurityGroup:
      Type: 'AWS::EC2::SecurityGroup'
      Properties:
        VpcId: !Ref MyVPC
        GroupName: !Sub ${AWS::StackName} - Website Security Group
        GroupDescription: Allow Access to the Webhost on Port 80
        SecurityGroupIngress:
          - IpProtocol: tcp
            FromPort: '80'
            ToPort: '80'
            CidrIp: !Ref MyIP
        Tags:
          - Key: Name
            Value: !Sub ${AWS::StackName} - Web Host Security Group
    WebServerInstance:
      Type: 'AWS::EC2::Instance'
      Properties:
        ImageId: !Ref AmiID
        InstanceType: !Ref InstanceType
        Tags:
          - Key: Name
            Value: !Sub ${AWS::StackName}
        NetworkInterfaces:
          - GroupSet:
              - !Ref WebhostSecurityGroup
            AssociatePublicIpAddress: 'true'
            DeviceIndex: '0'
            DeleteOnTermination: 'true'
            SubnetId: !Ref PublicSubnet
        UserData: 
          Fn::Base64:
            !Sub |
            #!/bin/bash -xe
            yum -y update
            yum -y install httpd
            amazon-linux-extras install php7.2
            yum -y install php-mbstring
            yum -y install telnet
            case $(ps -p 1 -o comm | tail -1) in
            systemd) systemctl enable --now httpd ;;
            init) chkconfig httpd on; service httpd start ;;
            *) echo "Error starting httpd (OS not using init or systemd)." 2>&1
            esac
            if [ ! -f /var/www/html/ec2-web-host.tar.gz ]; then
            cd /var/www/html
            wget https://workshop-objects.s3.amazonaws.com/general-id/ec2_auto_scaling/ec2-web-host.tar
            tar xvf ec2-web-host.tar
            fi
            yum -y update
  Outputs:
    PublicIP:
      Value: !Join 
        - ''
        - - 'http://'
          - !GetAtt 
            - WebServerInstance
            - PublicIp
      Description: Newly created webhost Public IP
    PublicDNS:
      Value: !Join 
        - ''
        - - 'http://'
          - !GetAtt 
            - WebServerInstance
            - PublicDnsName
      Description: Newly created webhost Public DNS URL
  ```
2. AWS 콘솔에서 CloudFormation 을 검색하거나 **Services** 메뉴를 선택하고 "Management & Governance" 밑에 위치한 **CloudFormation** 을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.002.png"/>
<br/><br/>

3. CloudFormation 콘솔 창에서 **Create Stack** 버튼을 클릭하고 **With new resources (standard)**를 선택합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.003.png"/>
<br/><br/>

4. **Create Stack** 창 중간에 "Template source" **Upload a template file**을 선택하고 **Choose file** 버튼을 클릭합니다. 첫 번째 스텝에서 다운로드한 "EC2-Auto-Scaling-Lab.yaml" 템플릿 파일을 선택합니다. 템플릿 파일 선택이 완료되면 **Next** 버튼을 클릭합니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.004.png"/>
<br/><br/>


5. Specify stack details 페이지에서 아래와 같이 빈칸을 채워놓습니다:
  
  a. "Stack name" 필드에는 [이니셜]-EC2-Web-Host와 같은 포맷으로 스택 이름을 기입합니다.
  
  b. "InstanceType" 필드에는 **m5.large** 또는 t3.micro 인스턴스 타입을 선택합니다. 실제 운영 환경에서의 성능을 검증하기 위해서 m5.large 인스턴스 타입 사용을 권장 드립니다. T3 타입의 인스턴스 경우 운영 환경에서 권장 드리지 않고 있습니다. m5 타입의 인스턴스 선택의 어려움이 있으실 경우, Cloudformation 템플릿을 다시 불러오고 t3.micro 선택하여 실습을 진행하는 데 무리는 없습니다.
  
  c. “MYIP” 는 접속하는 Local PC IP 를 입력합니다. 아래의 예에서 54.239.119.4/32 형식으로 입력합니다.
  
  <img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.005.png" />

  d. "MyVPC" 필드에는 인스턴스가 올라갈 VPC를 **선택**합니다. 대부분 계정의 경우, default VPC를 사용하셔도 무방하고 새로 생성된 계정의 경우 따로 VPC를 생성하지 않은 경우 default VPC만 옵션으로 제공됩니다.

  e. "PublicSubnet" 필드에는 위에서 선택한 VPC내에서 인터넷 엑세스가 가능한 서브넷을 **선택**합니다. 퍼블릭 서브넷은 라우팅 테이블에 인터넷 게이트웨이로 라우팅되어 있게 설정되어 있음을 확인할 수 있습니다. 기본 VPC내에 서브넷은 기본적으로 전부 퍼블릭 서브넷입니다.

  <img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.006.jpeg"/>


6. 위와 같이 정보를 기입 완료 시, **Next** 버튼을 클릭합니다. 다음 페이지인 "Configure stack options" 에서 "Tags" 와 "Permissions" 과 "Advanced options" 을 기본값으로 두고 **Next** 버튼을 클릭합니다.
7. Review [이니셜]-EC2-Web-Host 페이지에서 설정된 값을 확인하고 **Create stack**을 클릭하여 웹 서버 생성을 시작합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.007.png"/>


8. "Logical ID", "[이니셜]-EC2-Web-Host"의 status가 "CREATE_COMPLETE"가 될 때 까지 기다립니다. 
9. CloudFormation stack 생성이 완료되기까지는 대략 3분 정도가 소요 됩니다.

#### 인스턴스가 제대로 생성되었는지 확인하기
1. **Services** 탭에서 **EC2** 를 선택하거나 콘솔 검색창에서 EC2 를 검색하여 EC2 서비스 페이지로 이동합니다.
2. 왼쪽 탭에서 **Instances**를 선택합니다. "Instances" 페이지에서 "[이니셜]-EC2-Web-Host" 인스턴스를 선택하고 "Public IPv4 DNS" 주소를 아래와 같이 Public IPv4 DNS 왼쪽에 위치한 네모가 겹쳐져 있는 이미지를 클릭하여 클립보드에 복사합니다. 웹 브라우저의 새로운 탭을 열고 복사한 주소를 붙혀넣습니다.

  "Public IPv4 DNS" 밑에 위치한 open address 링크 클릭 시 제대로된 경로의 웹사이트를 열 수 없습니다. "open address" 링크는 http:// 대신 https://를 사용하기 때문에 현재 인스턴스 설정에서는 SSL 인증을 설정하지 않았기 때문에 에러 페이지가 나타나는 것을 확인할 수 있습니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.008.png"/>


3. "EC2 Instance Metadata" 라는 타이틀을 가진 페이지를 확인하실 수 있습니다. 
4. 페이지를 불러오는 데 시간이 걸리실 경우, "Status check" 가 "2/2 checks passed" 로 변경될 때까지 기다리고 다시 페이지를 열어보세요. 메타데이터는 비슷해 보일 수 있지만 위 이미지와 정확히 똑같이 보이지는 않을 겁니다.

#### 생성된 EC2내에 웹 서버의 Custom AMI 만들기 - Linux Lab
현재 웹 사이트를 호스트할 수 있는 인스턴스가 프로비저닝된 상태입니다. auto scaling group을 위해 custom 머신 이미지를 만들 것입니다. 웹 서버의 이미지를 생성하고 이를 기반으로 들어오는 트래픽에 따라 여러 인스턴스로 확장할 수 있게 auto scaling group을 설정할 것 입니다.

1. EC2 콘솔 페이지내에 Instance 탭에서 인스턴스가 실행 중이거나 중지 중인 상태에서 Amazon Machine Images (AMIs)를 생성하실 수 있습니다. EC2 콘솔로 다시 돌아가거나 새로 콘솔 창을 엽니다.
2. "[이니셜]-S3-Web-Host" 이름으로 설정된 웹 호스트 인스턴스에서 **오른쪽 버튼 클릭** 을 하시고 "Image and templates" 탭에서 **Create image** 버튼을 클릭합니다. (다른 방법으로는 해당 인스턴스를 선택하고 오른쪽 위 Action 메뉴 버튼을 클릭하여서 진행하실 수 있습니다.)


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.009.png"/>


3. "Create Image" 페이지에서 Image name 와 description에 [이니셜]-S3-Web-Host 을 기입합니다. Instance volumes 은 기본 값으로 두시고 **Create Image** 버튼을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.010.png"/>


4. AMI를 생성하는 데 몇 분의 시간이 소요됩니다. EC2 콘솔내에서 왼쪽 "Images" 탭에서 **AMIs** 버튼을 클릭합니다. 방금 생성된 AMI를 확인하실 수 있고 현재 pending 상태일 것입니다. 조금 기다리시면 상태가 available로 변경되는 것을 확인하실 수 있습니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.011.png"/>


##### 지금까지 Amazon Machine Image 생성을 완료 했습니다. 이제 오토 스케일링에 필요한 Security Group (보안 그룹) 설정으로 넘어가겠습니다.

#### 오토 스케일링 그룹에 필요한 새로운 Security Group(보안 그룹) 만들기
Launch Template (시작 템플릿)을 설정하기 전에 오토 스케일링 그룹에 필요한 보안 그룹을 설정할 것입니다. 보안 그룹은 인스턴스 (가상 머신) 레벨에서 적용되는 방화벽입니다. 보안 그룹에 대한 자세한 내용이 필요하시면 [이 페이지](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)를 참고해주세요.

1. 콘솔 내에서 "Services" 탭 아래 **EC2**를 선택하거나 콘솔 검색 창에서 EC2 를 검색합니다. EC2 페이지내 왼쪽 메뉴에서 "Network & Security" 아래 위치한 **Security Groups** 버튼을 클릭합니다. [Your Initials]-EC2-WEb-Host - Website Security Group 와 같은 다른 Security Group을 확인하실 수 있습니다. 새로운 security group 생성하기 위해 **Create security group** 버튼을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.012.png"/>


2. Security group 이름을 [이니셜] - Auto Scaling SG 로 기입하고 description 또한 같은 이름으로 설정합니다. 꼭 올바른 VPC를 선택해주시기 바랍니다. (대부분의 경우 기본 VPC ,Default VPC, 가 기본값으로 설정되어 있습니다.)
3. "Inbound rules" 탭 아래에 현재 어떤 규칙도 설정이 되어져 있지 않는 것을 확인하고 그대로 아무값이 없는 형태로 둡니다. 규칙에 대한 설정이 이후에 진행할 예정이며 해당 설정을 하기 전 로드 밸런서를 먼저 생성하셔야 합니다.
4. "Outbound rules" 탭 아래에 모든 트래픽이 허용되어져 있음을 확인하고 따로 추가적인 규칙을 설정하지 않으셔도 됩니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.013.png" />


5. 끝으로 Create security group 버튼을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.013.png"/>

 

### 시작 템플릿 생성하기

#### 오토 스케일링 실습 아키텍쳐


 아래 그림은 실습을 완료하시게 되면 확인할 수 있는 최종 아키텍쳐입니다. 본격적으로 진행해봅시다! 

<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.014.png"/>

#### EC2 오토 스케일링을 구성하는 3가지 주요 구성 요소
1. **Launch Template(시작 템플릿):** 시작 템플릿은 시작 요청을 템플릿화하는 방법을 허용하는 EC2 Auto Scaling의 기능입니다. 이를 통해 인스턴스를 시작할 때마다 지정할 필요가 없도록 시작 매개변수를 저장할 수 있습니다. 예를 들어 시작 템플릿에는 일반적으로 인스턴스를 시작하는 데 사용하는 특정 Amazon 머신 이미지, 인스턴스 유형, 스토리지 및 네트워킹 설정이 포함될 수 있습니다. 각 시작 템플릿에 대해 하나 이상의 번호가 지정된 시작 템플릿 버전을 생성할 수 있습니다. 각 버전에는 다른 시작 매개변수가 있을 수 있습니다.
2. **Auto Scaling Groups(오토 스케일링 그룹):** Auto Scaling을 위해 EC2 인스턴스는 그룹으로 구성되어 확장 및 관리 목적으로 논리적 단위로 취급될 수 있습니다. 그룹을 생성할 때 최소, 최대 및 원하는 EC2 인스턴스 수를 지정할 수 있습니다.
3. **Scaling Policies(조정 정책):** 조정 정책은 Auto Scaling에서 조정 시기와 방법을 알려줍니다. 조정은 일정에 따라 요청 시 수동으로 수행하거나 Auto Scaling을 사용하여 특정 수의 인스턴스를 유지할 수 있습니다.

  Auto Scaling은 시간별, 일별 또는 주별 사용량 변동을 경험할 수 있는 예측할 수 없는 수요 패턴이 있는 애플리케이션에 적합합니다. 이를 통해 비용을 관리하고 필요하지 않은 시간에 용량의 과잉 프로비저닝을 제거할 수 있습니다. Auto Scaling은 또한 비정상 인스턴스를 찾아 해당 인스턴스를 종료하고 확장 계획에 따라 새 인스턴스를 시작할 수 있습니다.

  Auto Scaling이 이러한 그룹을 생성할 때 정의한 지표에 응답함에 따라 EC2 인스턴스의 수를 축소 또는 축소할 수 있습니다.
    - 그룹이 설정한 크기 아래로 떨어지지 않도록 각 Auto Scaling 그룹의 최소 인스턴스 수를 지정할 수 있습니다. (인스턴스가 비정상인 경우에도)
    - 그룹이 설정한 크기를 초과하지 않도록 각 Auto Scaling 그룹의 최대 인스턴스 수를 지정할 수 있습니다.
    - 원하는 용량을 지정하여 Auto Scaling 그룹이 항상 보유해야 하는 정상 인스턴스 수를 지정할 수 있습니다. (자세한 정보는 [여기서](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-maintain-instance-levels.html) 확인하실 수 있습니다)
    - Auto Scaling이 이전 지점에서 언급한 원하는 목표 용량을 수정하도록 조정 정책을 지정할 수 있습니다. 애플리케이션에 대한 수요가 증가하거나 감소하면 인스턴스를 시작하거나 종료합니다.

#### 시작 템플릿 생성하기

오토 스케일링 그룹을 설정할 때 시작 템플릿을 설정하셔야 합니다. 첫번째 단계로 EC2 오토 스케일링 그룹에 필요한 시작 템플릿을 생성하도록 하겠습니다.

1. "Services" 탭에서 **EC2**를 선택합니다.
2. 왼쪽 메뉴 탭에서 "Instances" 아래 위치한 **Launch Templates** 버튼을 클릭합니다.
3. **Create launch template** 버튼을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.015.jpeg" />


4. "Create launch template" 페이지로 이동하시게 되고 아래와 같이 "Launch template name과 description" 을 작성합니다.
    
    a. Launch template name: [이니셜]-scaling-template
    
    b. Template version description: 선택 사항
    
    c. Auto scaling guidance: 오토 스케일링 설정을 위한 **체크 박스** 선택 을 해주세요
5. "Launch Template Contents" 에서 오토 스케일링 그룹 설정에 필요한 인스턴스 파라미터를 설정할 수 있습니다:
    
    a. Amazon machine image (AMI): 해당 버튼을 클릭하시면 드랍 다운 형태로 AMI를 찾을 수 있고 이전에 생성한 custom AMI **[이니셜] - Auto Scaling Webhost**를 선택합니다. "My AMIs" 아래에서 확인하실 수 있습니다.
    
    b. Instance type: **t2.micro**
    
    c. Key pair (Login): 첫번째 실습에서 생성한 Key Pair를 선택 합니다. 높은 확률로 Key Pair 이름은 [이니셜]-KeyPair 일것입니다.
    
    d. Networking Settings:

      - Network Platform: **Virtual Private Cloud (VPC)**
      - Security groups: **[이니셜]-EC2-Web-Host - Auto Scaling SG** 이라는 이름의 첫번째 실습에서 생성된 security group을 선택합니다.
    
    e. Storage (volumes): 기본값으로 둡니다.
    
    f. Resource tags: None
    
    g. Network interfaces: 자동 크기 조정된 인스턴스에 추가 네트워크 인터페이스를 추가하지 않습니다.
    
    h. Advanced Details: **중요**: "Advanced details" 탭을 확장하고 "Detailed Cloudwatch monitoring" 에서 **Enable** 버튼을 클릭합니다. 나머지는 기본 값으로 둡니다.

여기에서 CloudWatch 세부 모니터링을 활성화합니다. 기본적으로 인스턴스에는 5분 간격으로 인스턴스에 대한 기본 모니터링이 있습니다. 세부 모니터링을 활성화하면 CloudWatch가 1분 간격으로 Auto Scaling 그룹의 인스턴스를 모니터링합니다. 이렇게 하면 Auto Scaling 그룹이 그룹의 변경 사항에 더 빠르게 대응할 수 있습니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.016.jpeg" width="100%" />


6. 설정값을 알맞게 작성한 것을 확인하시고 **Create launch template** 버튼을 클릭한 다음 **View launch templates** 버튼을 클릭합니다. 시작 템플릿 생성하기를 완료하였습니다.

### 오토 스케일링 그룹 설정하기

#### 오토 스케일링 그룹 생성하기

지금까지 생성된 인스턴스의 매개변수를 정의하는 시작 템플릿을 생성했습니다. 이제 생성되어야 할 EC2 인스턴스 수와 생성될 위치를 정의할 수 있도록 Auto Scaling 그룹을 생성하겠습니다.

1. EC2 콘솔 페이지로 다시 이동해주세요.
2. 왼쪽 메뉴에서 "Auto Scaling" 을 찾고 **Auto Scaling Groups** 버튼을 클릭합니다.
3. **Create an Auto Scaling group** 버튼을 클릭합니다.
4. 오토 스케일링 그룹 이름을 지정합니다: [이니셜]-Lab-AutoScaling-Group


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.017.png" width="100%" />


5. Launch Template 드랍 다운에서 이전에 생성한 **[이니셜]-scaling-template** 이름의 Launch Template을 선택하고 **Next** 버튼을 클릭합니다. 
6. 설정 페이지를 아래와 같이 설정을 하고 **Next** 버튼을 클릭합니다.
    
    a. Purchase options and instance types: **Adhere to launch template** 버튼 선택
    
    b. Network:
        - VPC: VPC **선택**하기 (대부분 기본 VPC 입니다)
        - Subnets: 호스트를 추가될 때 Auto Scaling 그룹이 사용할 서브넷을 **선택**합니다. (기본 VPC를 사용하는 경우 아래와 같이 서브넷이 4개일 가능성이 큽니다.)
Auto Scaling Group의 모범 사례는 프라이빗 서브넷만 선택하는 것입니다. 인스턴스는 로드 밸런서 뒤에 위치하며 공용 IP 주소가 필요하지 않습니다. 이 실습에서는 프라이빗 또는 퍼블릭 서브넷이 사용될 수 있습니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.018.png" />


7. 로드 밸런서와 헬스 체크 상태 지정하기:
    
    a. Load balancing: **Attach to a new load balancer** 버튼 클릭

    b. Load balancer type: **Application Load Balancer** 버튼 클릭

    c. Load balancer name: [이니셜]-Application-Load-Balancer

    d. Load balancer scheme: **Internet-facing** 버튼 클릭

    e. Networking mapping: 이전 단계에서 선택한 모든 가용 영역과 서브넷이 표시되어야 합니다. (AZ당 서브넷이 여러 개인 경우 이 중에서 선택할 수 있습니다.)

    f. Listeners and routing: Port는 80으로 그대로 둡니다. "Default routing (forward to)" 드랍 다운에서 **Create a target group** 버튼을 선택합니다.

    g. New target group name: [이니셜]-Target-Group

      - 대상 그룹은 로드 밸런서가 트래픽을 분산할 인스턴스를 찾는 위치입니다. 이 그룹에 인스턴스를 자동으로 등록하도록 Auto Scaling 그룹을 설정하고 있으며 로드 밸런서에도 연결됩니다.

      <img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.019.png" />

    h. Health checks & Additional settings: 기본값으로 두고 **Next** 버튼을 클릭합니다. 

8. 아래에서 그룹 크기 및 조정 정책을 구성하고 **Next** 버튼을 클릭합니다.

    a. Group Size: 아래 설정은 조정 정책이 트리거되지 않는 한 그룹 크기를 하나의 EC2 인스턴스로 유지합니다.

    - Desired capacity: 1
    - Minimum capacity: 1
    - Maximum Capacity: 5

    b. Scaling policies: **Target tracking scaling policy** 선택하기

    - Metric type: **Average CPU utilization**
    - Target Value: 25

빠른 실습 진행을 위해서 목표 CPU 사용률을 낮게 설정하겠습니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.020.png" />


9. Notifications 추가하기:

    이메일 주소와 같이 선택한 엔드포인트로 알림을 보내도록 Auto Scaling 그룹을 구성할 수 있습니다. 인스턴스 시작 성공, 인스턴스 시작 실패, 인스턴스 종료, 인스턴스 종료 실패 등 지정된 이벤트가 발생할 때마다 알림을 받을 수 있습니다.

    지금은 이 단계를 건너뛰고 **Next** 버튼을 클릭합니다.

10. Add Tags: 단일 태그를 추가하고 **Next** 버튼을 선택합니다.

    a. **Add Tags** 버튼을 선택하고 다음을 구성합니다:
    - Key: Name
    - Value: [이니셜] - Auto Scaling Group

11. 설정을 검토한 다음 **Create Auto Scaling group** 버튼을 클릭합니다. 지금까지 Auto Scaling 그룹, 대상 그룹 및 로드 밸런서를 생성했습니다.

    a. 곧 EC2 콘솔에서 "[이니셜] - Auto Scaling Group"이라는 이름의 Auto Scaling 그룹이 생성한 새 인스턴스를 볼 수 있습니다. (인스턴스를 보려면 화면을 새로 고침하셔야 합니다.)

    b. 왼쪽 메뉴의 "Load Balancing"에서 **Load Balancers**를 선택하면 로드 밸런서 프로비저닝이 표시됩니다.

다음 단계에서는 추가 보안 그룹을 만들고 ALB와 웹 호스트 간에 트래픽이 흐를 수 있도록 보안 설정을 업데이트하겠습니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.021.png" />


### 보안 그룹 구성하기

#### 로드 밸런서 보안 그룹 생성하기

 
로드 밸런서가 프로비저닝될 때 VPC의 기본 보안 그룹으로 설정되어 있습니다. 공용 DNS를 통해 로드 밸런서에 대한 액세스를 허용하려면 인터넷에서 포트 80의 인바운드 트래픽을 허용하는 보안 그룹을 생성하고 연결해야 합니다.

또한 로드 밸런서에서 나가는 트래픽이 Auto Scaling 보안 그룹 내의 호스트로만 전송되도록 허용하는 아웃바운드 규칙도 생성합니다.

콘솔에서 "Services" 탭을 클릭하고 EC2 를 선택합니다. EC2 콘솔 창에서 왼쪽 메뉴에 위치한 "Network & Security" 탭에서 Security Groups 버튼을 클릭합니다. [이니셜]-EC2-Web-Host - Website Security Group 이름으로 된 다른 보안그룹을 확인하실 수 있습니다. Create security group 버튼을 클릭합니다.

1. 기본 설정:

    a. Security group name: [이니셜]-SG-Load-Balancer

    b. Description: [이니셜]-SG-Load-Balancer

    c. VPC: 기본 VPC 또는 직접 만든 VPC를 선택 (기본 VPC를 사용하셔도 무관합니다.)

2. Inbound rules:

    a. **Add rule** 버튼을 클릭합니다.

    b. Type: HTTP

    c. Source: Custom: 0.0.0.0/0 (이를 통해 모든 소스의 웹 트래픽이 웹 호스트의 페이지를 요청할 수 있습니다.)

3. Outbound rules:

    a. "All traffic" 규칙을 찾아 **Delete**를 클릭하여 규칙을 제거합니다. (모든 아웃바운드 규칙을 제거합니다.)

    b. **Add rule** 버튼을 클릭합니다.

    c. Type: HTTP

    d. "Destination" 아래 **Custom** 버튼을 선택하고 "Destination"에 **[이니셜]-Auto Scaling SG** 을 설정합니다. 힌트: sg 타이핑하여 sg로 시작되는 Security Group 리스트를 불러올 수 있습니다.

    e. 보안 그룹 구성은 아래 이미지와 유사해야 합니다. 완료 시 **Create security group** 버튼을 클릭합니다.

    <img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.022.jpeg" />


4. 새 로드 밸런서 보안 그룹을 로드 밸런서에 연결합니다:

    a. EC2 콘솔 창에서 "Load Balancing" 로 이동한 뒤 **Load Balancers** 버튼을 클릭합니다. 이전에 생성한 로드 밸런서를 클릭합니다. 생성된 로드 밸런서의 state가 "Active" 인지 확인합니다.

    b. "Description" 탭에서 쭉 내려간 다음 "Security" 섹션에서 **Edit security groups** 버튼을 클릭합니다.

    c. [이니셜]-SG-Load-Balancer라는 새 로드 밸런서 sg의 왼쪽에 있는 상자를 선택합니다.

    d. 다른 보안 그룹도 **un-select**한 다음 **Save** 버튼을 클릭합니다.

    <img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.023.jpeg" />


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.024.png" />


#### Auto Scaling 보안 그룹에 인바운드 규칙 추가하기

 
1. 새 로드 밸런서 보안 그룹에서 Auto Scaling 보안 그룹으로의 트래픽만 허용하도록 규칙을 설정해야 합니다. 웹호스트가 인터넷에서 직접 액세스하는 것을 방지하는 보호 계층 중 하나입니다.

    a. EC2 콘솔 창에서 왼쪽 메뉴 "Network & Security" 아래에 **Security Groups** 버튼을 클릭합니다.

    b. 오토 스케일링 Security Group 선택하기: **[이니셜] - Auto Scaling SG**

    c. **Inbound Rules** 탭에서 **Edit inbound rules** 버튼을 클릭하고 **Add rule** 버튼을 클릭합니다.

    d. "Type" 드랍 다운에서 **HTTP** 를 선택합니다. "Source" 필드에서 **Custom**을 선택하고 **[이니셜]-SG-Load-Balancer**을 선택합니다. 힌트: sg 타이핑하여 sg로 시작되는 Security Group 리스트를 불러올 수 있습니다.


규칙이 아래 이미지와 유사하게 표시됩니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.025.jpeg" />


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.026.png"/>


2. 로드 밸런서가 작동하는지 테스트합니다. 현재 Auto Scaling 그룹에서 하나의 인스턴스(또는 대상)만 실행 중이지만 웹사이트에 액세스할 수 있어야 합니다.

    왼쪽 메뉴에서 **Load Balancers**를 선택하여 로드 밸런서 페이지로 돌아갑니다. "Description" 탭에서 DNS 이름을 **복사**하고 웹 브라우저에 **붙여넣기**합니다. 이제 Auto Scaling 그룹에서 로드되는 웹사이트가 표시되어야 합니다. 이 페이지를 열어 두십시오. 다음 단계에서 필요합니다.

<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.027.png" />


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.008.png" />


### 오토스케일링 그룹 테스트하기

#### 오토스케일링 그룹 테스트하기

Auto Scaling 그룹과 로드 밸런서를 생성했으므로 이제 모든 것이 올바르게 작동하는지 테스트해 보겠습니다.

1. 이전 단계에서 로드 밸런서 DNS 주소를 통해 액세스한 웹 사이트에 있는지 확인하세요
2. 첫 페이지 하단에서 Start **CPU Load Generation** 링크를 클릭합니다. CPU 로드가 일정 기간 동안 25% 이상으로 올라가면 Auto Scaling 정책은 수요를 충족하기 위해 시작 템플릿에 지정된 인스턴스를 확장하기 시작합니다 (*처음에 충분한 로드가 생성되지 않으면 이 작업을 두 번 수행해야 할 수도 있습니다.*)


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.028.png" />

3. EC2 콘솔의 "인스턴스" 섹션에서 Auto Scaling에 의해 생성된 새 인스턴스를 볼 수 있으며 몇 분 정도 걸릴 수 있습니다. EC2 인스턴스 페이지를 새로 고치면 곧 새 인스턴스가 자동으로 생성되는 것을 볼 수 있을 것입니다. [이니셜] - Auto Scaling Group이라는 인스턴스를 선택하고 아래의 Monitoring 탭을 클릭하여 "CPU Utilization"을 확인할 수 있습니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.029.png" />


4. Auto Scaling Groups 페이지로 이동하여 이를 확인할 수도 있습니다. https://console.aws.amazon.com/ec2autoscaling 

  그런 다음 자동 스케일링 그룹 **[이니셜]-Lab-AutoScaling-Group**을 선택합니다. 인스턴스 관리 탭에서 세부 정보를 보면 새 인스턴스가 실행되고 있는지 확인할 수 있습니다. 인스턴스 관리 탭에서 현재 그룹에 몇 개의 인스턴스가 있는지 확인할 수 있습니다. 모니터링 탭에는 그룹 크기, 보류 중인 인스턴스, 총 인스턴스 등과 같은 다양한 메트릭이 표시됩니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.030.png" />


현재 아키텍처는 다음과 같습니다.:


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.031.png"/>


5. 여러 개의 새 인스턴스가 성공적으로 시작되면(3개 또는 4개) 웹 호스트에서 웹 브라우저를 반복적으로 새로고침 합니다. 이제 로드 밸런서가 Auto Scaling 그룹 전체에 요청을 분산할 때 인스턴스 ID, 가용 영역 및 사설 IP 변경 사항을 확인해야 합니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.032.png" />

축하합니다! Application Load Balancer 뒤단에 EC2 Auto Scaling 그룹을 성공적으로 생성했습니다.

### 실습 자원 삭제하기
실습에서 만든 리소스를 아래 순서대로 삭제하셔야 합니다.

#### 로드 밸런서 삭제하기
1. 콘솔에서 "EC2" 로 이동합니다. "Load balancing" 아래의 왼쪽 메뉴에서 **Load Balancer**를 선택합니다.
2. **[이니셜]-Application-Load-Balancer**라는 로드 밸런서를 선택합니다.
3. 페이지 상단의 **Actions** 드롭다운을 클릭하고 **Delete**를 선택합니다. 다음 팝업 창에서 **Yes, Delete** 버튼을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.033.png"/>
<br/><br/>

4. 삭제에 성공하면 로드 밸런서가 즉시 제거됩니다.

#### Target Group (대상 그룹) 삭제하기
1. 콘솔에서 "EC2" 로 이동합니다. "Load balancing" 아래의 왼쪽 메뉴에서 **Target Groups**를 선택합니다.
2. **[이니셜]-Target-Group**이라는 대상 그룹을 선택합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.034.png"/>


3. 페이지 상단의 Actions 드롭다운을 클릭하고 Delete를 선택합니다. 다음 팝업 창에서 Yes, Delete 버튼을 클릭합니다.
4. 대상 그룹이 제거되었습니다.

#### 오토 스케일링 그룹 삭제하기
1. 콘솔에서 "EC2" 로 이동합니다. "Auto Scaling" 아래의 왼쪽 메뉴에서 **Auto Scaling Groups**를 선택합니다.
2. **[이니셜]-Lab-AutoScaling-Group**이라는 Auto Scaling 그룹을 선택합니다.
3. 페이지 상단의 **Delete** 버튼을 클릭합니다. 다음 팝업 창에서 텍스트 필드에 delete 를 입력하고 **Delete** 버튼을 선택합니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.035.png"/>


4. 이제 Auto Scaling 그룹의 모든 인스턴스가 종료되며 완료하는 데 몇 분 정도 걸릴 수 있습니다.

#### Launch Template (시작 템플릿) 삭제하기
1. 콘솔에서 "EC2" 로 이동합니다. "Instances" 아래의 왼쪽 메뉴에서 **Launch Templates**를 선택합니다.
2. **[이니셜]-scaling-template**이라는 시작 템플릿을 선택합니다.
3. 페이지 상단의 **Action** 드롭다운을 클릭하고 **delete template**를 선택합니다. 다음 팝업 창에서 텍스트 필드에 delete를 입력하고 **Delete** 버튼을 선택합니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.036.png"/>


4. Launch template이 제거되었습니다.

#### Security Groups (보안 그룹) 제거하기
1. 콘솔에서 "EC2" 로 이동합니다. "Network & Security" 아래의 왼쪽 메뉴에서 **Security Groups**를 선택합니다.
2. **[이니셜]-SG-Load-Balancer**라는 보안 그룹을 선택하고 **Edit inbound rules** 버튼을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.037.png"/>


3. "Edit inbound rules" 페이지에서 **Delete** 버튼을 클릭하여 하나의 규칙을 삭제한 다음 **Save Rules** 버튼을 선택합니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.038.jpeg"/>


4. 이제 **Outbound Rule** 탭을 선택하고 **Edit Outbound Rule** 버튼을 선택합니다.
5. "Edit Outbound Rule" 페이지에서 **Delete** 버튼을 클릭하여 하나의 규칙을 삭제한 다음 **Save Rules** 버튼을 선택합니다.
6. 이제 보안 그룹 이름 **[이니셜] - Auto Scaling SG**만 선택하고 2, 3단계를 반복합니다. (이 보안 그룹에 대한 아웃바운드 규칙을 제거할 필요가 없습니다.)
7. **[이니셜]-SG-Load-Balancer** 및 **[이니셜] - Auto Scaling SG**라는 두 개의 보안 그룹을 선택합니다.
8. 페이지 상단의 **Action** 드롭다운을 클릭하고 **Delete Security Group**를 선택합니다. (Action 메뉴에서 아래로 스크롤해야 할 수도 있습니다.) 다음 팝업 창에서 텍스트 필드에 Delete 를 입력하고 **Delete** 버튼을 선택합니다. 


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.039.png"/>


9. 이제 보안 그룹을 삭제되어져야 합니다. 보안 그룹을 제거할 수 없는 경우 모든 규칙을 성공적으로 제거하지 않았을 수 있습니다.

#### CloudFormation Stack 제거하기
1. 콘솔에서 서비스 또는 검색을 사용하여 CloudFormation을 엽니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.040.png"/>


2. **[이니셜]-EC2-Web-Host**라는 스택을 선택한 다음 **Delete** 버튼을 클릭합니다.


<img src="https://stem-workshop.s3.ap-northeast-2.amazonaws.com/image/Aspose.Words.423f1f4d-7490-414a-96bb-1c43c221c013.041.png"/>


3. 팝업에서 **Delete Stack**를 선택합니다.
4. 스택을 삭제하는 데 몇 분 정도 걸립니다. 업데이트된 상태를 보려면 새로 고침 버튼을 선택하세요. 스택이 삭제되면 스택이 더 이상 표시되지 않습니다.

축하합니다! Auto Scaling 실습을 완료했습니다!