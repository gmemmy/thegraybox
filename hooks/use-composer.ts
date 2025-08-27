import * as React from 'react';

export function useComposer(convId: string) {
  const [draft, setDraft] = React.useState('');

  const send = React.useCallback(() => {
    // send will be wired by the screen via onSend callback; this hook manages draft only
  }, []);

  return {draft, setDraft, send};
}
