import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import styles from "./styles";

// When running on code sandbox, uncomment the following
// @ts-ignore
import Icon from "react-native-vector-icons/Fontisto";

// When running on your local machine, uncomment the following
// @ts-ignore
// import Icon from "react-native-vector-icons/dist/Fontisto";

import { type Video } from "../../services/youtube";
import { formatDate } from "../../utils";

export const ThumbnailComp = ({
  uri,
  badge,
  rounded,
}: {
  uri: string;
  badge: string;
  rounded?: boolean;
}) => {
  const style = rounded
    ? [styles.thumbnail, styles.borderRounded10]
    : styles.thumbnail;
  return (
    <View>
      <Image source={{ uri }} style={style} />
      <Text style={styles.thumbnailBadge}>{badge}</Text>
    </View>
  );
};

const MenuItem = ({ iconName, title }: { iconName: string; title: string }) => {
  return (
    <MenuOption>
      <View style={styles.menuItem}>
        <Icon name={iconName} size={20} />
        <Text>{title}</Text>
      </View>
    </MenuOption>
  );
};

const PopupComp = ({ opacity }: { opacity: number }) => {
  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          triggerTouchable: {
            style: [styles.menu, { opacity }],
          },
        }}
      >
        <Icon name="more-v-a" size={15} />
      </MenuTrigger>
      <MenuOptions>
        <MenuItem iconName="play-list" title="Add to queue" />
        <MenuItem iconName="share-a" title="Share" />
      </MenuOptions>
    </Menu>
  );
};

const CardActionButton = ({
  iconName,
  title,
  iconSize,
}: {
  iconName: string;
  title: string;
  iconSize: number;
}) => {
  return (
    <TouchableOpacity style={styles.button}>
      <Icon name={iconName} size={iconSize} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const BottomButtonsComp = () => {
  return (
    <View style={styles.bottomButtonContainer}>
      <CardActionButton iconName="clock" title="Watch later" iconSize={18} />
      <CardActionButton
        iconName="play-list"
        title="Add to queue"
        iconSize={15}
      />
    </View>
  );
};

export const CardBottomComp = ({
  video,
  showPopoverTrigger,
  showButtons,
  scale = 1,
}: {
  video: Video;
  showPopoverTrigger: boolean;
  showButtons?: boolean;
  scale?: number;
}) => {
  return (
    <View style={styles.cardBottomContainer}>
      <View style={styles.descriptionContainer}>
        <View style={styles.avatar} />
        <View style={styles.flex}>
          <Text
            style={[styles.title, { fontSize: 16 * scale }]}
            numberOfLines={2}
          >
            {video.snippet.title}
          </Text>
          <View style={styles.row}>
            <Text style={[styles.channel, { fontSize: 16 * scale }]}>
              {video.snippet.channelTitle}
            </Text>
            <View
              style={[styles.check, { width: 15 * scale, height: 15 * scale }]}
            >
              <Icon name="check" color="white" size={8 * scale} />
            </View>
          </View>
          <Text style={[styles.date, { fontSize: 12 * scale }]}>
            {`1.6M · ` + formatDate(video.snippet.publishedAt)}
          </Text>
        </View>
        <PopupComp opacity={showPopoverTrigger ? 1 : 0} />
      </View>
      {showButtons ? <BottomButtonsComp /> : null}
    </View>
  );
};
