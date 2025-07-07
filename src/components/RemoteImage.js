import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme/colors';

const RemoteImage = ({ uri, style }: { uri: string; style?: any }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[style, styles.container]}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={styles.loader}
        />
      )}
      <Image
        source={{ uri }}
        style={[style, loading && { opacity: 0 }]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default RemoteImage;
