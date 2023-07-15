package com.example.shippingapp.dto;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class LoginRespDTO {

    public LoginRespDTO() {
    }

    public LoginRespDTO(String token, AccountRespDTO user) {
        this.token = token;
        this.user = user;
    }

    @SerializedName("token")
    @Expose
    private String token;

    @SerializedName("user")
    @Expose
    private AccountRespDTO user;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public AccountRespDTO getUser() {
        return user;
    }

    public void setUser(AccountRespDTO user) {
        this.user = user;
    }
}
