import { useState, useEffect } from "react";

//share logic and data in this cutom hook. That is why we initialize them outside the hook
let globalState = {};
//array of functions which can be called to update the states handled by the hook
let listeners = [];
let actions = {};

//generic custom hook
export const useStore = (shouldListen = true) => {
  const setState = useState(globalState)[1];

  //this is ust like the redux
  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload);
    //updating the globalState
    globalState = { ...globalState, ...newState };
    //updating the listeners(setState) here with new GlobalState
    for (const listener of listeners) {
      listener(globalState);
    }
  };

  //this is ran only once when a component is mounted, setState never changes, so it will be run onec when it is mounted and cleaned up when it is unmounted
  useEffect(() => {
    if (shouldListen) {
      listeners.push(setState);
    }

    //cleanup function to make sure that when component is unmount the listener is removed
    return () => {
      if (shouldListen) {
        listeners = listeners.filter((li) => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalState, dispatch];
};

//now we can no way to set this states
export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
