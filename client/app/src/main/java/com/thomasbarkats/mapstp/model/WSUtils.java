package com.thomasbarkats.mapstp.model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.thomasbarkats.mapstp.HttpUtils;
import com.thomasbarkats.mapstp.model.beans.CaptureBean;
import com.thomasbarkats.mapstp.model.beans.SpawnBean;

import java.lang.reflect.Type;
import java.util.List;
import java.util.TreeMap;

public class WSUtils {

    private static final String URL_SERVER = "http://yokai-kari-api.thomasb.me";
    private static final String MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjk0Zjk5ZGY1ZjkzNDlmNzQ4NTBjOCIsImF1dGhLZXkiOiJYQzQ5TTBIRHNGMDBmeEd6IiwiaWF0IjoxNjM3MjI3OTY1fQ.8jjxuZV01typvllnloJsw6H3IOeXMxmgnSjaXviLsjY";
    private static final String MOCK_USERNAME = "thomasbarkats";

    public static List<SpawnBean> updateLocation(double lon, double lat) throws Exception {
        final String url = URL_SERVER + "/users/" + MOCK_USERNAME + "/location";
        String strLon = Double.toString(lon);
        String strLat = Double.toString(lat);

        String jsonRes = HttpUtils.HTTP_PUT(url + "?lon=" + strLon + "&lat=" + strLat,
                MOCK_TOKEN, new TreeMap<>());
        Type collectionType = new TypeToken<List<SpawnBean>>(){}.getType();
        return new Gson().fromJson(jsonRes, collectionType);
    }

    public static List<SpawnBean> generateSpawns() throws Exception {
        final String url = URL_SERVER + "/users/" + MOCK_USERNAME + "/spawns";
        String jsonRes = HttpUtils.HTTP_GET(url, MOCK_TOKEN);
        Type collectionType = new TypeToken<List<SpawnBean>>(){}.getType();
        return new Gson().fromJson(jsonRes, collectionType);
    }

    public static List<CaptureBean> captureNearbySpawns() throws Exception {
        final String url = URL_SERVER + "/users/" + MOCK_USERNAME + "/bestiary";
        String jsonRes = HttpUtils.HTTP_PUT(url, MOCK_TOKEN, new TreeMap<>());
        Type collectionType = new TypeToken<List<CaptureBean>>(){}.getType();
        return new Gson().fromJson(jsonRes, collectionType);
    }
}
