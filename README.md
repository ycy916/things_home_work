create user 'things'@'%' identified by 'thins2022!A'



```
AWS OS : ubuntu 18.04 LTS
mysql : 5.7.38-0ubuntu0.18.04.1
```

## swagger 문서 만들기
```
 npm run api-docs or yarn api-docs
```

## swagger 문서보기
   서버 작동하기 전 아래 명령어로 swagger 문서를 만든다
```
    npm run api-docs or yarn api-docs
```
  swagger 문서를 만들고 나서 서버를 구동시키고 나서
  아래 경로로 접속하면 확인 가능합니다.
```
 http://localhost:7300/api-docs/
```

## 서버 시작하기
```
 npm run local or yarn local
```