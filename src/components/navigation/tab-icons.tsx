import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

interface TabIconProps {
  name: 'discover' | 'explore' | 'likes' | 'chats' | 'profile';
  color?: any;
  focused: boolean;
}

export function TabIcon({ name, color, focused }: TabIconProps) {
  const SIZE = 25;

  switch (name) {
    case 'discover':
      // Stacked cards icon — like the Spicy app reference
      return focused
        ? <Entypo name="documents" size={SIZE} color={color} />
        : <Entypo name="documents" size={SIZE} color={color} />;

    case 'explore':
      // Location pin
      return focused
        ? <AntDesign name="compass" size={SIZE + 1} color={color}/>
        : <Ionicons name="location-outline" size={SIZE + 1} color={color} />;

    case 'likes':
      // Heart
      return focused
        ? <Ionicons name="heart" size={SIZE} color={color} />
        : <Ionicons name="heart-outline" size={SIZE} color={color} />;

    case 'chats':
      // Speech bubble
      return focused
        ? <Ionicons name="chatbubble-ellipses" size={SIZE} color={color} />
        : <Ionicons name="chatbubble-ellipses-outline" size={SIZE} color={color} />;

    case 'profile':
      // Person
      return focused
        ? <Ionicons name="person" size={SIZE} color={color} />
        : <Ionicons name="person-outline" size={SIZE} color={color} />;

    default:
      return null;
  }
}

