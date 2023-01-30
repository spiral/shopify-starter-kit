import intersection from 'lodash/intersection';
import isFunction from 'lodash/isFunction';
import xor from 'lodash/xor';
import { EventEmitter } from './eventEmitter';

export const urlStoredFilter = ({
  initValue = '',
  dataKey = 'filter',
  activeAttr = 'data-active',
  menuSelector = '[data-url-stored-filter-menu]',
  targetSelector = '[data-url-stored-filter-target]',
  listeners = [],
  isMultiple = false,
}) => {
  const valueAttr = `data-${dataKey}`;

  const EE = new EventEmitter();
  const navItems = document.querySelectorAll(menuSelector) || [];

  navItems.forEach((item) => {
    EE.subscribe(updateActiveAttr(item, activeAttr, valueAttr, true));

    item.addEventListener('click', () => {
      EE.emit(
        updateSearchParam(
          dataKey,
          item.getAttribute(valueAttr) || '',
          isMultiple
        )
      );
    });
  });

  const articleItems = document.querySelectorAll(targetSelector) || [];

  articleItems.forEach((item) => {
    EE.subscribe(updateActiveAttr(item, activeAttr, valueAttr));
  });

  const activeTagsList = getSearchListByKey(dataKey);

  if (activeTagsList.length > 0) {
    const activeValues = isMultiple
      ? activeTagsList.join(',')
      : activeTagsList[0];

    // update items if search params have already been applied
    EE.emit(activeValues);
  } else {
    // set initValue if search params is clear
    EE.emit(updateSearchParam(dataKey, initValue, isMultiple));
  }

  // NOTE: need to keep order for call listeners after DOM updating
  if (listeners.length) {
    listeners.forEach((listener) => {
      if (isFunction(listener)) {
        EE.subscribe(listener);
      }
    });
  }

  window.addEventListener('popstate', ({ state: { searchParams } }) =>
    EE.emit(searchParams || '')
  );

  return {
    emit: (data) => EE.emit(updateSearchParam(dataKey, data, isMultiple)),
  };
};

function updateActiveAttr(item, activeAttr, valueAttr, isEmptyDefault = false) {
  return (data = '') => {
    const hasTag = Boolean(data);
    const searchTagList = splitStringByComma(data);
    const containedTagList = splitStringByComma(item.getAttribute(valueAttr));

    const isDefaultItem = isEmptyDefault
      ? !containedTagList.length && !searchTagList.length
      : true;

    const isActiveItem = hasTag
      ? intersection(searchTagList, containedTagList).length > 0
      : isDefaultItem;

    if (isActiveItem) {
      item.setAttribute(activeAttr, 'true');
    } else {
      item.removeAttribute(activeAttr);
    }
  };
}

function updateSearchParam(searchKey, value, isMultiple = false) {
  const url = new URL(window.location);

  let newParams = '';

  if (!value) {
    url.searchParams.delete(searchKey);
  } else {
    const activeParams = splitStringByComma(
      url.searchParams.get(searchKey) || ''
    );

    newParams = isMultiple ? xor(activeParams, [value]).join(',') : value;

    url.searchParams.set(searchKey, newParams);
  }

  window.history.pushState(
    { searchParams: url.searchParams.get(searchKey) || '' },
    document.title,
    url.href
  );

  return newParams || '';
}

function splitStringByComma(string = '') {
  return String(string).split(',').filter(Boolean) || [];
}

function getSearchListByKey(key) {
  return splitStringByComma(
    new URL(window.location).searchParams.get(key) || ''
  );
}
