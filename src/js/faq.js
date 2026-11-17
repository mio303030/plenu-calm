/**
 * FAQの開閉
 * - ボタンで回答の表示を切り替える（閉じている時は1行目の質問だけ表示）
 * - ⑧ 回答の高さをなめらかにアニメーションさせて展開・収納する
 *   → 開閉の状態（.is-open / aria-expanded / ボタンの文字）はクリックした瞬間に切り替え、
 *     見た目の高さだけを後から追いかけるので、連続クリックしても状態がずれない
 *   → 動いている途中でクリックされたら、その時点の高さから逆向きに動き出す
 * - ボタンの文字（▽ / とじる）も、切り替わる時にふわっと入れ替える
 * - 「視差効果を減らす」設定の環境では、アニメーションなしで切り替える
 */
const OPEN = { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
const CLOSE = { duration: 420, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initFaq() {
  document.querySelectorAll('.js-faq .faq__toggle').forEach((button) => {
    const item = button.closest('.faq__item');
    const text = item.querySelector('.faq__text');
    let heightAnim = null;
    let iconAnim = null;

    button.addEventListener('click', () => {
      const animate = !reduceMotion.matches && typeof text.animate === 'function';

      // 1. 今見えている高さ（動いている途中ならその途中の高さ）を記録してから止める
      const from = getComputedStyle(text).height;
      heightAnim?.cancel();
      iconAnim?.cancel();
      item.classList.remove('is-animating');

      // 2. 状態を切り替える（ここまでは元の開閉機能と同じ）
      const isOpen = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
      button.textContent = isOpen ? 'とじる' : '▽';
      // 読み上げ用の名前（見た目の「▽」だけでは何のボタンか伝わらないため）
      button.setAttribute('aria-label', isOpen ? '回答を閉じる' : '回答を開く');

      if (!animate) return;

      // 3. 切り替え後の高さまでアニメーション
      //    動いている間だけ .is-animating で1行表示（行数制限）を外し、はみ出しを隠す
      const to = getComputedStyle(text).height;
      if (from !== to) {
        item.classList.add('is-animating');
        const timing = isOpen ? OPEN : CLOSE;
        const anim = text.animate([{ height: from }, { height: to }], timing);
        heightAnim = anim;
        // 終了時の後片付け（念のため時間経過でも実行し、1行表示に確実に戻す）
        const done = () => {
          if (heightAnim !== anim) return; // 途中で次のクリックがあった場合はそちらに任せる
          anim.cancel();
          item.classList.remove('is-animating');
          heightAnim = null;
        };
        anim.onfinish = done;
        setTimeout(done, timing.duration + 100);
      }

      // 4. ボタンの文字：「とじる」は下からふわっと、「▽」は半回転しながら現れる
      iconAnim = button.animate(
        isOpen
          ? [
              { opacity: 0, transform: 'translateY(8px)' },
              { opacity: 1, transform: 'none' },
            ]
          : [
              { opacity: 0, transform: 'rotate(-180deg) scale(0.6)' },
              { opacity: 1, transform: 'none' },
            ],
        { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      iconAnim.onfinish = () => {
        iconAnim = null;
      };
    });
  });
}
