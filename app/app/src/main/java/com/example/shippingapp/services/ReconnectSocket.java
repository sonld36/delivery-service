package com.example.shippingapp.services;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class ReconnectSocket extends Worker {
    public ReconnectSocket(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        try {
            Thread.sleep(3000, 0);
        } catch (InterruptedException e) {
            Log.d("DO WORK", e.getMessage());
        }

        try {
            if (!SocketService.stompClient.isConnected()) {
                SocketService.stompClient.reconnect();
            }
            return Result.success();
        } catch (Throwable throwable) {
            Log.e("WORK", "Error applying blur", throwable);
            return Result.retry();
        }
    }
}
