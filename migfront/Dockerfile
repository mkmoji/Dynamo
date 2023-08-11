# ベースイメージを選択
FROM node:14

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーし、依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY src ./src
COPY public ./public


# Reactアプリケーションのビルド
# RUN npm run build

# ポートを指定（Reactアプリのデフォルトポート）
EXPOSE 3000

# アプリを実行
CMD ["npm", "start"]