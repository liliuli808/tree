import ImageView from "react-native-image-viewing";

const ImageViewer = ({ url, onClose }: { url?: string; onClose: () => void }) => (
  <ImageView
    images={[{ uri: url }]}
    imageIndex={0}
    visible={!!url}
    onRequestClose={onClose}
  />
);