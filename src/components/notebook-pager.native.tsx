import { useCallback, useRef, useState, type ComponentType } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { NOTEBOOK_PAGES, notebookPageIndex, type NotebookMode } from '@/constants/notebook-modes';

export function NotebookPager({ Page }: { Page: ComponentType<{ mode: NotebookMode; onSwitch: (mode: NotebookMode) => void }> }) {
  const pager = useRef<PagerView>(null);
  const [active, setActive] = useState(notebookPageIndex('band'));
  const switchMode = useCallback((mode: NotebookMode) => {
    Keyboard.dismiss();
    pager.current?.setPage(notebookPageIndex(mode));
  }, []);

  return <PagerView ref={pager} style={styles.pager} initialPage={notebookPageIndex('band')}
    orientation="horizontal" layoutDirection="ltr" keyboardDismissMode="on-drag"
    onPageSelected={event => setActive(event.nativeEvent.position)}>
    {NOTEBOOK_PAGES.map((mode, index) => <View key={mode} collapsable={false} style={styles.page}
      accessibilityElementsHidden={index !== active} importantForAccessibility={index === active ? 'auto' : 'no-hide-descendants'}>
      <Page mode={mode} onSwitch={switchMode} />
    </View>)}
  </PagerView>;
}

const styles = StyleSheet.create({ pager: { flex: 1, backgroundColor: '#111116' }, page: { width: '100%', height: '100%' } });
