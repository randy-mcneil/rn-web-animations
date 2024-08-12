import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  menu: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    marginHorizontal: 10,
    gap: 10,
  },
  thumbnailBadge: {
    backgroundColor: "black",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    position: "absolute",
    bottom: 5,
    right: 0,
    fontSize: 12,
    color: "white",
  },
  channel: {
    fontSize: 15,
    color: "#777",
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
    marginTop: 5,
  },
  check: {
    width: 15,
    height: 15,
    borderRadius: 999,
    backgroundColor: "#777",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardContainer: {
    margin: 8,
    flex: 1,
  },
  thumbnail: {
    aspectRatio: 16 / 9,
    objectFit: "cover",
  },
  cardBottomContainer: {
    gap: 8,
    marginBottom: 5,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    gap: 8,
  },
  bottomButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    backgroundColor: "#eee",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 10,
    minWidth: 140,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 999,
    backgroundColor: "#eeeeee",
    marginRight: 10,
  },
  flex: {
    flex: 1,
  },
  cardOverlayContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
  },
  cardOverlayInnerContainer: {
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 5, height: 5 },
  },
  skeletonBg: {
    backgroundColor: "#eeeeee",
  },
  borderRounded10: {
    borderRadius: 10,
  },
  borderRounded: {
    borderRadius: 9999,
  },
  skeletonTitle: {
    width: "70%",
    height: 18,
  },
  skeletonDescription: {
    width: "50%",
    height: 16,
  },
  gap8: {
    gap: 8,
  },
});

export default styles;
