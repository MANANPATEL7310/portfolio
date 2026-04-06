'use client';

import { useCallback, useMemo, useState } from 'react';

export type FinderPane = 'root' | 'project' | 'about' | 'trash';

export interface FinderLocation {
  pane: FinderPane;
  projectId?: string | null;
}

interface FinderNavigationState {
  history: FinderLocation[];
  index: number;
}

function isSameLocation(left: FinderLocation, right: FinderLocation) {
  return left.pane === right.pane && (left.projectId ?? null) === (right.projectId ?? null);
}

export function useFinderNavigation(initialLocation: FinderLocation) {
  const [state, setState] = useState<FinderNavigationState>({
    history: [initialLocation],
    index: 0,
  });

  const currentLocation = state.history[state.index] ?? initialLocation;

  const navigate = useCallback((nextLocation: FinderLocation) => {
    setState((currentState) => {
      const current = currentState.history[currentState.index] ?? initialLocation;

      if (isSameLocation(current, nextLocation)) {
        return currentState;
      }

      const nextHistory = [...currentState.history.slice(0, currentState.index + 1), nextLocation];

      return {
        history: nextHistory,
        index: nextHistory.length - 1,
      };
    });
  }, [initialLocation]);

  const replace = useCallback((nextLocation: FinderLocation) => {
    setState((currentState) => {
      const current = currentState.history[currentState.index] ?? initialLocation;

      if (isSameLocation(current, nextLocation)) {
        return currentState;
      }

      const nextHistory = [...currentState.history];
      nextHistory[currentState.index] = nextLocation;

      return {
        history: nextHistory,
        index: currentState.index,
      };
    });
  }, [initialLocation]);

  const goBack = useCallback(() => {
    setState((currentState) => {
      if (currentState.index === 0) {
        return currentState;
      }

      return {
        ...currentState,
        index: currentState.index - 1,
      };
    });
  }, []);

  const goForward = useCallback(() => {
    setState((currentState) => {
      if (currentState.index >= currentState.history.length - 1) {
        return currentState;
      }

      return {
        ...currentState,
        index: currentState.index + 1,
      };
    });
  }, []);

  return useMemo(
    () => ({
      currentLocation,
      navigate,
      replace,
      goBack,
      goForward,
      canGoBack: state.index > 0,
      canGoForward: state.index < state.history.length - 1,
    }),
    [currentLocation, goBack, goForward, navigate, replace, state.history.length, state.index],
  );
}
