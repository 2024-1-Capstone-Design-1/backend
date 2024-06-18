# backend

## BACKEND ( MAC OS )

1. docker 설치
    
    ```
    brew install docker
    ```
    
2. backend 프로젝트 클론:
    
    ```
    git clone https://github.com/2024-1-Capstone-Design-1/backend.git
    ```
    
3. 환경변수 설정:
    
    ```
    클론한 backend 디렉토리 진입 후
    .env 파일 생성 후 안에 복붙
    
    DB_USER=testuser
    DB_HOST=localhost
    D_DB_HOST=postgres
    DB_NAME=test
    DB_PASSWORD=test
    DB_PORT=5432
    JWT_SECRET=test
    JWT_ACCESS_EXPIRATION=30m
    JWT_REFRESH_EXPIRATION=14d
    ```
    
4. backend 실행:
    
    ```
    docker-compose up --build
    ```
