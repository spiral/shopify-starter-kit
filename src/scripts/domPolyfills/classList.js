// Source: https://gist.github.com/k-gun/c2ea7c49edf7b757fe9561ba37cb19ca
/**
 * Element.prototype.classList for IE8/9, Safari.
 * @author    Kerem Güneş <k-gun@mail.com>
 * @copyright Released under the MIT License <https://opensource.org/licenses/MIT>
 * @version   1.2
 * @see       https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */
(function () {
  // Helpers.
  var trim = function (s) {
      return s.replace(/^\s+|\s+$/g, '');
    },
    regExp = function (name) {
      return new RegExp('(^|\\s+)' + name + '(\\s+|$)');
    },
    forEach = function (list, fn, scope) {
      for (var i = 0; i < list.length; i++) {
        fn.call(scope, list[i]);
      }
    };

  // Class list object with basic methods.
  function ClassList(element) {
    this.element = element;
  }

  ClassList.prototype = {
    add: function () {
      forEach(
        arguments,
        function (name) {
          if (!this.contains(name)) {
            this.element.className = trim(this.element.className + ' ' + name);
          }
        },
        this
      );
    },
    remove: function () {
      forEach(
        arguments,
        function (name) {
          this.element.className = trim(
            this.element.className.replace(regExp(name), ' ')
          );
        },
        this
      );
    },
    toggle: function (name) {
      return this.contains(name)
        ? (this.remove(name), false)
        : (this.add(name), true);
    },
    contains: function (name) {
      return regExp(name).test(this.element.className);
    },
    item: function (i) {
      return this.element.className.split(/\s+/)[i] || null;
    },
    // bonus
    replace: function (oldName, newName) {
      this.remove(oldName), this.add(newName);
    },
  };

  // For others replace() support.
  if (window.DOMTokenList && !DOMTokenList.prototype.replace) {
    DOMTokenList.prototype.replace = ClassList.prototype.replace;
  }
})();
