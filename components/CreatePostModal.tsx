import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { X, Image as ImageIcon, Video, Mic, MapPin, Aperture } from 'lucide-react-native';
import { Category, Post } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: Partial<Post>) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'moment', label: '此刻' },
  { id: 'love', label: '恋爱' },
  { id: 'game', label: '游戏' },
  { id: 'music', label: '音乐' },
  { id: 'movie', label: '电影' },
  { id: 'friend', label: '交友' },
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('moment');
  const [hasImage, setHasImage] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;

    onSubmit({
      content,
      category: selectedCategory,
      images: hasImage ? ['https://picsum.photos/600/600'] : [],
      isLivePhoto: isLive,
      likes: 0,
      comments: [],
      timestamp: Date.now(),
      userNickname: 'Anonymous User',
      userAvatar: 'bg-emerald-300', // RN 中通常需要改用图片 URL 或颜色代码
      userId: 'me',
    });

    // Reset
    setContent('');
    setHasImage(false);
    setIsLive(false);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* KeyboardAvoidingView 是关键：
        它会根据键盘高度自动调整内边距，让底部工具栏始终在键盘上方。
      */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          {/* 点击背景关闭的遮罩层 */}
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={onClose} 
          />
          
          {/* 实际的内容卡片 */}
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color="#a8a29e" />
              </TouchableOpacity>
              
              <Text style={styles.headerTitle}>投递树洞</Text>
              
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!content.trim()}
                style={[
                  styles.submitBtn,
                  !content.trim() && styles.submitBtnDisabled
                ]}
              >
                <Text style={styles.submitBtnText}>发布</Text>
              </TouchableOpacity>
            </View>

            {/* Body */}
            <View style={styles.body}>
              {/* Category Selector */}
              <View style={styles.categoryContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScrollContent}
                >
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                        style={[
                          styles.categoryTag,
                          isSelected ? styles.categoryTagSelected : styles.categoryTagNormal
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            isSelected ? styles.categoryTextSelected : styles.categoryTextNormal
                          ]}
                        >
                          #{cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Text Input */}
              <TextInput
                placeholder="分享你的故事、心情或秘密..."
                placeholderTextColor="#d6d3d1"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top" // Android 必需，否则文字垂直居中
                style={styles.input}
                autoFocus={true} // 打开时自动聚焦
              />

              {/* Media Preview Mock */}
              {hasImage && (
                <View style={styles.previewContainer}>
                  <Image 
                    source={{ uri: "https://picsum.photos/200" }} 
                    style={styles.previewImage} 
                  />
                  <TouchableOpacity 
                    onPress={() => setHasImage(false)}
                    style={styles.removePreviewBtn}
                  >
                    <X size={12} color="#fff" />
                  </TouchableOpacity>
                  
                  {isLive && (
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Toolbar */}
            <View style={styles.toolbar}>
              <View style={styles.toolGroup}>
                <TouchableOpacity 
                  onPress={() => setHasImage(!hasImage)}
                  style={[styles.toolIcon, hasImage && styles.toolIconActive]}
                >
                  <ImageIcon size={24} color={hasImage ? "#059669" : "#78716c"} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.toolIcon}>
                  <Video size={24} color="#78716c" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => { setHasImage(true); setIsLive(!isLive); }}
                  style={[styles.toolIcon, isLive && styles.toolIconLive]}
                >
                  <Aperture size={24} color={isLive ? "#ca8a04" : "#78716c"} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.toolIcon}>
                  <Mic size={24} color="#78716c" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.locationTag}>
                <MapPin size={12} color="#a8a29e" />
                <Text style={styles.locationText}>添加位置</Text>
              </TouchableOpacity>
            </View>
            
            {/* 底部安全区垫片 (适配 iPhone 底部横条) */}
            <SafeAreaView edges={['bottom']} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // backdrop
    justifyContent: 'flex-end', // Bottom Sheet 效果
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // Max height control logic handled by flex/content
    maxHeight: '90%', 
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4', // stone-100
  },
  closeBtn: {
    padding: 8,
    margin: -8, // 增加点击热区
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#44403c', // stone-700
  },
  submitBtn: {
    backgroundColor: '#059669', // emerald-600
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  body: {
    padding: 16,
    // 给定最小高度，避免键盘弹起时太扁
    minHeight: 200, 
  },
  categoryContainer: {
    marginBottom: 16,
    height: 32, // 固定高度防止抖动
  },
  categoryScrollContent: {
    gap: 8, // RN 0.71+
    paddingRight: 16,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTagNormal: {
    backgroundColor: '#fff',
    borderColor: '#e7e5e4', // stone-200
  },
  categoryTagSelected: {
    backgroundColor: '#ecfdf5', // emerald-50
    borderColor: '#10b981', // emerald-500
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTextNormal: {
    color: '#78716c', // stone-500
  },
  categoryTextSelected: {
    color: '#047857', // emerald-700
  },
  input: {
    fontSize: 16, // text-lg 稍微大一点
    color: '#292524', // stone-800
    minHeight: 120, // 对应 h-40
    textAlignVertical: 'top',
  },
  previewContainer: {
    width: 96, // w-24
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removePreviewBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 4,
  },
  liveBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#facc15', // yellow-400
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  liveBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fafaf9', // stone-50
    borderTopWidth: 1,
    borderTopColor: '#f5f5f4',
  },
  toolGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  toolIcon: {
    padding: 4,
    borderRadius: 20,
  },
  toolIconActive: {
    backgroundColor: '#d1fae5', // emerald-100
  },
  toolIconLive: {
    backgroundColor: '#fef9c3', // yellow-100
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  locationText: {
    fontSize: 12,
    color: '#a8a29e', // stone-400
  },
});

export default CreatePostModal;