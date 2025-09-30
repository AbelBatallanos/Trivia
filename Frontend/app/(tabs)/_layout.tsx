import CustomTabBar from "@/components/navigation/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="join" />
      <Tabs.Screen name="editor" />
    </Tabs>
  );
};

export default TabsLayout;
