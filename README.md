# Priority-Decision
## 動作環境
- Windows11
- node 16.15.0
- Heroku

## 初期設定
```
git clone https://github.com/kinoshita0923/Priority-Decision.git
cd Priority-Decision
npm install
cd frontend
npm install
cd ..
npm start
```

## .envについて
`./.env`に以下を記述
```
DB_USERNAME="データベースのユーザ名"
DB_PASSWORD="データベースのパスワード"
DB_HOST="データベースのホスト名"
DB_DATABASE="データベース名"
jwt_password="JWTのパスワード"
```