import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

// 引入图标
import { Home, MessageSquare, User, Plus } from 'lucide-react-native';

// 1. 定义屏幕组件 (如果你还没有迁移完 screen，先用这些占位)
const FeedScreen = () => (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>首页(树洞)</Text></View>
);
const MessagesScreen = () => (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>消息</Text></View>
);
const ProfileScreen = () => (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>我的</Text></View>
);

// 2. 创建导航器
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 3. 配置底部 Tab
function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // 隐藏顶部标题栏
                tabBarActiveTintColor: '#059669', // 选中颜色 (Emerald)
                tabBarInactiveTintColor: '#a8a29e', // 未选中颜色
                tabBarStyle: { paddingBottom: 5, height: 60 }, // 样式调整
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Feed') return <Home size={size} color={color} />;
                    if (route.name === 'Messages') return <MessageSquare size={size} color={color} />;
                    if (route.name === 'Profile') return <User size={size} color={color} />;
                    return null;
                },
            })}
        >
            <Tab.Screen name="Feed" component={FeedScreen} options={{ title: '树洞' }} />
            <Tab.Screen name="Messages" component={MessagesScreen} options={{ title: '消息' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
        </Tab.Navigator>
    );
}

// 4. 主入口：组合 Stack + Tab
function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {/* 主程序是 Tab 布局 */}
                    <Stack.Screen name="MainTabs" component={TabNavigator} />

                    {/* 详情页等其他页面放在这里 (覆盖在 Tab 之上) */}
                    {/* <Stack.Screen name="PostDetail" component={PostDetailScreen} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;