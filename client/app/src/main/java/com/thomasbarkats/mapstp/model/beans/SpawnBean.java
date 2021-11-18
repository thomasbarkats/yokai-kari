package com.thomasbarkats.mapstp.model.beans;

public class SpawnBean {
    private String date;
    private PointBean location;
    private YokaiBean yokai;

    public PointBean getLocation() {
        return location;
    }

    public YokaiBean getYokai() {
        return yokai;
    }
}
