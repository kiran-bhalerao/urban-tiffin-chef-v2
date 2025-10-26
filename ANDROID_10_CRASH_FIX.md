# Android 10 Crash Fix Guide

## Problem
App was crashing on Android 10 with the following error:
```
android.view.InflateException: Binary XML file line #28 in com.urbantiffinchef.app:layout/splash_screen_view: 
Failed to resolve attribute at index 0
```

**Root Cause:** Expo's newer splash screen library generates resources for Android 12+ (API 31+) by default. When these resources are used on Android 10 (API 29), they fail to inflate, causing the app to crash immediately on launch.

## Solution

### Step 1: Conditionally Load SplashScreen API

**File:** `android/app/src/main/java/com/anonymous/urbantiffinchef/MainActivity.kt`

Wrap the SplashScreen initialization with an Android version check:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    // Only load the latest SplashScreen API on Android 12+
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      SplashScreenManager.registerOnActivity(this)
    }
    super.onCreate(savedInstanceState)
}
```

### Step 2: Update Splash Screen Drawable

**File:** `android/app/src/main/res/drawable/splashscreen.xml`

Update to include the splash image for older Android versions:

```xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/splashscreen_background"/>
  <item>
    <bitmap
      android:gravity="center"
      android:src="@drawable/splashscreen_image"/>
  </item>
</layer-list>
```

### Step 3: Update Base Styles

**File:** `android/app/src/main/res/values/styles.xml`

Update the splash screen theme:

```xml
<style name="Theme.App.SplashScreen" parent="AppTheme">
  <item name="android:windowBackground">@drawable/splashscreen</item>
  <item name="android:windowDrawsSystemBarBackgrounds">true</item>
</style>
```

### Step 4: Create Android 12+ Specific Styles

**File:** `android/app/src/main/res/values-v31/styles.xml` (create new file)

Add Android 12+ specific splash screen configuration:

```xml
<resources>
  <style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="android:windowSplashScreenBackground">@color/splashscreen_background</item>
    <item name="android:windowSplashScreenAnimatedIcon">@drawable/splashscreen_image</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
  </style>
</resources>
```

### Step 5: Disable Edge-to-Edge (Optional)

**File:** `app.json`

Set edge-to-edge to false for compatibility:

```json
"android": {
  "edgeToEdgeEnabled": false,
  "package": "com.urbantiffinchef.app"
}
```

**File:** `android/gradle.properties`

```properties
expo.edgeToEdgeEnabled=false
```

## How It Works

- **Android 10 and below:** Uses the traditional splash screen with the drawable resources
- **Android 12 and above:** Uses the modern SplashScreen API with proper animations and transitions

This approach ensures backward compatibility while leveraging newer features on supported devices.

## Testing

After making these changes, rebuild the app:

```bash
cd android && ./gradlew clean
cd ..
yarn android
```

The app should now launch successfully on Android 10 without crashes.
