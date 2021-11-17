package com.thomasbarkats.mapstp.model;

import com.google.gson.Gson;
import com.thomasbarkats.mapstp.HttpUtils;
import com.thomasbarkats.mapstp.model.beans.CaptureBean;
import com.thomasbarkats.mapstp.model.beans.SpawnBean;
import com.thomasbarkats.mapstp.model.beans.ListRequestBean;

import java.util.List;

public class WSUtils {

    private static final String URL_SERVER = "http://yokai-kari-api.thomasb.me";
    private static final String MOCK_TOKEN = "xxx";
    private static final String MOCK_USERNAME = "thomasbarkats";

    public static List<SpawnBean> updateLocation(Float lon, Float lat) throws Exception {
        final String url = URL_SERVER + "/users/" + MOCK_USERNAME + "/location";
        String strLon = lon.toString();
        String strLat = lat.toString();

        String jsonRes = HttpUtils.HTTP_PUT(url + "?lon=" + strLon + "&lat=" + strLat, MOCK_TOKEN, null);
        ListRequestBean<SpawnBean> request = new Gson().fromJson(jsonRes, ListRequestBean.class);
        return request.getData();
    }

    public static List<SpawnBean> generateSpawns() throws Exception {
        final String url = URL_SERVER + "/users/" + MOCK_USERNAME + "/spawns";
        String jsonRes = HttpUtils.HTTP_GET(url, MOCK_TOKEN);
        ListRequestBean<SpawnBean> request = new Gson().fromJson(jsonRes, ListRequestBean.class);
        return request.getData();
    }

    public static List<CaptureBean> captureNearbySpawns() throws Exception {
        final String url = URL_SERVER + "/users/" + MOCK_USERNAME + "/bestiary";
        String jsonRes = HttpUtils.HTTP_PUT(url, MOCK_TOKEN, null);
        ListRequestBean<CaptureBean> request = new Gson().fromJson(jsonRes, ListRequestBean.class);
        return request.getData();
    }
}
