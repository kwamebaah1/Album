import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { List, IconButton, Colors } from 'react-native-paper';
import axios from 'axios';

export default function App() {
  const fetchAlbums = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/albums');
      return response.data;
    } catch (error) {
      console.error('Error fetching albums:', error);
      return [];
    }
  };

  const AlbumsScreen = ({ navigation }) => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
      fetchAlbums().then((data) => {
        setAlbums(data);
      });
    }, []);

    const renderItem = ({ item }) => (
      <List.Item
        title={item.title}
        titleStyle={styles.albumTitle}
        left={() => <List.Icon icon="album" color="#2196F3" />}
        right={() => (
          <IconButton
            icon="delete"
            color="#FF0000"
            onPress={() => handleDelete(item.id)}
          />
        )}
        onPress={() => navigation.navigate('AlbumPhotos', { albumId: item.id })}
      />
    );

    const handleDelete = async (albumId) => {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/albums/${albumId}`);
        setAlbums(albums.filter((album) => album.id !== albumId));
      } catch (error) {
        console.error('Error deleting album:', error);
      }
    };

    return (
      <View style={styles.container}>
        <List.Section style={styles.listSection}>
          <List.Subheader style={styles.listHeader}>Albums</List.Subheader>
          <List.AccordionGroup>
            <List.Section>
              <FlatList
                data={albums}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              />
            </List.Section>
          </List.AccordionGroup>
        </List.Section>
      </View>
    );
  };

  const AlbumPhotosScreen = () => {
    // Implement the screen to display album photos in a grid
    return (
      <View style={styles.container}>
        <List.Section style={styles.listSection}>
          <List.Subheader style={styles.listHeader}>Album Photos Screen</List.Subheader>
        </List.Section>
      </View>
    );
  };

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Albums" component={AlbumsScreen} />
        <Stack.Screen name="AlbumPhotos" component={AlbumPhotosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  listSection: {
    marginVertical: 10,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3', // Use a color hex value
  },
  albumTitle: {
    fontSize: 16,
  },
});
