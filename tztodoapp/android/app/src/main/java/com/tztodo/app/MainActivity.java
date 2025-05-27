package com.tztodo.app;

import com.getcapacitor.BridgeActivity;
import com.tztodo.app.PermissionPlugin; // 추가

import android.os.Bundle;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.net.Uri;
import android.content.Intent;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(PermissionPlugin.class); // ✅ 여기에 추가

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = getPackageName();
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName)); // ✅ 여기에 사용
                startActivity(intent);
            }
        }
    }
}
