
띵스 플로우 과제

api server와 DB를 관장하는 서버로 분리했어 작업을 해야 하지만
과제 중심으로 1개 서버에 로직을 모두 구현했습니다.

api 문서는 swagger로 대신하겠습니다.

1. api/v1/user/signup 으로 이메일로 가입하시면 됩니다.
2. api/v1/user/login 으로 가입한 이메일로 접속하시면 됩니다.
   1. return되는 token으로 Bearer {{token}}
   2. token 생명 주기는 하루 입니다. 하루가 지나면 다시 로그인 하시면 갱신 됩니다.
3. api/v1/heart/charging/heart 일반하트 충전
4. api/v1/heart/charging/bonus_heart 보너스 하트 충전
5. api/v1/heart/payment 로 하트 사용하기
   1. 하트를 사용하게되면 soft delete로 deletedAt에 사용한 날짜가 들어가게 됩니다

DB는 aws ec2에 임시로 준비했습니다.
 - config 폴더에 cofig.dev.json 참고 하시면 됩니다.
 - db table은 src/db.sql 참고하시면 됩니다.

source directory
 - routes directory는 api 처리를 담당 합니다
 - src는 directory는 db,key,middleware 폴더를 가지고 있습니다
  

```
AWS OS : ubuntu 18.04 LTS
mysql : 5.7.38-0ubuntu0.18.04.1
node : v14.16.1
npm : 7.9.0
```

## swagger 문서 만들기
```
 npm run api-docs 
 or 
 yarn api-docs
```

## swagger 문서보기
   서버 작동하기 전 아래 명령어로 swagger 문서를 만든다
```
    npm run api-docs 
    or 
    yarn api-docs
```
  swagger 문서를 만들고 나서 서버를 구동시키고 나서
  아래 경로로 접속하면 확인 가능합니다.
```
 http://localhost:7300/api-docs/
```

## 서버 시작하기
```
 npm run local 
 or 
 yarn local
```