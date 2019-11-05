// Copyright 2019 Stanford University see LICENSE for license

export const getHoneybadgerNotifier = state => state.selectorReducer.honeybadger.notifier

// To avoid have to export honeybadgerNotifier as default
export const noop = () => {}
