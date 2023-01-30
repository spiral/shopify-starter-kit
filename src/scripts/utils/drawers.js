import { lockPageScroll, unlockPageScroll } from './pageScroll';

const { $, document } = window;

const drawersList = [];

// TODO: need to remove jquery
class Drawer {
  constructor(id, position, options) {
    const defaults = {
      close: '[data-drawer-close]',
      open: `[data-drawer-open-${position}]`,
      openClass: 'js-drawer-open',
      dirOpenClass: `js-drawer-open-${position}`,
    };

    this.nodes = {
      $html: $('html'),
      $page: $('#page-container'),
    };

    this.config = $.extend(defaults, options);
    this.position = position;
    this.id = id;

    this.$drawer = $(`#${id}`);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.scrollBar = 0;

    this.init();

    window.addEventListener('resize', () => {
      this.scrollBar = window.innerWidth - document.documentElement.clientWidth;
    });
  }

  init() {
    $(this.config.open).on('click', $.proxy(this.open, this));

    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));

    this.scrollBar = window.innerWidth - document.documentElement.clientWidth;

    drawersList.push(this);
  }

  open(evt) {
    let isUserInteraction = false;

    if (evt) {
      evt.preventDefault();
      isUserInteraction = true;
    }

    if (this.drawerIsOpen && isUserInteraction) {
      return this.close();
    }

    if (evt && evt.stopPropagation) {
      evt.stopPropagation();

      this.$eventTarget = $(evt.currentTarget);
    }

    lockPageScroll();

    drawersList
      .filter(({ id }) => id !== this.id)
      .forEach((drawer) => {
        drawer.close();
      });

    this.nodes.$html.addClass(
      `${this.config.openClass} ${this.config.dirOpenClass}`
    );

    this.drawerIsOpen = true;

    if (this.scrollBar !== 0) {
      document.body.style.paddingRight = `${this.scrollBar}px`;
    }

    $(this.$drawer).attr('tabindex', '-1');
    $(this.$drawer).focus();

    if (isUserInteraction && typeof this.config.onDrawerOpen === 'function') {
      this.config.onDrawerOpen();
    }

    if (
      this.position === 'size-guide' ||
      this.position === 'more-info' ||
      this.position === 'more-info-new'
    ) {
      const $header = $('[data-section="header"]');

      this.$drawer.css('height', `calc(100% - ${$header.height()}px)`);
    }

    if (this.$eventTarget) {
      this.$eventTarget.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  }

  close() {
    if (this.scrollBar !== 0) {
      document.body.style.paddingRight = '0';
    }

    if (!this.drawerIsOpen) {
      return;
    }

    $(document.activeElement).trigger('blur');

    if (this.$eventTarget) {
      this.$eventTarget.attr('aria-expanded', 'false');
    }

    unlockPageScroll();

    this.nodes.$html.removeClass(
      `${this.config.dirOpenClass} ${this.config.openClass}`
    );

    this.drawerIsOpen = false;

    $(this.$drawer).blur();
    $(this.$drawer).removeAttr('tabindex');

    this.unbindEvents();
  }

  bindEvents() {
    this.nodes.$html.on(
      'keyup.drawer',
      $.proxy((evt) => {
        const escapeKeyCode = 27;

        if (evt.keyCode === escapeKeyCode) {
          this.close();

          return false;
        }

        return true;
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', () => false);

    this.nodes.$page.on(
      'click.drawer',
      $.proxy(() => {
        this.close();
        return false;
      }, this)
    );
  }

  unbindEvents() {
    this.nodes.$page.off('.drawer');
    this.nodes.$html.off('.drawer');
  }
}

export function initDrawers() {
  return {
    create(id, position, options) {
      return new Drawer(id, position, options);
    },
    getList() {
      return drawersList;
    },
  };
}
