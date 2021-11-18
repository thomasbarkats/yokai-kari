package com.thomasbarkats.mapstp;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.thomasbarkats.mapstp.model.WSUtils;
import com.thomasbarkats.mapstp.model.beans.CaptureBean;
import com.thomasbarkats.mapstp.model.beans.SpawnBean;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private Button captureBtn;
    private List<SpawnBean> spawns = new ArrayList();
    private List<SpawnBean> nearbySpawns = new ArrayList();

    boolean stopThread = false;
    Thread thread;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        captureBtn = findViewById(R.id.btn_capture);

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                    MapsActivity.this,
                    new String[] { Manifest.permission.ACCESS_FINE_LOCATION },
                    5);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        stopThread = true;
    }

    @Override
    protected void onStart() {
        super.onStart();
        startThread();
    }

    private void startThread(){
        stopThread = false;
        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                while(!stopThread) {
                    // get user's location
                    Location location = getLastKnownLocation();

                    if (location != null) {
                        try {
                            // update user's location
                            nearbySpawns = WSUtils.updateLocation(location.getLongitude(), location.getLatitude());
                            Log.w("sp_test", nearbySpawns.toString());
                            // re-generate spawns
                            spawns = WSUtils.generateSpawns();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        refreshMap(new LatLng(location.getLatitude(), location.getLongitude()));
                    }
                    SystemClock.sleep(1500);
                }
            }
        });
        thread.start();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
        ) {
            Toast.makeText(this, "Permission required!", Toast.LENGTH_SHORT).show();
        }
        refreshMap(null);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        Location location = getLastKnownLocation();
        if (location == null) {
            Toast.makeText(this, "Please enable location!", Toast.LENGTH_SHORT).show();
        }
        refreshMap(new LatLng(location.getLatitude(), location.getLongitude()));
    }

    public void onClickCaptureBtn(View view) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    List<CaptureBean> captures = WSUtils.captureNearbySpawns();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                refreshMap(null);
            }
        }).start();
    }

    private void refreshMap(@Nullable  LatLng newLocation){
        if(mMap == null) {
            return;
        }
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (ContextCompat.checkSelfPermission(MapsActivity.this,
                        Manifest.permission.ACCESS_FINE_LOCATION)
                        == PackageManager.PERMISSION_GRANTED) {
                    mMap.setMyLocationEnabled(true);
                }

                mMap.clear();

                if (nearbySpawns.size() > 0) {
                    captureBtn.setVisibility(View.VISIBLE);
                    captureBtn.setText("Capture " + nearbySpawns.get(0).getYokai().getName());
                } else {
                    captureBtn.setVisibility(View.INVISIBLE);
                }

                // display spawns points
                for (SpawnBean spawn : spawns) {
                    MarkerOptions markerOptions = new MarkerOptions();
                    markerOptions.position(new LatLng(
                            spawn.getLocation().getLat(),
                            spawn.getLocation().getLon()));
                    markerOptions.title(spawn.getYokai().getName());
                    if (spawn.getYokai().getValue() > 20) {
                        markerOptions.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_ORANGE));
                    } else if (spawn.getYokai().getValue() > 50) {
                        markerOptions.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_YELLOW));
                    } else {
                        markerOptions.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE));
                    }
                    mMap.addMarker(markerOptions);
                }

                if (newLocation != null) {
                    mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(newLocation, 18.5F));
                }
            }
        });
    }

    private Location getLastKnownLocation() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_DENIED) {
            return null;
        }
        LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        Location bestLocation = null;

        for (String provider : lm.getProviders(true)) {
            Location l = lm.getLastKnownLocation(provider);
            if (l != null && (bestLocation == null || l.getAccuracy() < bestLocation.getAccuracy()))
                bestLocation = l;
        }
        return bestLocation;
    }
}