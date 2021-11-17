package com.thomasbarkats.mapstp.model.beans;

import java.util.List;

public class ListRequestBean<T> {
    private List<T> data;

    public List<T> getData() {
        return data;
    }
}
