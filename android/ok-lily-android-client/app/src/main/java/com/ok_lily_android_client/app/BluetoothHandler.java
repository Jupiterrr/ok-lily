package com.ok_lily_android_client.app;

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

    private final static String TAG = BluetoothHandler.class.getSimpleName();
    private BluetoothManager mBluetoothManager;
    private BluetoothAdapter mBluetoothAdapter;
    private boolean mScanning;
    private Handler mHandler;
    private static final int REQUEST_ENABLE_BT = 1;

//    private LeDeviceListAdapter mLeDeviceListAdapter;

    // Stops scanning after 10 seconds.
    private static final long SCAN_PERIOD = 10000;

    public BluetoothHandler(BluetoothAdapter adapter, BluetoothManager btmanager, Handler handler) {
        mBluetoothAdapter = adapter;
//        mBluetoothManager = btmanager;
//        mHandler          = handler;
    }

    private void scanLeDevice(final boolean enable) {
        if (enable) {
            mScanning = true;
            mBluetoothAdapter.startLeScan(mLeScanCallback);
        } else {
            mScanning = false;
            mBluetoothAdapter.stopLeScan(mLeScanCallback);
        }
    }

    // Device scan callback.
    private BluetoothAdapter.LeScanCallback mLeScanCallback =
            new BluetoothAdapter.LeScanCallback() {

                @Override
                public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            Log.i("Device", device.toString());
//                            mLeDeviceListAdapter.addDevice(device);
//                            mLeDeviceListAdapter.notifyDataSetChanged();
                        }
                    });
                }
            };

    /**
     * Initializes a reference to the local Bluetooth adapter.
     *
     * @return Return true if the initialization is successful.
     */
    public boolean initialize() {
        // Initializes a Bluetooth adapter.  For API level 18 and above, get a reference to
        // BluetoothAdapter through BluetoothManager.
//        final BluetoothManager bluetoothManager =
//                (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
//        mBluetoothAdapter = bluetoothManager.getAdapter();

        // Checks if Bluetooth is supported on the device.
//        if (mBluetoothAdapter == null) {
//            Toast.makeText(this, "Not supported", Toast.LENGTH_SHORT).show();
//            finish();
//            return false;
//        }

        return true;
    }

   public boolean initService(){
       // For API level 18 and above, get a reference to BluetoothAdapter through
       // BluetoothManager.
  //     if (mBluetoothManager == null) {
  //         mBluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
  //         if (mBluetoothManager == null) {
  //             Log.e(TAG, "Unable to initialize BluetoothManager.");
  //             return false;
  //         }
  //     }

/*       mBluetoothAdapter = mBluetoothManager.getAdapter();
       if (mBluetoothAdapter == null) {
           Log.e(TAG, "Unable to obtain a BluetoothAdapter.");
           return false;
       }
*/
       return true;
   }

   public void scanDevices() {
       scanLeDevice(true);
   }

   public void checkBLE() {
       // Ensures Bluetooth is enabled on the device.  If Bluetooth is not currently enabled,
       // fire an intent to display a dialog asking the user to grant permission to enable it.
//       if (!mBluetoothAdapter.isEnabled()) {
//           Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
//           startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
//       }

   }

   static class ViewHolder {
        //TextView deviceName;
        TextView deviceAddress;
    }
}
