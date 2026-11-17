/**
 * よくある質問：Wixの「折りたたみテキスト」と同じ挙動
 * 閉じている時は1行目＋「…」、▽ で全文表示、「とじる」で閉じる
 */
export function initFaq() {
  document.querySelectorAll('.js-faq .faq__toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq__item');
      const isOpen = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
      button.textContent = isOpen ? 'とじる' : '▽';
    });
  });
}
