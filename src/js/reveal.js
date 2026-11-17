/**
 * スクロールに合わせたフェードイン
 * - 画面に入った要素に .is-visible を付けて表示する
 * - 同時に画面に入った要素は少しずつ遅らせて、順番に現れるようにする
 * - 表示が終わったらクラスを外し、ホバーなど本来のトランジションに戻す
 * - 素早いスクロールで画面を通り過ぎた要素も、見えないまま残らないよう表示する
 */
const TARGETS = [
  '.concept__p7', // コンセプトの本文：自然なフェードイン
  '.cta__tagline', '.cta__logo', '.cta__kana', '.cta__btn',
  '.question__woman', '.question__bubble', '.question__text',
  '.reason-num', '.reason-line', '.reason-title', '.reason-body',
  '.reasons__wave',
  '.section-title', '.feature', '.rec',
  '.brand__box', '.brand__circle', '.brand__q', '.brand__heading > span', '.brand__marker',
  '.brand__lead', '.brand__dots', '.brand__wave', '.brand__meaning-title', '.brand__term', '.brand__meaning',
  '.voices__title', '.voices__bg', '.voice',
  '.faq__item',
];

// テキストリビール：行の枠（.tx-line）ごとに、中のテキストを下からせり上げる
// ※枠の外に隠れた要素は IntersectionObserver で「見えない」と判定されるため、枠の方を監視する
const LINE_TARGETS = ['.concept .tx-line'];

// 写真のマスクリビール：マスクが開くように現れ、写真自体はわずかに縮小する
// 登場方向は画像の位置で決める（左寄り→左から / 右寄り→右から / 中央→前の写真と逆向き）
const MASK_TARGETS = [
  '.machine__img',
  '.reasons__basket', '.reasons__laundry', '.reasons__leaf', '.reasons__shirts', '.reasons__img3',
];

// 商品画像：控えめなスライドアップ
const PRODUCT_TARGETS = ['.cta__bottle'];

const STAGGER = 0.12; // 秒
const MAX_DELAY = 0.48;

export function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const product = document.querySelectorAll(PRODUCT_TARGETS.join(','));
  const lines = document.querySelectorAll(LINE_TARGETS.join(','));
  const masks = [...document.querySelectorAll(MASK_TARGETS.join(','))];
  const elements = [...document.querySelectorAll(TARGETS.join(',')), ...product, ...lines, ...masks];
  product.forEach((el) => el.classList.add('reveal--up'));
  lines.forEach((el) => el.classList.add('reveal--line'));
  masks.forEach((el) => el.classList.add('reveal--mask'));

  const pending = new Set(elements);

  const show = (el, delay) => {
    if (!pending.delete(el)) return;
    el.style.setProperty('--reveal-delay', `${delay}s`);
    el.classList.add('is-visible');
    observer.unobserve(el);
    // アニメーション終了後に後片付け（最長1.5秒＋遅延）
    setTimeout(() => {
      el.classList.remove('reveal', 'reveal--up', 'reveal--line', 'reveal--mask', 'from-left', 'from-right', 'is-visible');
      el.style.removeProperty('--reveal-delay');
    }, (delay + 1.8) * 1000);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target)
        // ページ上の並び順（上から）に表示する
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

      visible.forEach((el, i) => show(el, Math.min(i * STAGGER, MAX_DELAY)));
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  elements.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // 写真の登場方向（PCとスマホで配置が変わるため、画面幅の切り替え時にも決め直す）
  const setMaskDirections = () => {
    let prev = 'from-right';
    masks
      .filter((el) => pending.has(el) && el.getClientRects().length)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        const box = el.closest('.section').getBoundingClientRect();
        const center = (r.left + r.width / 2 - box.left) / box.width;
        let dir;
        if (center < 0.42) dir = 'from-left';
        else if (center > 0.58) dir = 'from-right';
        else dir = prev === 'from-left' ? 'from-right' : 'from-left';
        el.classList.remove('from-left', 'from-right');
        el.classList.add(dir);
        prev = dir;
      });
  };
  setMaskDirections();
  window.matchMedia('(min-width: 768px)').addEventListener('change', setMaskDirections);

  // 素早いスクロールやページ内リンクで一気に通り過ぎた要素は、
  // IntersectionObserver に通知されないことがあるため、スクロール時にも確認する
  let ticking = false;
  const showPassed = () => {
    ticking = false;
    let i = 0;
    pending.forEach((el) => {
      // display:none（画面幅で出し分けている要素）は対象外
      if (!el.getClientRects().length) return;
      if (el.getBoundingClientRect().bottom < 0) show(el, Math.min(i++ * STAGGER, MAX_DELAY));
    });
    if (!pending.size) window.removeEventListener('scroll', onScroll);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(showPassed);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  showPassed();
}

/** ファーストビュー：フォントの読み込みを待ってから再生（最大1秒待つ） */
export function startHero() {
  const ready = () => document.documentElement.classList.add('is-ready');
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const timeout = new Promise((resolve) => setTimeout(resolve, 1000));
  Promise.race([fonts, timeout]).then(() => requestAnimationFrame(ready));
}
