import React, { useCallback, useRef } from 'react';
import {
  ScrollView,
  RefreshControl,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface RefreshableScrollViewProps extends ScrollViewProps {
  onRefresh?: () => Promise<void>;
  containerStyle?: ViewStyle;
}

export const RefreshableScrollView: React.FC<RefreshableScrollViewProps> = ({
  onRefresh,
  children,
  containerStyle,
  ...scrollViewProps
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  }, [onRefresh]);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#666"
          colors={['#666']}
        />
      }
      style={[styles.container, containerStyle]}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
