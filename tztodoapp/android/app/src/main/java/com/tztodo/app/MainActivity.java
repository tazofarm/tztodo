package com.tztodo.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.admob.AdMob;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ✅ 최신 방식으로 AdMob 플러그인 등록
        this.registerPlugin(AdMob.class);
    }
}