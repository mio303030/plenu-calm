/**
 * スマホ表示のハンバーガーメニュー（Wixのモバイルメニューと同じ全画面メニュー）
 * - ボタンで開閉し、開いている間は背面をスクロールさせない
 * - Escキー・リンクのクリックでも閉じる
 */
export function initMenu() {
  const toggle = document.querySelector('.js-menu-toggle');
  const menu = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
  if (!menu) return;

  const setOpen = (open) => {
    document.documentElement.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'ナビゲーションメニューを閉じる' : 'ナビゲーションメニューを開く');
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // PC・タブレット幅に戻ったら閉じる
  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
