import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Animated } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Colors } from '../constants/Colors';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      if (isAuthenticated && hasCompletedOnboarding) {
        router.replace('/(tabs)/home');
      } else if (isAuthenticated) {
        router.replace('/link-stores');
      } else {
        router.replace('/onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Logo size={80} showWordmark={false} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
