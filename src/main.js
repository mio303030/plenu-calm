import './styles/variables.css';
import './styles/base.css';
import './styles/home.css';
import './styles/home-sp.css';
import './styles/animation.css';
import { initMenu } from './js/menu.js';
import { initFaq } from './js/faq.js';
import { initReveal, startHero } from './js/reveal.js';

initMenu();
initFaq();
initReveal();
startHero();
