import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';

import { TabIcon } from '@/components/navigation/tab-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1A1A1A',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}>

      {/* 1. Discover */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarAccessibilityLabel: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="discover" color={color} focused={focused} />
          ),
        }}
      />

      {/* 2. Explore */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarAccessibilityLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="explore" color={color} focused={focused} />
          ),
        }}
      />

      {/* 3. Chats */}
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarAccessibilityLabel: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="chats" color={color} focused={focused} />
          ),
        }}
      />

      {/* 4. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="profile" color={color} focused={focused} />
          ),
        }}
      />

      {/* Likes — hidden from tab bar, accessible via top-right heart icon */}
      <Tabs.Screen
        name="likes"
        options={{
          href: null,
          title: 'Likes',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    height: Platform.OS === 'ios' ? 84 : 62,
    paddingBottom: Platform.OS === 'ios' ? 28 : 6,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
