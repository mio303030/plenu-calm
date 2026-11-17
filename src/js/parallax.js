/**
 * ④ パララックス（スクロール連動）― GSAP + ScrollTrigger
 *
 * 背景（ゆっくり）と前景（少し速い）で動く速さを変えて奥行きを出す。
 * - 背景：ファーストビューの葉のテクスチャ、CTAの写真
 *   → 画像のはみ出し部分の中で「表示位置」だけを動かすので、
 *     枠からはみ出したり、文章・ボタンと重なったりしない
 *   → セクションが画面の中央付近にある時に元の見え方と同じになる
 * - 前景：理由01の葉（グラスの写真）
 *   → 上下にPC 24px・スマホ 14pxだけ動かす（周りの文章との間隔より十分小さい）
 *
 * 「視差効果を減らす」設定の環境では何もしない。
 * JavaScriptが無効の時はCSS変数が未設定のままなので、元の表示になる。
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// スクロールへの追従を少しだけ遅らせて、なめらかに見せる（秒）
const SMOOTH = 0.5;

export function initParallax() {
  const mm = gsap.matchMedia();

  // 画面幅（PC/スマホ）が切り替わったら作り直す
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', sp: '(max-width: 767px)' }, (context) => {
    if (!context.conditions.motion) return;
    // 背景：ファーストビューの葉のテクスチャ（スクロールで画面外へ出るまでに10%分ずれる）
    const hero = document.querySelector('.hero');
    if (hero) {
      gsap.fromTo(
        hero,
        { '--hero-py': '0%' },
        {
          '--hero-py': '10%',
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: SMOOTH },
        },
      );
    }

    // 背景：CTAの写真（画面に入ってから出るまでに、写真の下端側→上端側へ表示位置が移る）
    gsap.utils.toArray('.cta').forEach((section) => {
      gsap.fromTo(
        section,
        { '--cta-py': '50%' },
        {
          '--cta-py': '-50%',
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: SMOOTH },
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
  });
}
