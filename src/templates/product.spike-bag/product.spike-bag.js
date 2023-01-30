import './product.spike-bag.scss';
import { runProductBase } from '../../snippets/product-base/product-base';
import { initProductSpikeBugOne } from './product-spike-bag-one/product-spike-bag-one';
import { initProductSpikeBugReveal } from './product-spike-bag-reveal/product-spike-bag-reveal';
// NOTE: used twice in template sections
import { initImageParallax } from '../../snippets/image-parallax/image-parallax';

document.addEventListener('DOMContentLoaded', () => {
  runProductBase();
  initProductSpikeBugOne();
  initProductSpikeBugReveal();
  initImageParallax();
});
