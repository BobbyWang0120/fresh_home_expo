import { StyleSheet, View, Text } from 'react-native';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
