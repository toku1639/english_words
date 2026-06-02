# Vocab — 英単語学習アプリ

スマホで使える個人用の英単語学習WEBアプリです。

## 機能

- **カード学習** — コンパクトなカードをタップすると詳細が拡大表示。左右スワイプで記録
- **逆方向モード** — 日本語 → 英語 の学習
- **シャッフル** — 出題順をランダム化
- **一覧検索** — 英語・意味・例文などで検索
- **復習** — 間違えた単語を集中的に復習
- **統計** — 習得率、今日の学習数、連続日数、7日間グラフ
- **進捗バックアップ** — JSON エクスポート/インポート、GitHub 同期
- **PWA** — ホーム画面に追加してアプリのように使える

## セットアップ

```bash
npm install
npm run dev
```

## 単語データ

`data/words.tsv` にスプレッドシートの内容を配置します。詳細は以前の README 形式と同じです。

## 進捗の GitHub 同期

1. 「統計」タブ → **エクスポート**
2. ダウンロードした JSON を `public/progress.json` にリネームして配置
3. GitHub に push → デプロイ
4. 各端末でアプリを開くと `progress.json` が自動マージされます

ローカルの進捗とリモートの進捗は、**より新しい回答日時**を優先して統合します。

## PWA（ホーム画面に追加）

スマホのブラウザ（Chrome / Safari など）でサイトを開き、メニューから **「ホーム画面に追加」** を選ぶと、アイコンから起動できるようになります。ブラウザの UI が消え、アプリのように使えます。

## ビルド

```bash
npm run build
npm run preview
```

## GitHub Pages への公開

公開 URL: https://toku1639.github.io/english_words/

1. リポジトリ **Settings → Pages**
2. **Build and deployment → Source** を **Deploy from a branch** にする
3. **Branch** を **`gh-pages`**、フォルダ **`/ (root)`** にする（`main` のルートではない）
4. `main` に push すると Actions が `dist` を `gh-pages` ブランチへデプロイする

画面が真っ白なときは、Pages が `main` 直下の開発用 `index.html` を配信している可能性があります。上記のとおり **`gh-pages` ブランチ**に切り替えてください。
