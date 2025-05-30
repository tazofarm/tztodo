package com.tztodo.app;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

public class MyForegroundService extends Service {

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("MyForegroundService", "서비스 생성됨");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("MyForegroundService", "서비스 시작됨");
        // 여기에 필요한 작업 로직 추가
        return START_NOT_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        Log.d("MyForegroundService", "서비스 종료됨");
        super.onDestroy();
    }
}