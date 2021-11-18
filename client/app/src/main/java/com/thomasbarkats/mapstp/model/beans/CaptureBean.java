package com.thomasbarkats.mapstp.model.beans;

import java.util.Date;
import java.util.List;

public class CaptureBean {
    private YokaiBean yokai;
    private Integer number;
    private List<String> dates;
    private List<PointBean> locations;

    public CaptureBean(YokaiBean yokai, Integer number, List<String> dates, List<PointBean> locations) {
        this.yokai = yokai;
        this.number = number;
        this.dates = dates;
        this.locations = locations;
    }

    public YokaiBean getYokai() {
        return yokai;
    }
}
