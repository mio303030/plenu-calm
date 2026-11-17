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
src/js/parallax.js    パララックス（GSAP + ScrollTrigger）
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
| 写真（マスクリビール） | 洗濯機・3つの理由の写真が、マスクが開くように現れ、写真自体は1.12倍から等倍へわずかに縮小。右寄りの写真は右から、左寄りは左から、中央（スマホなど）は交互の方向から登場 |
| パララックス（GSAP ScrollTrigger） | 背景（ファーストビューの葉のテクスチャ・CTAの写真）はスクロールよりゆっくり、前景（理由01の葉の写真）は少し速く動く。背景は画像のはみ出し部分の中で表示位置だけを動かすため、枠外に出ず文章とも重ならない |
| スクロール時 | 画面に入った要素が少し下からフェードイン（同時に入ったものは順番に） |
| 商品ボトル（CTA・スクロール連動） | セクションの通過に合わせて浮かび上がり、わずかな傾き・拡大縮小を組み合わせる。3か所で浮かび上がり終わる位置・傾く向き・上昇量を変えている。セクションが画面中央の時は元のデザインと同じ状態。スマホは購入ボタンと重ならないよう、下へはずらさずボトルの底を支点に伸び上がる |
| CTAボタン | ホバーで背景色がなめらかに明るい緑へ変わり、3px浮き上がって影が2層に変化、ボタンの中を光が横切る。通常時は元のデザインのまま。マウス操作ができる幅768px以上の環境だけ有効（スマホ・タッチ端末では無効）。キーボード操作のフォーカス時も同じ表示 |
| 利用者の声 | 4枚のカードが0.2秒ずつ時間差で登場。PCは左列が左から・右列が右から40pxスライドイン、スマホ（1列）は下から32px。PCではホバーで6px浮き上がり、やわらかい影が付く（マウス操作ができる幅768px以上のみ）。文章・画像の配置は変更なし |
| FAQ | 回答の高さがなめらかに伸び縮みして展開・収納（開く0.52秒／閉じる0.42秒）。閉じる途中も文章が途切れず下へ収納される。ボタンの「とじる」は下からふわっと、「▽」は半回転しながら現れる。連続クリックしても、動いている途中の高さから逆向きに動き出すので状態がずれない |

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

## 公開前のライセンス確認

### 画像（要確認）
`public/images/` の画像は、元のWixサイトで使われている素材をそのまま書き出したものです。
Wixの素材ライブラリの画像には「Wixで作ったサイト内でのみ利用可」のものがあるため、
公開前に各画像の入手元と利用条件を確認し、「入手元」「確認」欄を埋めてください。

| ファイル | 使用箇所 | 入手元 | 確認 |
|---|---|---|---|
| hero-bg.webp | ファーストビュー背景（葉） | | ☐ |
| bottle.webp | 商品ボトル（ファーストビュー・CTA×3） | | ☐ |
| wave.webp | 波線（ファーストビュー・理由・ブランド） | | ☐ |
| white-bg.webp | 紙の質感の背景 | | ☐ |
| leaves-bg.webp | CTA背景 | | ☐ |
| washing-machine.webp | 洗濯機の写真 | | ☐ |
| thinking-woman.webp | 「どうして無添加なのに」のイラスト | | ☐ |
| speech-bubble.webp | 吹き出し | | ☐ |
| reason01-basket.webp / reason01-laundry.webp / reason01-leaf-glass.webp | 理由01の写真 | | ☐ |
| reason02-shirts.webp | 理由02の写真 | | ☐ |
| reason03.webp | 理由03の写真（PCのみ） | | ☐ |
| icon-baby / icon-linen / icon-fashion / icon-bedding / icon-underwear.webp | おすすめのアイコン | | ☐ |
| voice-1〜4.webp | 利用者の声の写真 | | ☐ |

`favicon.svg` / `apple-touch-icon.png` は今回新しく作ったもの（緑の角丸に「P」）です。

### フォント・ライブラリ（確認済み）
- Google Fonts（Bodoni Moda / Zen Antique / Zen Kaku Gothic New / Luxurious Script / Kodchasan / K2D）：SIL Open Font License。商用利用可
- GSAP 3.15.0：3.13以降は商用利用も含め無料（GSAP Standard License）

### 公開後に追加するもの
- `og:image`（SNS共有時の画像）：絶対URLが必要なため、公開URLが決まってから `index.html` に追加する
- 検索エンジンに登録したい場合は、`index.html` と `purchase.html` の `<meta name="robots" content="noindex" />` を削除する
