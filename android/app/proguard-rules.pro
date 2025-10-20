# Aggressive ProGuard rules for maximum size reduction
# React Native core - keep only essential classes
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.** { 
    public <methods>;
    public <fields>;
}
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.yoga.** { *; }

# Keep only essential Fresco classes
-keep class com.facebook.fresco.** { 
    public <methods>;
    public <fields>;
}
-keep class com.facebook.imagepipeline.** { 
    public <methods>;
    public <fields>;
}

# Expo modules - keep only essential
-keep class expo.modules.core.** { *; }
-keep class expo.modules.filesystem.** { *; }
-keep class expo.modules.documentpicker.** { *; }
-keep class expo.modules.asset.** { *; }

# React Native Screens - minimal keep
-keep class com.swmansion.rnscreens.** { 
    public <methods>;
    public <fields>;
}

# React Native Safe Area Context - minimal keep
-keep class com.th3rdwave.safeareacontext.** { 
    public <methods>;
    public <fields>;
}

# WebView - minimal keep
-keep class com.reactnativecommunity.webview.** { 
    public <methods>;
    public <fields>;
}

# React Native Reanimated - minimal keep
-keep class com.swmansion.reanimated.** { 
    public <methods>;
    public <fields>;
}
-keep class com.facebook.react.turbomodule.** { 
    public <methods>;
    public <fields>;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep Hermes - minimal
-keep class com.facebook.hermes.** { 
    public <methods>;
    public <fields>;
}

# Aggressive optimization
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 7
-allowaccessmodification
-dontpreverify
-dontwarn **

# Remove all logging
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Remove console logs
-assumenosideeffects class * {
    public static void log(...);
    public static void logd(...);
    public static void logi(...);
    public static void logw(...);
    public static void loge(...);
}

# Remove debug information
-assumenosideeffects class * {
    public static void println(...);
    public static void print(...);
}

# Remove React Native debug code
-assumenosideeffects class com.facebook.react.** {
    public static void log(...);
    public static void debug(...);
}

# Remove Expo debug code
-assumenosideeffects class expo.modules.** {
    public static void log(...);
    public static void debug(...);
}

# Keep only essential Android classes
-keep class android.** { 
    public <methods>;
    public <fields>;
}

# Remove unused resources
-dontwarn android.support.**
-dontwarn androidx.**
-dontwarn com.google.**
-dontwarn org.bouncycastle.**
-dontwarn org.conscrypt.**
-dontwarn org.openjsse.**