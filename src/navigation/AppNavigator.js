import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { theme } from '../theme/theme';

import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const MainStack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.cream,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: theme.colors.ink,
        headerTitleStyle: {
          fontFamily: theme.fonts.serif,
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: theme.colors.cream,
        }
      }}
    >
      <MainStack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <MainStack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Product Details' }} 
      />
    </MainStack.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  const NavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.ink,
      background: theme.colors.cream,
      card: theme.colors.cream,
      text: theme.colors.ink,
      border: theme.colors.sand,
      notification: theme.colors.camel,
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={NavigationTheme}>
      {userToken !== null ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
