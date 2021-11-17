package com.thomasbarkats.mapstp.model.beans;

public class YokaiBean {
    private String id;
    private String name;
    private String description;
    private Float occurrence;
    private Float value;

    public YokaiBean(String id, String name, String description, Float occurrence, Float value) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.occurrence = occurrence;
        this.value = value;
    }
}
