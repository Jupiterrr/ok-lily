package com.ok_lily_android_client.app;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Color;
import android.media.AudioManager;
import android.os.AsyncTask;
import android.os.IBinder;
import android.util.Log;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Iterator;

import android.net.wifi.WifiManager;
import android.net.wifi.WifiInfo;
import android.content.Context;

import org.json.*;

public class MainActivity extends Activity {
    private final static String TAG = MainActivity.class.getSimpleName();

    /**
     * @todo move settings out to some server with json config file or use UI
     */
    public static final String EXTRAS_DEVICE_NAME    = "DEVICE_NAME";
    public static final String EXTRAS_DEVICE_ADDRESS = "DEVICE_ADDRESS";
    public static final String WEBSERVER             = "ws://192.168.1.2:8080";
    private static final String DEVICE               = "00:07:80:78:F5:93";
    private static final Integer DEVICE_RSSI         = 65;

    private WebSocketClient mWebSocketClient;
    private TextView text;
    private String myID;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothManager mBluetoothManager;
    private BluetoothHandler mBluetoothHandler;
    private String mDeviceName;
    private String mDeviceAddress;
    private BluetoothLeService mBluetoothLeService;
    private View mView;

    //    private Handler mHandler;
    private static final int REQUEST_ENABLE_BT = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        text = (TextView)findViewById(R.id.text);

        final Intent intent = getIntent();
        mDeviceName = intent.getStringExtra(EXTRAS_DEVICE_NAME);
        mDeviceAddress = intent.getStringExtra(EXTRAS_DEVICE_ADDRESS);

        Intent gattServiceIntent = new Intent(this, BluetoothLeService.class);
        bindService(gattServiceIntent, mServiceConnection, BIND_AUTO_CREATE);

        if (mBluetoothManager == null) {
            mBluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
            if (mBluetoothManager == null) {
                Log.e(TAG, "Unable to initialize BluetoothManager.");
                return;
            }
        }
        mBluetoothAdapter = mBluetoothManager.getAdapter();
        if (mBluetoothAdapter == null) {
            Log.e(TAG, "Unable to obtain a BluetoothAdapter.");
            return;
        }

        mBluetoothHandler = new BluetoothHandler(mBluetoothAdapter);

        mView = this.findViewById(android.R.id.content);
    }

    private class BluetoothSearchTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            while (!checkDevices()) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            return null;
        }

        @Override
        protected void onPostExecute(String result) {

        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        Log.i(TAG, "start scan");

        BluetoothSearchTask task = new BluetoothSearchTask();
        task.execute();

        mBluetoothHandler.scanDevices();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unbindService(mServiceConnection);
        mBluetoothLeService = null;

        android.os.Process.killProcess(android.os.Process.myPid());
    }

    private boolean checkDevices() {
        Log.i(TAG, "Checking devices");

        HashMap<BluetoothDevice, Integer> devices = mBluetoothHandler.getDevices();
        Iterator iter = devices.entrySet().iterator();

        HashMap.Entry<BluetoothDevice, Integer> pairs;
        Log.i(TAG, "Checking devices Size " + devices.size());

        while (iter.hasNext()) {
            pairs = (HashMap.Entry)iter.next();

            if (pairs.getKey().getAddress().contains(DEVICE))
            {
                Log.i(TAG, "RSSI value is" + pairs.getValue().toString());

                if (pairs.getValue() < DEVICE_RSSI){
                    mBluetoothHandler.stopScan();
                    Log.i(TAG, "Stop scan on Device" + pairs.getKey().toString());
                    Log.i(TAG, "RSSI value is" + pairs.getValue().toString());
                    connectWebSocket();
                    return true;
                }
            }
        }

        return false;
    }

    // Code to manage Service lifecycle.
    private final ServiceConnection mServiceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mBluetoothLeService = ((BluetoothLeService.LocalBinder) service).getService();
            if (!mBluetoothLeService.initialize()) {
                Log.i(TAG, "Unable to initialize Bluetooth");
                finish();
            }
            // Automatically connects to the device upon successful start-up initialization.
            mBluetoothLeService.connect(mDeviceAddress);
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mBluetoothLeService = null;
        }
    };

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        switch (item.getItemId()) {
            case R.id.action_settings:
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void connectWebSocket() {
        URI uri;
        try {
            uri = new URI(WEBSERVER);
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return;
        }

        /**
         * @todo move out to own handler
         */
        mWebSocketClient = new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake serverHandshake) {
                Log.i("Websocket", "Opened");
                WifiManager manager = (WifiManager) getSystemService(Context.WIFI_SERVICE);
                WifiInfo info       = manager.getConnectionInfo();
                String address      = info.getMacAddress();

                JSONObject object = new JSONObject();
                try {
                    object.put("command", "hello");
                    object.put("payload", "{ ownerHint: android-" + address + "}");
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                mWebSocketClient.send(object.toString());
            }

            @Override
            public void onMessage(String s) {
                final String message = s;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.i("Websocket", "Message" + message);
                        text.setText(message);

                        try {
                            JSONObject object = (JSONObject) new JSONTokener(message).nextValue();
                            String query = object.getString("command");

                            if (query.contains("hello_ack")) {
                                String senderID = object.getString("payload");
                                myID = senderID;

                                Log.i(TAG, "My ID" + myID);

                                JSONObject cmd2 = new JSONObject();
                                try {
                                    cmd2.put("command", "all_available");
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }

                                mWebSocketClient.send(cmd2.toString());
                            }

                            if (query.contains("mute_mobile_devices")){
                                AudioManager amanager=(AudioManager)getSystemService(Context.AUDIO_SERVICE);
                                amanager.setStreamMute(AudioManager.STREAM_NOTIFICATION, true);
                                amanager.setStreamMute(AudioManager.STREAM_ALARM, true);
                                amanager.setStreamMute(AudioManager.STREAM_MUSIC, true);
                                amanager.setStreamMute(AudioManager.STREAM_RING, true);
                                amanager.setStreamMute(AudioManager.STREAM_SYSTEM, true);
                                mView.setBackgroundColor(Color.RED);
                            }

                            if (query.contains("unmute_mobile_devices")){
                                AudioManager amanager=(AudioManager)getSystemService(Context.AUDIO_SERVICE);
                                amanager.setStreamMute(AudioManager.STREAM_NOTIFICATION, false);
                                amanager.setStreamMute(AudioManager.STREAM_ALARM, false);
                                amanager.setStreamMute(AudioManager.STREAM_MUSIC, false);
                                amanager.setStreamMute(AudioManager.STREAM_RING, false);
                                amanager.setStreamMute(AudioManager.STREAM_SYSTEM, false);
                                mView.setBackgroundColor(Color.WHITE);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }

            @Override
            public void onClose(int i, String s, boolean b) {
                Log.i("Websocket", "Closed " + s);
                text.setText("Connection closed");
            }

            @Override
            public void onError(Exception e) {
                Log.i("Websocket", "Error " + e.getMessage());
                text.setText("Connection error" + e.getMessage());
            }
        };
        mWebSocketClient.connect();
    }

    public void sendMessage() {
        mWebSocketClient.send("Hello");
    }
}
