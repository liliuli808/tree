import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { Category } from '../types';
// 如果你的 types.ts 里没有 'other' 的定义，可能需要临时处理一下类型，
// 或者确保 Catgeory 类型包含它，这里为了安全我做了类型断言处理。

interface CategoryHeaderProps {
  selected: Category | 'all';
  onSelect: (cat: Category | 'all') => void;
}

const CATEGORIES: { id: Category | 'all' | 'other'; label: string; icon: string }[] = [
  { id: 'all', label: '全部', icon: '✨' },
  { id: 'moment', label: '此刻', icon: '🕓' },
  { id: 'love', label: '恋爱', icon: '💌' },
  { id: 'game', label: '游戏', icon: '🎮' },
  { id: 'music', label: '音乐', icon: '🎵' },
  { id: 'movie', label: '电影', icon: '🎬' },
  { id: 'friend', label: '交友', icon: '🤝' },
  { id: 'other', label: '其他', icon: '🌈' }, 
];

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ selected, onSelect }) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {CATEGORIES.map((cat) => {
           // 保持原有的过滤逻辑
           if (cat.id === 'other' && !['all', 'moment', 'love', 'game', 'music', 'movie', 'friend'].includes(selected as string) && (selected as string) !== 'other') {
             return null;
           }

           const isSelected = selected === cat.id;

           return (
             <TouchableOpacity
               key={cat.id}
               activeOpacity={0.7}
               onPress={() => onSelect(cat.id === 'other' ? 'moment' : cat.id as Category | 'all')}
               style={styles.gridItemWrapper}
             >
               <View style={[
                 styles.button,
                 isSelected ? styles.buttonSelected : styles.buttonNormal
               ]}>
                 <Text style={styles.icon}>{cat.icon}</Text>
                 <Text style={[
                   styles.label,
                   isSelected ? styles.labelSelected : styles.labelNormal
                 ]}>
                   {cat.label}
                 </Text>
               </View>
             </TouchableOpacity>
           );
        })}
      </View>

      {/* 底部的小横条装饰 */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(250, 250, 249, 0.96)', // stone-50, slightly transparent
    borderBottomWidth: 1,
    borderBottomColor: '#e7e5e4', // stone-200
    borderBottomLeftRadius: 24, // rounded-b-2xl
    borderBottomRightRadius: 24,
    // 阴影
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    paddingTop: 12,
    paddingBottom: 4,
    zIndex: 20, // 确保浮在列表上方
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 允许换行实现 Grid 效果
    paddingHorizontal: 8,
  },
  gridItemWrapper: {
    width: '25%', // 对应 grid-cols-4 (100% / 4)
    padding: 4, // 对应 gap
    alignItems: 'center',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonNormal: {
    backgroundColor: 'transparent',
  },
  buttonSelected: {
    backgroundColor: '#d1fae5', // emerald-100
    borderWidth: 2,
    borderColor: '#10b981', // emerald-500 (ring effect)
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  labelNormal: {
    color: '#57534e', // stone-600
  },
  labelSelected: {
    color: '#065f46', // emerald-800
    fontWeight: 'bold',
  },
  handleContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  handle: {
    width: 48, // w-12
    height: 4,  // h-1
    backgroundColor: '#e7e5e4', // stone-200
    borderRadius: 999,
  }
});

export default CategoryHeader;