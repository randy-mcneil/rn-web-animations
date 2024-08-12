import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  type CellRendererProps,
  ListRenderItem,
  Text,
} from "react-native";
import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Video, searchSnippets } from "../services/youtube";
import {
  EmptyCard,
  VideoCard,
  VideoCardSkeleton,
} from "../components/video-card/video-card";
import { usePopupStore } from "../stores/popup-store";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  flatList: {
    backgroundColor: "white",
    flex: 1,
    padding: 20,
  },
  flatListFooterContainer: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    color: "black",
  },
});

const useSnippetsQuery = () => {
  const fetchSnippets = async ({ pageParam }: { pageParam?: string }) => {
    const result = await searchSnippets(
      pageParam ? { pageToken: pageParam } : {}
    );
    return result;
  };

  return useInfiniteQuery({
    queryKey: ["snippets"],
    queryFn: fetchSnippets,
    getNextPageParam: (lastPage, pages) => lastPage.nextPageToken,
  });
};

type Item = Video | "skeleton" | "empty";

/**
 * Define CellRendererComponent for zIndex
 * @param
 * @returns
 */
const CellRendererComponent = ({
  index,
  style,
  item,
  ...props
}: CellRendererProps<Item>) => {
  const currentVideo = usePopupStore((state) => state.currentVideo);
  const items = Array.isArray(item) ? (item as unknown as Item[]) : [item];

  const cellStyle = [
    style,
    {
      zIndex: items.some(
        (item) => typeof item === "object" && item.id.videoId === currentVideo
      )
        ? 100
        : 0,
    },
  ];
  return <View style={cellStyle} {...props} />;
};

const FooterComponent = ({
  query,
}: {
  query: UseInfiniteQueryResult<unknown>;
}) => {
  const { isFetchingNextPage } = query;
  if (isFetchingNextPage) {
    return (
      <View style={styles.flatListFooterContainer}>
        <Text>Loading</Text>
      </View>
    );
  }
};

const renderItem: ListRenderItem<Item> = ({ item, index }) => {
  return item === "skeleton" ? (
    <VideoCardSkeleton key={index} />
  ) : item === "empty" ? (
    <EmptyCard key={index} />
  ) : (
    <VideoCard key={index} video={item} />
  );
};

const Home = () => {
  const query = useSnippetsQuery();
  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    /**
     * Actually the error does not work well with infiniteQuery, so leave this
     */
    // isError,
    // error,
    isFetching,
  } = query;
  const { width } = useWindowDimensions();

  const numColumns = React.useMemo(() => {
    return width > 1200 ? 4 : width > 800 ? 3 : width > 600 ? 2 : 1;
  }, [width]);

  const loadingItems = React.useMemo(() => {
    return Array(numColumns * 2).fill("skeleton");
  }, [numColumns]);

  const flatListData = React.useMemo(() => {
    const items: Item[] = (data?.pages ?? [])
      .filter((page) => Array.isArray(page.items))
      .flatMap((page) => page.items);
    const remainder = items.length % numColumns;
    // Trick: Add empty view components to render nice
    if (remainder > 0) {
      items.push(...Array(numColumns - remainder).fill("empty"));
    }
    return items;
  }, [data?.pages, numColumns]);

  return (
    <View style={styles.container}>
      <FlatList<Item>
        style={styles.flatList}
        numColumns={numColumns}
        data={isLoading ? loadingItems : flatListData}
        key={numColumns}
        keyExtractor={(item, index) =>
          typeof item == "object" ? item.id.videoId : `${item}-${index}`
        }
        renderItem={renderItem}
        CellRendererComponent={CellRendererComponent}
        onEndReached={() => {
          if (!isFetchingNextPage && !isFetching) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={() => <FooterComponent query={query} />}
      />
    </View>
  );
};

export default Home;
