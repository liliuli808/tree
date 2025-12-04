import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { Home, MessageSquare, User, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 这些 Props 是 React Navigation 传递给自定义 TabBar 的标准参数
// 如果你还没配路由，可以暂时忽略类型错误，先把 UI 做出来
interface BottomNavProps {
  state?: any;
  descriptors?: any;
  navigation?: any;
  onOpenCreate?: () => void; // 依然保留这个手动触发的方法
}

// 屏幕宽度，用于计算位置
const { width } = Dimensions.get('window');

const BottomNav: React.FC<BottomNavProps> = ({ state, navigation, onOpenCreate }) => {
  
  // 映射路由名称到图标
  const getIcon = (routeName: string, isActive: boolean) => {
    const props = { 
      size: 26, 
      color: isActive ? '#059669' : '#a8a29e', // emerald-600 : stone-400
      strokeWidth: isActive ? 2.5 : 2 
    };

    switch (routeName) {
      case 'index': // 对应 Web 的 "/"
        return <Home {...props} />;
      case 'messages': // 对应 Web 的 "/messages"
        return <MessageSquare {...props} />;
      case 'profile': // 对应 Web 的 "/profile"
        return <User {...props} />;
      default:
        return <Home {...props} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index': return '树洞';
      case 'messages': return '消息';
      case 'profile': return '我的';
      default: return '';
    }
  };

  // 模拟路由数据（如果你还没配路由，用这个假数据调试 UI）
  const routes = state?.routes || [
    { key: 'index', name: 'index' },
    { key: 'messages', name: 'messages' },
    { key: 'profile', name: 'profile' },
  ];
  const activeIndex = state?.index || 0;

  return (
    <View style={styles.positionWrapper}>
      <View style={styles.container}>
        
        {/* Left Side (Index) */}
        <TabItem 
          item={routes[0]} 
          isActive={activeIndex === 0} 
          onPress={() => navigation?.navigate(routes[0].name)}
          icon={getIcon(routes[0].name, activeIndex === 0)}
          label={getLabel(routes[0].name)}
        />

        {/* Center Action Button - 凸起按钮 */}
        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenCreate}
            style={styles.centerButton}
          >
            <Plus size={28} color="#fff" strokeWidth={3} />
          </TouchableOpacity>
        </View>

        {/* Right Side (Messages & Profile) */}
        {/* 这里我们假设 routes[1] 是 messages, routes[2] 是 profile */}
        <TabItem 
          item={routes[1]} 
          isActive={activeIndex === 1} 
          onPress={() => navigation?.navigate(routes[1].name)}
          icon={getIcon(routes[1].name, activeIndex === 1)}
          label={getLabel(routes[1].name)}
          showBadge={true} // 消息红点
        />
        
        <TabItem 
          item={routes[2]} 
          isActive={activeIndex === 2} 
          onPress={() => navigation?.navigate(routes[2].name)}
          icon={getIcon(routes[2].name, activeIndex === 2)}
          label={getLabel(routes[2].name)}
        />

      </View>
    </View>
  );
};

// 抽取单个 Tab 组件
const TabItem = ({ item, isActive, onPress, icon, label, showBadge }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.tabItem}
    activeOpacity={0.7}
  >
    <View style={[
      styles.iconWrapper,
      isActive && styles.iconWrapperActive
    ]}>
      {icon}
      {showBadge && <View style={styles.badge} />}
    </View>
    <Text style={[
      styles.label,
      isActive ? styles.labelActive : styles.labelInactive
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // 定位层：绝对定位在底部
  positionWrapper: {
    position: 'absolute',
    bottom: 24, // bottom-6
    left: 0,
    right: 0,
    alignItems: 'center', // 居中
    zIndex: 40,
  },
  // 实际的胶囊容器
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.95)', // bg-white/90
    borderRadius: 999, // rounded-full
    height: 64, // h-16
    paddingHorizontal: 12,
    width: Math.min(width - 48, 400), // max-w-md, margin-x
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    // Shadows
    shadowColor: "#78716c", // stone-500
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8, // Android shadow
  },
  // 单个 Tab
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 12,
    transition: 'all', // RN 不支持 CSS transition，需要用 Reanimated 库做动画，这里先忽略
  },
  iconWrapperActive: {
    transform: [{ translateY: -2 }], // -translate-y-1
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    backgroundColor: '#ef4444', // red-500
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
  labelInactive: {
    color: '#a8a29e', // stone-400
  },
  labelActive: {
    color: '#047857', // emerald-700
  },
  // 中间凸起按钮容器
  centerButtonWrapper: {
    width: 60, 
    alignItems: 'center',
    zIndex: 50,
    marginTop: -40, // 核心：向上偏移实现凸起 (-top-6)
  },
  centerButton: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 28,
    backgroundColor: '#059669', // emerald-600
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fafaf9', // stone-50
    // Shadow
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default BottomNav;