import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
// 1. 确保安装了 lucide-react-native 和 react-native-svg
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Pause } from 'lucide-react-native';
import { Post, CATEGORY_LABELS } from '../types';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  onImageClick?: (url: string) => void;
  isDetailView?: boolean;
}

// 屏幕宽度，用于计算图片大小
const SCREEN_WIDTH = Dimensions.get('window').width;

const PostCard: React.FC<PostCardProps> = ({ post, onClick, onImageClick, isDetailView = false }) => {
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(p => p - 1);
    } else {
      setLikesCount(p => p + 1);
    }
    setLiked(!liked);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return '1天前';
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onClick}
      // 2. 将原来的 shadow hover 逻辑转换为 RN 的样式
      style={[
        styles.card, 
        isDetailView ? styles.cardDetail : styles.cardList
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {/* Avatar: RN 不支持文字直接居中，需要 Flex */}
          <View style={[styles.avatar, { backgroundColor: '#e7e5e4' }]}>
             <Text style={styles.avatarText}>
                {post.userNickname.substring(0, 2).toUpperCase()}
             </Text>
          </View>
          
          <View>
            <Text style={styles.nickname}>{post.userNickname}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{formatTime(post.timestamp)}</Text>
              <Text style={styles.metaDot}>·</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {CATEGORY_LABELS[post.category]}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color="#d6d3d1" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text 
          style={styles.contentText}
          // 3. Web 的 line-clamp 对应 RN 的 numberOfLines
          numberOfLines={!isDetailView ? 4 : undefined}
          ellipsizeMode="tail"
        >
          {post.content}
        </Text>
      </View>

      {/* Audio Player (Mock) */}
      {post.audio && (
        <View style={styles.audioContainer}>
          <TouchableOpacity
            onPress={() => setPlaying(!playing)}
            style={styles.playButton}
          >
            {playing ? (
              <Pause size={14} color="#fff" fill="#fff" />
            ) : (
              <Play size={14} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
            )}
          </TouchableOpacity>
          
          <View style={styles.audioTrack}>
             <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: playing ? '100%' : '33%' }
                  ]} 
                />
             </View>
             <Text style={styles.audioDuration}>{post.audio}</Text>
          </View>
        </View>
      )}

      {/* Images/Media */}
      {post.images && post.images.length > 0 && (
        <View style={styles.imageGrid}>
          {post.images.map((img, idx) => {
            // 简单的图片网格逻辑：如果有多张图，宽度减半
            const isSingle = post.images!.length === 1;
            return (
              <TouchableOpacity 
                key={idx}
                activeOpacity={0.9}
                onPress={() => onImageClick && onImageClick(img)}
                style={[
                  styles.imageWrapper,
                  // 如果是两张图，给一个简单的间距逻辑
                  !isSingle && { width: '48%', marginRight: idx % 2 === 0 ? '4%' : 0 }
                ]}
              >
                <Image 
                  source={{ uri: img }} 
                  style={[styles.image, { aspectRatio: 1 }]} 
                  resizeMode="cover"
                />
                
                {post.isLivePhoto && (
                   <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                   </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      {/* Actions */}
      <View style={styles.footer}>
        <View style={styles.actionGroup}>
          <TouchableOpacity
            onPress={handleLike}
            style={styles.actionButton}
          >
            <Heart 
              size={18} 
              color={liked ? "#ef4444" : "#a8a29e"} // red-500 : stone-400
              fill={liked ? "#ef4444" : "transparent"} 
            />
            <Text style={[styles.actionText, liked && { color: "#ef4444" }]}>
              {likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onClick}
          >
            <MessageCircle size={18} color="#a8a29e" />
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Share2 size={18} color="#a8a29e" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// 4. 将 Tailwind 转换为 RN StyleSheet
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5f5f4', // stone-100
  },
  cardList: {
    borderRadius: 16,
    marginBottom: 16,
    // RN 的阴影写法
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  cardDetail: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 8,
    borderTopWidth: 0, // 详情页通常衔接顶部 Header，可能不需要顶边框
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // RN 0.71+ 支持 gap，旧版本需用 marginLeft
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#57534e', // stone-600
    fontWeight: 'bold',
    fontSize: 12,
  },
  nickname: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#292524', // stone-800
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#a8a29e', // stone-400
  },
  metaDot: {
    marginHorizontal: 4,
    color: '#a8a29e',
    fontSize: 12,
  },
  categoryBadge: {
    backgroundColor: '#ecfdf5', // emerald-50
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1fae5', // emerald-100
  },
  categoryText: {
    color: '#059669', // emerald-600
    fontSize: 10,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  contentContainer: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#44403c', // stone-700
    lineHeight: 22,
  },
  // Audio Styles
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5', // emerald-50
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'flex-start', // width: fit-content
    borderWidth: 1,
    borderColor: '#d1fae5',
    paddingRight: 16,
    gap: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    backgroundColor: '#10b981', // emerald-500
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioTrack: {
    justifyContent: 'center',
    gap: 4,
  },
  progressBarBackground: {
    height: 4,
    width: 128, // w-32
    backgroundColor: '#a7f3d0', // emerald-200
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981', // emerald-500
  },
  audioDuration: {
    fontSize: 10,
    color: '#059669', // emerald-600
    fontWeight: '500',
  },
  // Image Styles
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    width: '100%', // 默认为单张图宽度
  },
  image: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#facc15', // yellow-400
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fafaf9', // stone-50
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#a8a29e', // stone-400
  },
});

export default PostCard;