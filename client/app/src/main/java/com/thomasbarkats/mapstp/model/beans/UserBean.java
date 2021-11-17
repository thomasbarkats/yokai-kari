package com.thomasbarkats.mapstp.model.beans;

import java.util.Date;

public class UserBean {
    private String email;
    private String username;
    private Date date;
    private Float score;

    public UserBean(String email, String username, Date date, Float score) {
        this.email = email;
        this.username = username;
        this.date = date;
        this.score = score;
    }
}
