package com.example.shippingapp.dto;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Date;



public class AccountRespDTO implements Serializable {

    @SerializedName("id")
    @Expose
    private Long id;

    @SerializedName("username")
    @Expose
    private String username;
    @SerializedName("phoneNumber")
    @Expose
    private String phoneNumber;

    @SerializedName("name")
    @Expose
    private String name;


    public AccountRespDTO() {
    }

    private Date createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getPathAvatar() {
        return pathAvatar;
    }

    public void setPathAvatar(String pathAvatar) {
        this.pathAvatar = pathAvatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    private String pathAvatar;

    private String role;
}
