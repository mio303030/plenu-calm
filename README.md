# Plenu calm LP（Wixからの再構築）

Wixで制作したLP「Plenu calm」を、Vite + HTML / CSS / JavaScript で再構築したポートフォリオ用サイトです。

- 参考元: https://pinowriter2000.wixsite.com/plenu-calm

## 開発

Node.js 22 以上が必要です。

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ に出力
npm run preview  # ビルド結果の確認
```

## 構成

```
index.html            トップページ
purchase.html         ご購入フォーム（見た目のみ・送信なし）
public/images/        Wixから取得してWebP化した画像
src/main.js           トップページ用エントリ
src/purchase.js       購入ページ用エントリ（送信を常に無効化）
src/js/faq.js         よくある質問の開閉
src/js/menu.js        スマホ表示のハンバーガーメニュー
src/js/reveal.js      スクロール時のフェードイン、ファーストビューの再生
src/styles/
  variables.css       色・フォントなどのデザイントークン
  base.css            リセット、共通レイアウト、ヘッダー/フッター
  home.css            トップページ（PC）
  home-sp.css         トップページ（スマホ）
  purchase.css        購入ページ（PC）
  purchase-sp.css     購入ページ（スマホ）
  animation.css       アニメーション
```

## レスポンシブ

元のWixサイトと同じ考え方で切り替えています。

| 画面幅 | 表示 |
| --- | --- |
| 〜767px | Wixのスマホ用レイアウト（320px幅）を画面幅に合わせて拡大 |
| 768〜979px | PCレイアウト（980px幅）を画面幅に合わせて縮小 |
| 980px〜 | PCレイアウト（等倍） |

拡大率は各HTMLの `<head>` 内の小さなスクリプトで `--zoom` として計算し、`body` の `zoom` に使っています。

## アニメーション

| 種類 | 内容 |
| --- | --- |
| ファーストビュー | 背景がゆっくりズームアウト → キャッチコピーが1行ずつ下からせり上がる → ボトルが下から浮かび上がる → タグライン → 最後にロゴがぼかしの取れる動きで表示（全体約2.6秒） |
| コンセプト（テキストリビール） | 各行が「行の枠」の下からせり上がる。行ごとに時間差、最後の本文は自然なフェードイン |
| スクロール時 | 画面に入った要素が少し下からフェードイン（同時に入ったものは順番に） |
| 商品画像（ボトル） | 通常より大きめの距離（32px）でゆっくりスライドアップ |
| CTAボタン | ホバーで少し明るい緑になり、2px浮き上がって影が付く（タッチ端末では無効） |

- OSの「視差効果を減らす／アニメーションを減らす」設定がオンの場合は動きを付けません。
- JavaScriptが動かない環境でも、内容は最初から表示されます。

## フォント

| Wixでの指定 | 本プロジェクト | 備考 |
| --- | --- | --- |
| 独自アップロードフォント（orig_zen_antique_regular） | Zen Antique | 同一フォント |
| bodoni-w01-poster | Bodoni Moda 900（opsz 6） | 代替 |
| tsukushigothic（筑紫ゴシック） | Zen Kaku Gothic New | 代替 |
| ot-pgothic-mb101-pr6n（ゴシックMB101） | Zen Kaku Gothic New 500 | 代替 |
| luxurious-script / kodchasan / k2d | 同名の Google Fonts | 同一フォント |

すべて Google Fonts（SIL Open Font License）で、商用利用が可能です。

## 購入フォームについて

ポートフォリオ用のため送信機能はありません。`action` 属性と `name` 属性を持たせず、`submit` イベントも必ず止めているため、入力内容は外部に送られません。
