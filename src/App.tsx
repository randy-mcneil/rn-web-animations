import * as React from "react";
import Home from "./screens/home";
// import NetInfo from "@react-native-community/netinfo";
import { MenuProvider } from "react-native-popup-menu";

import {
  QueryClient,
  QueryClientProvider,
  // onlineManager,
} from "@tanstack/react-query";

// onlineManager.setEventListener((setOnline) => {
//   return NetInfo.addEventListener((state) => {
//     setOnline(!!state.isConnected);
//   });
// });

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MenuProvider>
        <Home />
      </MenuProvider>
    </QueryClientProvider>
  );
}
