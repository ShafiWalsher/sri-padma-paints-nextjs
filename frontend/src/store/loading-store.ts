import { useSyncExternalStore } from "react";

let isLoading = false;
const listeners = new Set<() => void>();

// The store object contains the methods to interact with the loading state
const loadingStore = {
  show() {
    isLoading = true;
    listeners.forEach((listener) => listener());
  },
  hide() {
    isLoading = false;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    // Return an unsubscribe function
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return isLoading;
  },
};

// A custom hook that lets React components subscribe to our store
export function useLoadingStore() {
  return useSyncExternalStore(
    loadingStore.subscribe,
    loadingStore.getSnapshot,
    () => false
  );
}

// Export the show/hide functions for use in non-React files like api.ts
export const showLoader = loadingStore.show;
export const hideLoader = loadingStore.hide;
