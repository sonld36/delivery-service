package com.example.shippingapp.common;

import android.location.Location;
import android.location.LocationListener;
import android.location.GpsStatus;
import android.os.Bundle;

import androidx.annotation.NonNull;

import java.util.List;

public interface IBaseGPS extends LocationListener, GpsStatus.Listener {
    @Override
    default void onLocationChanged(@NonNull List<Location> locations) {
        LocationListener.super.onLocationChanged(locations);
    }

    @Override
    default void onProviderDisabled(@NonNull String provider) {
        LocationListener.super.onProviderDisabled(provider);
    }

    @Override
    default void onProviderEnabled(@NonNull String provider) {
        LocationListener.super.onProviderEnabled(provider);
    }

    @Override
    default void onStatusChanged(String provider, int status, Bundle extras) {
        LocationListener.super.onStatusChanged(provider, status, extras);

    }

    @Override
    void onGpsStatusChanged(int event);
}
