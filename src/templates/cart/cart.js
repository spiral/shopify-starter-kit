import { GoogleAnalytics } from '../../scripts/analytics/index';

const checkoutForm = document.querySelector('[data-template="cart"] form');

const getFormItems = () =>
  Array.from(checkoutForm.querySelectorAll('input'))
    .map((input) => ({
      cartKey: input.getAttribute('data-key') || null,
      quantity: input.value,
    }))
    .filter(({ cartKey }) => Boolean(cartKey));

const initAddToCartEvents = () => {
  const updateButton = checkoutForm?.querySelector('button[name="update"]');

  if (updateButton) {
    updateButton.addEventListener('click', () => {
      getCartItems().then((cartItems) => {
        const formItems = getFormItems();

        const items = cartItems
          .filter((cartItem) =>
            formItems.find(
              (formItem) =>
                formItem.cartKey === cartItem.cartKey &&
                formItem.quantity !== cartItem.quantity
            )
          )
          .map(({ cartKey, ...trackItem }) => {
            const relatedFormItem =
              formItems.find((formItem) => formItem.cartKey === cartKey) ||
              null;

            if (relatedFormItem) {
              return {
                ...trackItem,
                quantity: relatedFormItem.quantity - trackItem.quantity,
              };
            }

            return trackItem;
          })
          .filter(({ quantity }) => quantity !== 0);

        const addedItems = items
          .filter((item) => item.quantity > 0)
          .map(({ ...trackItem }) => ({
            ...trackItem,
            quantity: String(trackItem.quantity),
          }));

        if (addedItems.length) {
          GoogleAnalytics.trackEvent(GoogleAnalytics.EVENTS.ADD_TO_CARD, {
            ecommerce: {
              items: addedItems,
            },
          });
        }

        const removedItems = items
          .filter((item) => item.quantity < 0)
          .map(({ ...trackItem }) => ({
            ...trackItem,
            quantity: String(-trackItem.quantity),
          }));

        if (removedItems.length) {
          GoogleAnalytics.trackEvent(GoogleAnalytics.EVENTS.REMOVE_FROM_CART, {
            ecommerce: {
              items: removedItems,
            },
          });
        }
      });
    });
  }

  const removeButtons =
    checkoutForm?.querySelectorAll('[data-cart-remove-item-key]') || null;

  if (removeButtons) {
    removeButtons.forEach((removeButton) => {
      removeButton.addEventListener('click', () => {
        getCartItems().then((cartItems) => {
          const removedItemKey = removeButton.getAttribute(
            'data-cart-remove-item-key'
          );
          const { cartKey, ...removedItem } =
            cartItems.find((item) => item.cartKey === removedItemKey) || {};

          if (removedItem) {
            GoogleAnalytics.trackEvent(
              GoogleAnalytics.EVENTS.REMOVE_FROM_CART,
              {
                ecommerce: {
                  items: [
                    {
                      ...removedItem,
                      quantity: String(removedItem.quantity),
                    },
                  ],
                },
              }
            );
          }
        });
      });
    });
  }
};

const initCheckoutEvent = () => {
  const checkoutButton = checkoutForm?.querySelector('button[name="checkout"]');

  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      getCartItems().then((cartItems) => {
        const formItems = getFormItems();

        const items = cartItems
          .map(({ cartKey, ...trackItem }) => {
            const relatedFormItem =
              formItems.find((formItem) => formItem.cartKey === cartKey) ||
              null;

            if (relatedFormItem) {
              return {
                ...trackItem,
                quantity: relatedFormItem.quantity,
              };
            }

            return null;
          })
          .filter(Boolean);

        if (items.length > 0) {
          GoogleAnalytics.trackEvent(GoogleAnalytics.EVENTS.CHECKOUT, {
            ecommerce: {
              items,
            },
          });
        }
      });
    });
  }
};

function getCartItems() {
  return fetch('/cart.js')
    .then((response) => response.json())
    .then((data) =>
      data.items.map((cartItem) => ({
        item_name: cartItem.product_title,
        item_id: String(cartItem.variant_id),
        price: Number(cartItem.final_price / 100)
          .toFixed(2)
          .toLocaleString('en-US'),
        item_category: cartItem.product_type,
        item_variant: cartItem.variant_title,
        currency: window.Shopify.currency.active,
        quantity: String(cartItem.quantity),
        cartKey: String(cartItem.key), // NOTE: temporal key helper
      }))
    )
    .catch((error) => {
      console.error(error);
    });
}

window.addEventListener('DOMContentLoaded', () => {
  initAddToCartEvents();
  initCheckoutEvent();
});
