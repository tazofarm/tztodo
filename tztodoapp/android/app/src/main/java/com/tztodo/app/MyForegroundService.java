package com.tztodo.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import com.tztodo.app.R;


public class MyForegroundService extends Service {

    private static final String CHANNEL_ID = "PLAYTODO_FOREGROUND_CHANNEL";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("playtodo 실행 중")
                .setContentText("자동 실행 중입니다")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build();
        startForeground(1, notification);

        // 1~2초 후 앱 실행 및 서비스 종료 → 안정성 확보
        new android.os.Handler().postDelayed(() -> {
            Intent i = getPackageManager().getLaunchIntentForPackage(getPackageName());
            if (i != null) {
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(i);
            }

            stopSelf();
        }, 1500); // 1.5초 지연
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "PlayToDo Foreground Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}