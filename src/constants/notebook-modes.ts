export type NotebookMode = 'band' | 'festival';
export const notebookStorageKey = (mode: NotebookMode) => mode === 'band' ? 'bandtee.records.v1' : 'festivaltee.records.v1';
export const notebookAccent = (mode: NotebookMode) => mode === 'band' ? '#D8FF66' : '#FF8A3D';
// Band is the main page; festival is the neighboring page to its right.
export const NOTEBOOK_PAGES: readonly NotebookMode[] = ['band', 'festival'];
export const notebookPageIndex = (mode: NotebookMode) => NOTEBOOK_PAGES.indexOf(mode);
