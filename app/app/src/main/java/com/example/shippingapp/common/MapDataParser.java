package com.example.shippingapp.common;

import com.google.android.gms.maps.model.LatLng;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class MapDataParser {
    public static List<List<HashMap<String,String>>> parse(JsonObject jsonObject) {
        List<List<HashMap<String, String>>> routes = new ArrayList<>();

        JsonArray jRoutes;
        JsonArray jLegs;
        JsonArray jSteps;


        jRoutes = jsonObject.getAsJsonArray("routes");
        for (int i = 0; i < jRoutes.size(); i++) {
            jLegs = ((JsonObject) jRoutes.get(i)).getAsJsonArray("legs");
            List path = new ArrayList();
            for (int j = 0; j < jLegs.size(); j++) {
                jSteps = ( (JsonObject)jLegs.get(j)).getAsJsonArray("steps");

                for (int k = 0; k < jSteps.size(); k++) {
                    JsonArray longlat= ((JsonObject) ((JsonObject) jSteps.get(k)).get("geometry")).getAsJsonArray("coordinates");
                    for (int l = 0; l < longlat.size(); l++) {
                        HashMap<String, String> hm = new HashMap<>();
                        hm.put("lat", Double.toString((longlat.get(l)).getAsJsonArray().get(1).getAsDouble()) );
                        hm.put("lng", Double.toString((longlat.get(l)).getAsJsonArray().get(0).getAsDouble()) );
                        path.add(hm);
                    }
                }
                routes.add(path);
            }
        }

        return routes;
    }

    private static List<LatLng> decodePoly(String encoded) {
        List<LatLng> poly = new ArrayList<>();
        int index = 0, len = encoded.length();
        int lat = 0, lng = 0;
        while (index < len) {
            int b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            LatLng p = new LatLng((((double) lat / 1E5)),
                    (((double) lng / 1E5)));
            poly.add(p);
        }
        return poly;
    }
}
