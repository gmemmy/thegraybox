import {create} from 'zustand';

type ChatLayoutState = {
  keyboardHeight: number;
  composerHeight: number;
  distanceFromBottom: number;
};

type ChatLayoutActions = {
  setKeyboardHeight: (value: number) => void;
  setComposerHeight: (value: number) => void;
  setDistanceFromBottom: (value: number) => void;
};

type ChatLayoutStore = ChatLayoutState & ChatLayoutActions;

export const useChatLayoutStore = create<ChatLayoutStore>((set) => ({
  keyboardHeight: 0,
  composerHeight: 0,
  distanceFromBottom: 0,

  setKeyboardHeight: (value) => {
    set({keyboardHeight: value});
  },

  setComposerHeight: (value) => {
    set({composerHeight: value});
  },

  setDistanceFromBottom: (value) => {
    set({distanceFromBottom: value});
  },
}));

export const selectKeyboardHeight = (s: ChatLayoutStore): number => s.keyboardHeight;

export const selectComposerHeight = (s: ChatLayoutStore): number => s.composerHeight;

export const selectDistanceFromBottom = (s: ChatLayoutStore): number => s.distanceFromBottom;

export function getBottomInset(params: {
  keyboardHeight: number;
  composerHeight: number;
  safeAreaBottom: number;
  extraBlankSpace?: number;
}): number {
  return (
    params.keyboardHeight +
    params.composerHeight +
    params.safeAreaBottom +
    (params.extraBlankSpace ?? 0)
  );
}
