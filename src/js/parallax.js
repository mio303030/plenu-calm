/**
 * ④ パララックス（スクロール連動）― GSAP + ScrollTrigger
 *
 * 背景（ゆっくり）と前景（少し速い）で動く速さを変えて奥行きを出す。
 * - 背景：ファーストビューの葉のテクスチャ、CTAの写真
 *   → 画像のはみ出し部分の中で「表示位置」だけを動かすので、
 *     枠からはみ出したり、文章・ボタンと重なったりしない
 *   → transform で動かすため、スクロール中に再描画が起きない（GPUで合成するだけ）
 *   → セクションが画面の中央付近にある時に元の見え方と同じになる
 * - 前景：理由01の葉（グラスの写真）
 *   → 上下にPC 24px・スマホ 14pxだけ動かす（周りの文章との間隔より十分小さい）
 *
 * - ⑤ 商品ボトル：CTAセクションの通過に合わせて浮かび上がる（下の BOTTLES 参照）
 *
 * 「視差効果を減らす」設定の環境では何もしない。
 * JavaScriptが無効の時は transform が付かないので、元の表示になる。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// スマホのアドレスバーの表示・非表示（高さだけの変化）では位置の再計算をしない
// → スクロール中の不要な再計算と、それによるカクつきを防ぐ
ScrollTrigger.config({ ignoreMobileResize: true });

// スクロールへの追従を少しだけ遅らせて、なめらかに見せる（秒）
const SMOOTH = 0.5;

export function initParallax() {
  const mm = gsap.matchMedia();

  // 画面幅（PC/スマホ）が切り替わったら作り直す
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', sp: '(max-width: 767px)' }, (context) => {
    if (!context.conditions.motion) return;
    // 背景：ファーストビューの葉のテクスチャ（スクロールで画面外へ出るまでに、
    // 画像のはみ出し分の10%だけ下へずらす = 以前の background-position 0%→10% と同じ動き）
    // background-position ではなく transform で動かすので、スクロール中に再描画が起きない
    const hero = document.querySelector('.hero');
    const heroImg = document.querySelector('.hero__bg-img');
    if (hero && heroImg) {
      const overflow = () => Math.max(0, heroImg.offsetHeight - hero.querySelector('.hero__bg').offsetHeight);
      gsap.fromTo(
        heroImg,
        { yPercent: 0 },
        {
          yPercent: () => (overflow() * 0.1 * 100) / heroImg.offsetHeight,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: SMOOTH, invalidateOnRefresh: true },
        },
      );
    }

    // 背景：CTAの写真（画面に入ってから出るまでに、はみ出し分の上端側→下端側へ動く
    // = 以前の background-position 100%→0% と同じ動き）。こちらも transform で動かす
    gsap.utils.toArray('.cta').forEach((section) => {
      const bg = section.querySelector('.cta__bg-img');
      if (!bg) return;
      // 中央の位置から上下に動ける量（層の高さに対する%）
      const range = () => (Math.max(0, bg.offsetHeight - section.offsetHeight) / 2 / bg.offsetHeight) * 100;
      gsap.fromTo(
        bg,
        { yPercent: () => -range() },
        {
          yPercent: () => range(),
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: SMOOTH, invalidateOnRefresh: true },
        },
      );
    });

    // 前景：理由01の葉（スクロールより少し速く動く）
    // 周りの文章との間隔：PC 約76px / スマホ 約37px → 動く幅はPC ±24px、スマホ ±14px
    const leafRange = context.conditions.sp ? 14 : 24;
    gsap.utils.toArray('.reasons__leaf').forEach((leaf) => {
      gsap.fromTo(
        leaf,
        { y: leafRange },
        {
          y: -leafRange,
          ease: 'none',
          scrollTrigger: { trigger: leaf, start: 'top bottom', end: 'bottom top', scrub: SMOOTH },
        },
      );
    });

    // ⑤ 商品ボトル（3か所のCTA）：スクロールに合わせてゆっくり浮かび上がる
    // セクションが画面に入ってから出るまでを 0→1 として、
    //   0 → finish : 下から浮かび上がる（わずかに傾き・縮小 → まっすぐ・等倍）
    //   finish → 0.5 : 元の状態で静止（0.5 = セクションが画面中央 → 元のデザインと同じ見た目）
    //   0.5 → 1 : さらにゆっくり上へ（ごくわずかに逆へ傾き、少しだけ拡大）
    // 3か所で「浮かび上がり終わる位置」「傾く向き」「上昇量」を変えて、同じ動きの繰り返しに見せない
    const BOTTLES = [
      { finish: 0.38, tilt: -3, rise: 70 },
      { finish: 0.44, tilt: 3, rise: 56 },
      { finish: 0.5, tilt: -2, rise: 84 },
    ];
    // スマホはボトルのすぐ下（6〜15px）に購入ボタンがあるため、下へは一切ずらさない。
    // 代わりにボトルの底を支点に、小さい状態から上へ伸びるように浮かび上がらせる
    const sp = context.conditions.sp;
    gsap.utils.toArray('.cta').forEach((section, i) => {
      const bottle = section.querySelector('.cta__bottle');
      if (!bottle) return;
      const { finish, tilt, rise } = BOTTLES[i % BOTTLES.length];
      const from = sp
        ? { y: 0, rotation: tilt / 2, scale: 0.9, opacity: 0, transformOrigin: '50% 100%' }
        : { y: rise, rotation: tilt, scale: 0.94, opacity: 0, transformOrigin: '50% 50%' };
      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
        .fromTo(bottle, from, { y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: finish }, 0)
        .to(
          bottle,
          { y: sp ? -12 : -22, rotation: -tilt / (sp ? 4 : 2), scale: 1.02, ease: 'none', duration: 0.5 },
          0.5,
        );
    });
  });
}
