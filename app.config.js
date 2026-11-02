import 'dotenv/config';

export default {
  expo: {
    name: "RedintDating",
    slug: "RedintDating",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "redintdating",
    userInterfaceStyle: "automatic",
    androidStatusBar: {
      barStyle: "dark-content",
      translucent: true,
    },
    ios: {
      icon: "./assets/expo.icon",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "server",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
      "expo-secure-store",
      "expo-sharing",
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps._some_id_here_"
      },
      "expo-asset",
      [
        "expo-notifications",
        {
          icon: "./assets/images/blackliquidglassaerloticon.png",
          color: "#0A66C2",
          sounds: [],
          modes: ["alwaysSendAsAndroidManaged"],
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow Redint to access your photos to save images.",
          savePhotosPermission: "Allow Redint to save photos to your library.",
          granularPermissions: [],
        },
      ],
      "@react-native-community/datetimepicker",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
      "expo-mail-composer",
      "expo-secure-store",
      [
        "expo-audio",
        {
          microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
          enableBackgroundPlayback: true,
          enableBackgroundRecording: false
        }
      ],
      "expo-sqlite",
      "@howincodes/expo-dynamic-app-icon",
      "@react-native-firebase/app",
      "expo-web-browser",
      "expo-asset",
      "expo-image",
      "expo-sharing",
      "expo-sqlite",
      "expo-mail-composer",
      "expo-task-manager",
      "@react-native-firebase/auth",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};