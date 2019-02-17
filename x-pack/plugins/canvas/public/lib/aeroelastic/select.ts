/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  ActionId,
  ChangeCallbackFunction,
  Json,
  Meta,
  Payload,
  PlainFun,
  Selector,
  State,
  TypeName,
  UpdaterFunction,
} from './index';

export const shallowEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

const makeUid = (): ActionId => 1e11 + Math.floor((1e12 - 1e11) * Math.random());

export const select = (fun: PlainFun): Selector => (...fns) => {
  let { prevId, cache } = { prevId: NaN as ActionId, cache: null as Json };
  const old = (object: State): boolean => prevId === (prevId = object.primaryUpdate.payload.uid);
  return obj => (old(obj) ? cache : (cache = fun(...fns.map(f => f(obj) as Json))));
};

// this function `selectReduce` is in the process of being removed in another PR
export const selectReduce = (fun: PlainFun, previousValue: Json): Selector => (...inputs) => {
  // last-value memoizing version of this single line function:
  // (fun, previousValue) => (...inputs) => state => previousValue = fun(previousValue, ...inputs.map(input => input(state)))
  let argumentValues = [] as Json[];
  let value = previousValue;
  let prevValue = previousValue;
  return (state: State) => {
    if (
      shallowEqual(argumentValues, (argumentValues = inputs.map(input => input(state)))) &&
      value === prevValue
    ) {
      return value;
    }

    prevValue = value;
    value = fun(prevValue, ...argumentValues);
    return value;
  };
};

// this function `createStore` is in the process of being removed in another PR
export const createStore = (initialState: State, onChangeCallback: ChangeCallbackFunction) => {
  let currentState = initialState;
  let updater: UpdaterFunction = (state: State): State => state; // default: no side effect
  const getCurrentState = () => currentState;
  // const setCurrentState = newState => (currentState = newState);
  const setUpdater = (updaterFunction: UpdaterFunction) => {
    updater = updaterFunction;
  };

  const commit = (type: TypeName, payload: Payload, meta: Meta = { silent: false }) => {
    currentState = updater({
      ...currentState,
      primaryUpdate: {
        type,
        payload: { ...payload, uid: makeUid() },
      },
    });
    if (!meta.silent) {
      onChangeCallback({ type, state: currentState }, meta);
    }
  };

  const dispatch = (type: TypeName, payload: Payload) => commit(type, payload);

  return { getCurrentState, setUpdater, commit, dispatch };
};
