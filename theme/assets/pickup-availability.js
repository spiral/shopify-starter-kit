// eslint-disable-next-line max-classes-per-file
if (!customElements.get('pickup-availability')) {
  class PickupAvailability extends HTMLElement {
    constructor() {
      super();

      if (!this.hasAttribute('available')) {
        return;
      }

      this.errorHtml =
        this.querySelector('template').content.firstElementChild.cloneNode(
          true
        );
      this.onClickRefreshList = this.onClickRefreshList.bind(this);
      this.fetchAvailability(this.dataset.variantId);
    }

    fetchAvailability(variantId) {
      let { rootUrl } = this.dataset;

      if (!rootUrl.endsWith('/')) {
        rootUrl += '/';
      }

      // eslint-disable-next-line max-len
      const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

      fetch(variantSectionUrl)
        .then((response) => response.text())
        .then((text) => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('.shopify-section');

          this.renderPreview(sectionInnerHTML);
        })
        .catch(() => {
          const button = this.querySelector('button');

          if (button) {
            button.removeEventListener('click', this.onClickRefreshList);
          }
          this.renderError();
        });
    }

    onClickRefreshList() {
      this.fetchAvailability(this.dataset.variantId);
    }

    renderError() {
      this.innerHTML = '';
      this.appendChild(this.errorHtml);

      this.querySelector('button').addEventListener(
        'click',
        this.onClickRefreshList
      );
    }

    renderPreview(sectionInnerHTML) {
      const drawer = document.querySelector('pickup-availability-drawer');

      if (drawer) drawer.remove();
      if (!sectionInnerHTML.querySelector('pickup-availability-preview')) {
        this.innerHTML = '';
        this.removeAttribute('available');
        return;
      }

      this.innerHTML = sectionInnerHTML.querySelector(
        'pickup-availability-preview'
      ).outerHTML;

      this.setAttribute('available', '');

      document.body.appendChild(
        sectionInnerHTML.querySelector('pickup-availability-drawer')
      );

      const button = this.querySelector('button');

      if (button)
        button.addEventListener('click', (evt) => {
          document.querySelector('pickup-availability-drawer').show(evt.target);
        });
    }
  }

  customElements.define('pickup-availability', PickupAvailability);
}

if (!customElements.get('pickup-availability-drawer')) {
  const { trapFocus, removeTrapFocus } = window;

  customElements.define(
    'pickup-availability-drawer',
    class PickupAvailabilityDrawer extends HTMLElement {
      constructor() {
        super();

        this.onBodyClick = this.handleBodyClick.bind(this);

        this.querySelector('button').addEventListener('click', () => {
          this.hide();
        });

        this.addEventListener('keyup', (event) => {
          if (event.code.toUpperCase() === 'ESCAPE') this.hide();
        });
      }

      handleBodyClick(evt) {
        const { target } = evt;

        if (
          target !== this &&
          !target.closest('pickup-availability-drawer') &&
          String(target.id) !== 'ShowPickupAvailabilityDrawer'
        ) {
          this.hide();
        }
      }

      hide() {
        this.removeAttribute('open');
        document.body.removeEventListener('click', this.onBodyClick);
        document.body.classList.remove('overflow-hidden');
        removeTrapFocus(this.focusElement);
      }

      show(focusElement) {
        this.focusElement = focusElement;
        this.setAttribute('open', '');
        document.body.addEventListener('click', this.onBodyClick);
        document.body.classList.add('overflow-hidden');
        trapFocus(this);
      }
    }
  );
}
