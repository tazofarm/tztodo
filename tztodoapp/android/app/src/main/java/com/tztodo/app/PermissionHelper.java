// PermissionHelper.java
package com.tztodo.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.PowerManager;
import android.provider.Settings;

public class PermissionHelper {

    public static void requestBatteryOptimization(Activity activity) {
        String packageName = activity.getPackageName();
        PowerManager pm = (PowerManager) activity.getSystemService(Context.POWER_SERVICE);
        if (!pm.isIgnoringBatteryOptimizations(packageName)) {
            Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + packageName));
            activity.startActivity(intent);
        }
    }

    public static void requestOverlayPermission(Activity activity) {
        if (!Settings.canDrawOverlays(activity)) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + activity.getPackageName()));
            activity.startActivity(intent);
        }
    }
}