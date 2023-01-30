const RSS_LINK_DATA_ATTR = 'data-page-mountaintop-podcast-rss';
const DATE_DATA_ATTR = 'data-page-mountaintop-podcast-date';
const IMAGE_DATA_ATTR = 'data-page-mountaintop-podcast-image';
const DURATION_DATA_ATTR = 'data-page-mountaintop-podcast-duration';
const EPISODE_DATA_ATTR = 'data-page-mountaintop-podcast-episode';

export const initMountaintopPodcast = () => {
  const mainComponent = document.querySelector(`[${RSS_LINK_DATA_ATTR}]`);
  const rssUrl = mainComponent.getAttribute(RSS_LINK_DATA_ATTR);

  if (rssUrl) {
    fetch(rssUrl)
      .then((response) => response.text())
      .then((string) =>
        new window.DOMParser().parseFromString(string, 'text/xml')
      )
      .then((page) => {
        const selectTarget = (dataAttr) =>
          mainComponent.querySelector(`[${dataAttr}]`) || {};

        const targetItem = page.getElementsByTagName('item')?.[0]; // NOTE: get first item

        if (!targetItem) {
          return;
        }

        const podcastDate =
          targetItem.querySelector('pubDate')?.textContent || null;

        if (podcastDate) {
          selectTarget(DATE_DATA_ATTR).innerHTML = dateFormat(podcastDate);
        }

        const podcastDuration =
          targetItem.getElementsByTagName('itunes:duration')?.[0]
            ?.textContent || null;

        if (podcastDuration) {
          selectTarget(DURATION_DATA_ATTR).innerHTML =
            durationFormat(podcastDuration);
        }

        const podcastCoverLink =
          targetItem
            .getElementsByTagName('itunes:image')?.[0]
            ?.getAttribute('href') ||
          page.getElementsByTagName('itunes:image')?.[0].getAttribute('href') ||
          null;

        if (podcastCoverLink) {
          selectTarget(IMAGE_DATA_ATTR).setAttribute('src', podcastCoverLink);
        }

        const podcastEpisode =
          targetItem.getElementsByTagName('itunes:season')?.[0]?.textContent ||
          null;

        if (podcastEpisode) {
          selectTarget(EPISODE_DATA_ATTR).innerHTML = `EP. ${podcastEpisode}`;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

function durationFormat(string) {
  const dateParts = string.split(':').filter(Boolean);

  if (dateParts.length < 3) {
    return dateParts.join(':').concat(' min');
  }

  if (dateParts.length === 3) {
    const minutes = Number(dateParts[0]) * 60 + Number(dateParts[1]);

    return `${minutes}:${dateParts[2]} min`;
  }

  return string.concat(' min');
}

function dateFormat(dateString) {
  const date = new Date(dateString);

  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.toLocaleString('en-US', { day: 'numeric' });

  return `${month} ${day}${nth(day)}`;
}

function nth(d) {
  if (d > 3 && d < 21) {
    return 'th';
  }
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
