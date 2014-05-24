package com.ok_lily_android_client.app;

import android.app.Activity;
import android.app.ListActivity;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothAdapter;
import android.content.Intent;
import android.os.Handler;
import android.content.Context;

import android.bluetooth.BluetoothDevice;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

/**
 * Created by stach on 5/24/14.
 */
public class BluetoothHandler {

    private final static String TAG     = BluetoothHandler.class.getSimpleName();
    private BluetoothManager mBluetoothManager;
    private BluetoothAdapter mBluetoothAdapter;
    private boolean mScanning;
    private static final int REQUEST_ENABLE_BT = 1;
    private ArrayList<BluetoothDevice> mLeDevices;
    private Handler mHandler;

    // Stops scanning after 10 seconds.
    private static final long SCAN_PERIOD = 3000;

    public BluetoothHandler(BluetoothAdapter adapter) {
        mBluetoothAdapter = adapter;
        mLeDevices        = new ArrayList<BluetoothDevice>();
        mHandler          = new Handler();
    }

    private void scanLeDevice(final boolean enable) {
        if (enable) {
/*            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    mScanning = false;
                    mBluetoothAdapter.stopLeScan(mLeScanCallback);
                }
            }, SCAN_PERIOD);
*/
            mScanning = true;
            mBluetoothAdapter.startLeScan(mLeScanCallback);
        } else {
            mScanning = false;
            mBluetoothAdapter.stopLeScan(mLeScanCallback);
        }
    }

    private void addDevice(BluetoothDevice device) {
        if(!mLeDevices.contains(device)) {
            mLeDevices.add(device);
        }
    }

    public BluetoothDevice getDevice(int position) {
        return mLeDevices.get(position);
    }

    public ArrayList<BluetoothDevice> getDevices() {
        return mLeDevices;
    }

    // Device scan callback.
    private BluetoothAdapter.LeScanCallback mLeScanCallback =
            new BluetoothAdapter.LeScanCallback() {

                @Override
                public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
                    Log.i("Device address", device.getAddress().toString());
                    addDevice(device);
                }
            };

    public void scanDevices() {
       scanLeDevice(true);
   }

    public void stopScan() {
        Log.i("Stop scan", "stopping scan");

        if (mScanning) {
            mBluetoothAdapter.stopLeScan(mLeScanCallback);
            mScanning = false;
        }
    }
}
