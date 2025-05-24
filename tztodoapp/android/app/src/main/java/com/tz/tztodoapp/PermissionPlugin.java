package com.tz.tztodoapp;

import android.app.Activity;
import android.provider.Settings;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
// 변경 전: 잘못된 경로였던 import
// import com.getcapacitor.annotation.PluginMethod;
import com.getcapacitor.PluginMethod; // ✅ 올바른 경로로 수정됨
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "PermissionPlugin")
public class PermissionPlugin extends Plugin {

    @PluginMethod
    public void requestBattery(PluginCall call) {
        Activity activity = getActivity();
        PermissionHelper.requestBatteryOptimization(activity);
        call.resolve();
    }

    @PluginMethod
    public void hasOverlayPermission(PluginCall call) {
        Activity activity = getActivity();
        boolean result = Settings.canDrawOverlays(activity);
        JSObject ret = new JSObject();
        ret.put("value", result);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestOverlay(PluginCall call) {
        Activity activity = getActivity();
        PermissionHelper.requestOverlayPermission(activity);
        call.resolve();
    }
}