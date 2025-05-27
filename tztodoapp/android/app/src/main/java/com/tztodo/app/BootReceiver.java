package com.tztodo.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        Log.d("BootReceiver", "자동 실행 감지됨: " + action);

        // 부팅 완료 또는 잠금 해제 시 ForegroundService 실행
        if (Intent.ACTION_BOOT_COMPLETED.equals(action) ||
            Intent.ACTION_LOCKED_BOOT_COMPLETED.equals(action) ||
            Intent.ACTION_USER_PRESENT.equals(action)) {

            Intent serviceIntent = new Intent(context, MyForegroundService.class);

            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(serviceIntent);
                } else {
                    context.startService(serviceIntent);
                }
                Log.d("BootReceiver", "포그라운드 서비스 실행 시도됨");
            } catch (Exception e) {
                Log.e("BootReceiver", "서비스 실행 실패: " + e.getMessage());
            }
        }
    }
}