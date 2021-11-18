package com.thomasbarkats.mapstp.model.beans;

public class PointBean {
    private double lon;
    private double lat;

    public PointBean(double lon, double lat) {
        this.lon = lon;
        this.lat = lat;
    }

    public double getLat() {
        return lat;
    }

    public double getLon() {
        return lon;
    }
}
