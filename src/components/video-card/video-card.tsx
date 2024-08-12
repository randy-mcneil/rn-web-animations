import { useEffect, useRef, useState } from "react";

import { Animated, Dimensions, Easing, Pressable, View } from "react-native";
import styles from "./styles";

import { type Video } from "../../services/youtube";
import { usePopupStore } from "../../stores/popup-store";
import { CardBottomComp, ThumbnailComp } from "./comps";

interface VideoCardProps {
  video: Video;
}

const VideoCardContent = ({
  video,
  onThumbnailHoverIn,
  onThumbnailHoverOut,
}: VideoCardProps & {
  onThumbnailHoverIn: () => void;
  onThumbnailHoverOut: () => void;
}) => {
  const onBottomHoverIn = () => {
    setShowBottomDots(true);
  };

  const onBottomHoverOut = () => {
    setShowBottomDots(false);
  };

  const [isThumbnailHovered, setThumbnailHovered] = useState(false);

  const _onThumbnailHoverIn = () => {
    setShowBottomDots(true);
    // No need to do for the same video again
    if (usePopupStore.getState().currentVideo === video.id.videoId) {
      return;
    }
    setThumbnailHovered(true);
    usePopupStore.setState({ currentVideo: video.id.videoId });
    onThumbnailHoverIn();
  };

  const _onThumbnailHoverOut = () => {
    setThumbnailHovered(false);
    onThumbnailHoverOut();
  };

  const [showBottomDots, setShowBottomDots] = useState(false);
  return (
    <View style={styles.flex}>
      <Pressable
        onHoverIn={_onThumbnailHoverIn}
        onHoverOut={_onThumbnailHoverOut}
      >
        <ThumbnailComp
          rounded
          uri={video.snippet.thumbnails.default.url}
          badge={isThumbnailHovered ? "Keep hovering to play" : "4:30"}
        />
      </Pressable>
      <Pressable onHoverIn={onBottomHoverIn} onHoverOut={onBottomHoverOut}>
        <CardBottomComp video={video} showPopoverTrigger={showBottomDots} />
      </Pressable>
    </View>
  );
};

const VideoCardOverlay = ({
  video,
  onAnimationFinish,
  transformOrigin,
}: VideoCardProps & {
  onAnimationFinish: () => void;
  transformOrigin: string;
}) => {
  const hideTimer = useRef<number>();
  const animate = useRef(new Animated.Value(0)).current;
  const scaleInterpolate = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const fadeInterpolate = animate.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });

  const animateBack = () => {
    Animated.timing(animate, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onAnimationFinish();
    });
  };

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = undefined;
    }
  };

  // when component is unmounted, clear hide timer.
  useEffect(() => {
    // Start the scaling animation
    Animated.timing(animate, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
    // After 5 seconds, animateBack
    hideTimer.current = window.setTimeout(animateBack, 5000);
    return () => {
      clearHideTimer();
    };
  }, []);

  const onHoverOut = () => {
    animateBack();
    clearHideTimer();
  };

  const animationStyle = {
    transform: [
      {
        scale: scaleInterpolate,
      },
    ],
    opacity: fadeInterpolate,
  };

  return (
    <View style={styles.cardOverlayContainer}>
      <Animated.View style={[{ transformOrigin }, animationStyle]}>
        <Pressable onHoverOut={onHoverOut}>
          <View style={styles.cardOverlayInnerContainer}>
            <ThumbnailComp
              uri={video.snippet.thumbnails.default.url}
              badge={"4:30"}
            />
            <CardBottomComp
              video={video}
              showPopoverTrigger
              showButtons
              scale={0.85}
            />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export const VideoCard = ({ video }: VideoCardProps) => {
  const [showOverLay, setShowOverLay] = useState(false);
  const [overlayTransformOrigin, setOverlayTransformOrigin] =
    useState("center");
  const triggerTimer = useRef<number>();
  const hideTimer = useRef<number>();
  const currentVideo = usePopupStore((state) => state.currentVideo);
  const cardViewRef = useRef<View>(null);

  const clearTriggerTimer = () => {
    if (triggerTimer.current) {
      clearTimeout(triggerTimer.current);
      triggerTimer.current = undefined;
    }
  };

  const onThumbnailHoverIn = () => {
    // Measure the current position to determine the overlay transform origin
    cardViewRef?.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get("window").width;
      if (x < 50) {
        setOverlayTransformOrigin("5% 20%");
      } else if (x + width + 50 >= windowWidth) {
        setOverlayTransformOrigin(`95% 20%`);
      } else {
        setOverlayTransformOrigin("50% 20%");
      }

      // Trigger overlay show after 1 seconds`
      triggerTimer.current = window.setTimeout(() => {
        setShowOverLay(true);
        // clear out trigger timer
        triggerTimer.current = undefined;
        hideTimer.current = window.setTimeout(() => {});
      }, 1000);
    });
  };

  const onThumbnailHoverOut = () => {
    clearTriggerTimer();
  };

  useEffect(() => {
    if (video.id.videoId !== currentVideo) {
      setShowOverLay(false);
      clearTriggerTimer();
    }
  }, [currentVideo]);

  // when video changes, clear out the scheduled overlay show timer
  useEffect(() => {
    return () => {
      setShowOverLay(false);
      clearTriggerTimer();
    };
  }, [video]);

  return (
    <View
      style={[
        styles.cardContainer,
        { zIndex: video.id.videoId === currentVideo ? 100 : 0 },
      ]}
      ref={cardViewRef}
    >
      <VideoCardContent
        video={video}
        onThumbnailHoverIn={onThumbnailHoverIn}
        onThumbnailHoverOut={onThumbnailHoverOut}
      />
      {showOverLay && (
        <VideoCardOverlay
          video={video}
          onAnimationFinish={() => setShowOverLay(false)}
          transformOrigin={overlayTransformOrigin}
        />
      )}
    </View>
  );
};

export const VideoCardSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      <View
        style={[styles.thumbnail, styles.skeletonBg, styles.borderRounded10]}
      />
      <View style={styles.descriptionContainer}>
        <View style={styles.avatar} />
        <View style={[styles.flex, styles.gap8]}>
          <View style={[styles.skeletonBg, styles.skeletonTitle]} />
          <View style={[styles.skeletonBg, styles.skeletonDescription]} />
        </View>
      </View>
    </View>
  );
};

export const EmptyCard = () => {
  return <View style={styles.flex} />;
};
