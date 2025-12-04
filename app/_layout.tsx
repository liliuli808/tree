import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  // 1. 鉴权状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments(); // 获取当前路由片段
  const router = useRouter();

  // 2. 初始化检查登录状态
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const auth = await AsyncStorage.getItem('hollow_auth');
      setIsAuthenticated(auth === 'true');
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  // 3. 路由守卫 (核心逻辑)
  useEffect(() => {
    // 等待初始检查完成
    if (isAuthenticated === null) return;

    // 检查当前是否在 (tabs) 组里 (即受保护页面)
    // 简单判断：如果不在 auth 组(登录页)，且没登录，就去登录
    const inAuthGroup = segments[0] === '(auth)'; 
    // 注意：这里我们假设登录页放在 app/login.tsx 或 app/(auth)/login.tsx
    // 为了简单，我们直接用 login.tsx

    if (!isAuthenticated && segments[0] !== 'login') {
      // 没登录，且不在登录页 -> 踢去登录
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // 登录了，还在登录页 -> 踢回首页
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  // 4. 等待检查时显示 Loading
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  // 5. 定义全局 Stack 路由结构
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Stack 会自动加载 app 目录下的文件。
         我们需要定义一些特殊页面的配置。
      */}
      
      {/* 主程序 (Tab 页) */}
      <Stack.Screen name="(tabs)" />

      {/* 登录页 (需要你自己创建 app/login.tsx) */}
      <Stack.Screen 
        name="login" 
        options={{ 
          animation: 'fade', // 登录页切换用渐变动画更好看
          gestureEnabled: false // 禁止手势返回
        }} 
      />

      {/* 帖子详情页 (动态路由) */}
      <Stack.Screen 
        name="post/[id]" 
        options={{ 
          headerShown: true, // 详情页通常需要顶部栏
          title: '详情',
          headerBackTitle: '返回',
          headerTintColor: '#44403c',
        }} 
      />
    </Stack>
  );
}