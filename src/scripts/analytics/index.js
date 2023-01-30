import {
  EVENTS as G_EVENTS,
  trackEvent as gTrackEvent,
} from './googleAnalytics';

export const GoogleAnalytics = {
  EVENTS: G_EVENTS,
  trackEvent: gTrackEvent,
};
