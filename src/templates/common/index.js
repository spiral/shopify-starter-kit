import { initHomepageCollectiveEventsSlider } from './homepage-collective-events/homepage-collective-events';
import { initHomepagePodcastSlider } from './homepage-podcasts/homepage-podcasts';
import { initInlineImageSlider } from './inline-images/inline-images';
import { initHeader } from './header/header';
import { initMobileNavDrawer } from './mobile-nav-drawer/mobile-nav-drawer';
import { initFooter } from './footer/footer';
import { initModals } from '../../scripts/utils/modals/modals';
import { initHomepageLookbook } from './homepage-lookbook/homepage-lookbook';

initHomepageLookbook();
initHomepageCollectiveEventsSlider();
initHomepagePodcastSlider();
initInlineImageSlider();
initHeader();
initMobileNavDrawer();
initFooter();

initModals();
