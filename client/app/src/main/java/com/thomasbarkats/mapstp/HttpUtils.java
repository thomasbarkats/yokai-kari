package com.thomasbarkats.mapstp;

import android.util.Log;

import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HttpUtils {
    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    public static String HTTP_GET(String url, String token) throws Exception {
        return HttpUtils.call(url, "GET", token, null);
    }

    public static String HTTP_PUT(String url, String token, Map<String, String> params) throws Exception {
        return HttpUtils.call(url, "PUT", token, params);
    }

    public static String HTTP_POST(String url, Map<String, String> params, String token) throws Exception {
        return HttpUtils.call(url, "POST", token, params);
    }

    private static String call(
            String url,
            String method,
            String token,
            @Nullable Map<String, String> params
    ) throws Exception {
        Type gsonType = new TypeToken<Map>(){}.getType();

        RequestBody body = null;
        if (params != null) {
            body = RequestBody.create(JSON, new Gson().toJson(params, gsonType));
        }

        Log.w("tag", "url : " + url);
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(url)
                .method(method, body)
                .header("Authorization", "JWT " + token)
                .build();
        Response response = client.newCall(request).execute();
        if (response.code() < 200 || response.code() >= 300) {
            Log.w("test", response.message());
            throw new Exception("Server return following error: " + response.code());
        }
        else {
            return response.body().string();
        }
    }
}
