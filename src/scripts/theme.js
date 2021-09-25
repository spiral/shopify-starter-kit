import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../styles/theme.scss';

import { focusHash, bindInPageLinks } from '@shopify/theme-a11y';

// Common a11y fixes
focusHash();
bindInPageLinks();
