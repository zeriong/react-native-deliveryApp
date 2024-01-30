package com.zeriong.fooddeliveryapp;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.skt.Tmap.TMapTapi;
import org.jetbrains.annotations.NotNull;
import java.util.HashMap;

public class TMapModule extends ReactContextBaseJavaModule {
    TMapModule(ReactApplicationContext context) {
        super(context);
        // 모듈 로딩 시 실행되는 부분
        TMapTapi tMapTapi = new TMapTapi(context);
        tMapTapi.setSKTMapAuthentication("ZNxURhWnfZaPa5cSHLQXo4DJryAN6fCr9InBFLLe"); // API APP KEY
    }

    @NotNull
    @Override
    public String getName() {
        return "TMap";
    }

    @ReactMethod
    public void openNavi(String name, String longitude, String latitude, String vehicle, Promise promise) {
        TMapTapi tMapTapi = new TMapTapi(getReactApplicationContext());
        boolean isTMapApp = tMapTapi.isTmapApplicationInstalled(); // TMap 앱이 설치되어있는지 체크
        if (isTMapApp) { // 설치 되어있다면 실행 후 config 적용
            HashMap pathInfo = new HashMap();
            pathInfo.put("rGoName", name);
            pathInfo.put("rGoX", longitude);
            pathInfo.put("rGoY", latitude);
            pathInfo.put("rSOpt", vehicle.equals("MOTORCYCLE") ? "6" : "0"); // vehicle.equals("MOTORCYCLE"): 오토바이 주행가능 경로로 안내
            boolean result = tMapTapi.invokeRoute(pathInfo);
            if (result) {
                promise.resolve(true);
            } else {
                promise.resolve(true);
            }
        } else {
            promise.resolve(false);
        }
    }
}