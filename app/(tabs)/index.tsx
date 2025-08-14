import React from 'react';
import {type Href, Link} from 'expo-router';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';

type Demo = {key: string; title: string; href: Href};

const DEMOS: Demo[] = [
  {key: 'nike', title: 'Nike Product Detail', href: '/demos/nike'},
  {key: 'glass-tabs', title: 'Glass Tabs', href: '/demos/glass-tabs'},
  {key: 'parallax-header', title: 'Parallax Header', href: '/demos/parallax-header'},
];

export default function GalleryScreen() {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={DEMOS}
      numColumns={2}
      columnWrapperStyle={styles.row}
      keyExtractor={(item) => item.key}
      renderItem={({item}) => (
        <Link href={item.href} asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    gap: 16,
  },
  card: {
    flex: 1,
    minHeight: 120,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});
