import './styles/variables.css';
import './styles/base.css';
import './styles/purchase.css';
import './styles/purchase-sp.css';
import { initMenu } from './js/menu.js';

initMenu();

/**
 * 誤送信防止：
 * - form に action / method / name 属性を持たせていない
 * - submit イベントを常に止め、デモである旨だけを表示する
 * - 入力値はどこにも保存・送信しない
 */
document.querySelectorAll('.js-demo-form').forEach((form) => {
  const notice = form.querySelector('.purchase-form__notice');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (notice) notice.hidden = false;
  });
});
