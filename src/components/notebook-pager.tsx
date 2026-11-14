import { useCallback, useEffect, useRef, useState, type ComponentRef, type ComponentType } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';

import { NOTEBOOK_PAGES, notebookPageIndex, type NotebookMode } from '@/constants/notebook-modes';

export function NotebookPager({ Page }: { Page: ComponentType<{ mode: NotebookMode; onSwitch: (mode: NotebookMode) => void }> }) {
  const pager = useRef<ComponentRef<typeof ScrollView>>(null);
  const activePage = useRef(notebookPageIndex('band'));
  const [active, setActive] = useState(notebookPageIndex('band'));
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (width > 0) pager.current?.scrollTo({ x: width * activePage.current, animated: false });
  }, [width]);
  const switchMode = useCallback((mode: NotebookMode) => {
    Keyboard.dismiss();
    pager.current?.scrollTo({ x: width * notebookPageIndex(mode), animated: true });
  }, [width]);

  return <View style={styles.pager} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
    {width > 0 && <ScrollView ref={pager} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" onScrollBeginDrag={Keyboard.dismiss} scrollEventThrottle={16}
      onScroll={event => {
        const index = Math.max(0, Math.min(NOTEBOOK_PAGES.length - 1, Math.round(event.nativeEvent.contentOffset.x / width)));
        activePage.current = index;
        setActive(index);
      }}>
      {NOTEBOOK_PAGES.map((mode, index) => <View key={mode} style={{ width, height: '100%' }}
        accessibilityElementsHidden={index !== active} importantForAccessibility={index === active ? 'auto' : 'no-hide-descendants'}>
        <Page mode={mode} onSwitch={switchMode} />
      </View>)}
    </ScrollView>}
  </View>;
}

const styles = StyleSheet.create({ pager: { flex: 1, width: '100%', maxWidth: 620, alignSelf: 'center', backgroundColor: '#111116' } });
