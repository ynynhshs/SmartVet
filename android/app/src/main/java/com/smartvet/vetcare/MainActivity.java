package com.smartvet.vetcare;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.URLUtil;
import android.widget.Toast;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final int CAMERA_PERMISSION_REQUEST = 1001;
    private static final int FILE_CHOOSER_REQUEST = 1002;
    private static final int SAVE_DATA_DOWNLOAD_REQUEST = 1003;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 1004;
    private static final String APK_RELEASE_PATH =
        "/ynynhshs/SmartVet/releases/latest/download/SmartVet.apk";
    private static final String NOTIFICATION_CHANNEL_ID = "smartvet_reminders";

    private WebView webView;
    private PermissionRequest pendingCameraRequest;
    private ValueCallback<Uri[]> pendingFileChooser;
    private byte[] pendingDataDownload;
    private String pendingDataDownloadMime;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // Android WebView has no Web Push API, so expose native notifications.
        webView.addJavascriptInterface(new SmartVetBridge(), "SmartVetAndroid");

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(
                WebView view,
                WebResourceRequest request
            ) {
                Uri uri = request.getUrl();
                if (isTrustedAppOrigin(uri)) {
                    if (isVeterinaryOrAdminPath(uri)
                        || "/".equals(uri.getPath())
                        || ("/login.html".equals(uri.getPath())
                            && !"owner".equals(uri.getQueryParameter("app")))) {
                        view.loadUrl(ownerLoginUrl());
                        return true;
                    }
                    return false;
                }

                if (isSmartVetApkDownload(uri)) {
                    return false;
                }

                openExternalUrl(uri);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> handleWebPermissionRequest(request));
            }

            @Override
            public void onPermissionRequestCanceled(PermissionRequest request) {
                if (pendingCameraRequest == request) {
                    pendingCameraRequest = null;
                }
            }

            @Override
            public boolean onShowFileChooser(
                WebView view,
                ValueCallback<Uri[]> filePathCallback,
                FileChooserParams fileChooserParams
            ) {
                if (pendingFileChooser != null) {
                    pendingFileChooser.onReceiveValue(null);
                }

                pendingFileChooser = filePathCallback;
                try {
                    startActivityForResult(
                        fileChooserParams.createIntent(),
                        FILE_CHOOSER_REQUEST
                    );
                    return true;
                } catch (ActivityNotFoundException error) {
                    pendingFileChooser = null;
                    Toast.makeText(
                        MainActivity.this,
                        "No file picker is available on this device.",
                        Toast.LENGTH_LONG
                    ).show();
                    return false;
                }
            }
        });

        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) ->
            handleDownload(url, contentDisposition, mimeType)
        );

        setContentView(webView);
        webView.loadUrl(ownerLoginUrl());
    }

    /**
     * Bridge exposed to the owner page. WebView cannot subscribe to Web Push,
     * so reminders are posted through the Android notification system instead.
     */
    private class SmartVetBridge {
        @JavascriptInterface
        public boolean isAvailable() {
            return true;
        }

        @JavascriptInterface
        public void enableNotifications() {
            runOnUiThread(() -> requestNotificationPermission());
        }

        @JavascriptInterface
        public void showNotification(String title, String message) {
            runOnUiThread(() -> postNotification(title, message));
        }
    }

    /** Ask for POST_NOTIFICATIONS on Android 13+ and post a confirmation. */
    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(
                new String[] { Manifest.permission.POST_NOTIFICATIONS },
                NOTIFICATION_PERMISSION_REQUEST
            );
            return;
        }

        postNotification("SmartVet", "Notifications are enabled on this device.");
        notifyJavascriptPermissionResult(true);
    }

    /** Report the device permission result back to the owner page. */
    private void notifyJavascriptPermissionResult(boolean granted) {
        if (webView == null) {
            return;
        }

        webView.evaluateJavascript(
            "if (typeof window.onSmartVetNotificationsEnabled === 'function') {"
                + "window.onSmartVetNotificationsEnabled(" + granted + "); }",
            null
        );
    }

    /** Post a native notification on the SmartVet channel. */
    private void postNotification(String title, String message) {
        NotificationManager manager =
            (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager == null) {
            return;
        }

        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "SmartVet reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("Vaccination and pet care reminders");
            manager.createNotificationChannel(channel);
        }

        Intent openApp = new Intent(this, MainActivity.class);
        openApp.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent openPending = PendingIntent.getActivity(
            this,
            0,
            openApp,
            PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );

        Notification.Builder builder = Build.VERSION.SDK_INT >= 26
            ? new Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
            : new Notification.Builder(this);

        Notification notification = builder
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setLargeIcon(
                BitmapFactory.decodeResource(getResources(), R.drawable.vetcare_logo)
            )
            .setContentTitle(title == null || title.isEmpty() ? "SmartVet" : title)
            .setContentText(message == null ? "" : message)
            .setContentIntent(openPending)
            .setAutoCancel(true)
            .build();

        manager.notify((int) System.currentTimeMillis(), notification);
    }

    private String ownerLoginUrl() {
        return Uri.parse(BuildConfig.SMARTVET_BASE_URL)
            .buildUpon()
            .path("/login.html")
            .clearQuery()
            .appendQueryParameter("app", "owner")
            .fragment(null)
            .build()
            .toString();
    }

    private boolean isTrustedAppOrigin(Uri uri) {
        Uri appUri = Uri.parse(BuildConfig.SMARTVET_BASE_URL);
        int appPort = appUri.getPort() == -1 ? 443 : appUri.getPort();
        int uriPort = uri.getPort() == -1 ? 443 : uri.getPort();

        return "https".equalsIgnoreCase(uri.getScheme())
            && appUri.getHost() != null
            && appUri.getHost().equalsIgnoreCase(uri.getHost())
            && appPort == uriPort;
    }

    private boolean isSmartVetApkDownload(Uri uri) {
        String host = uri.getHost();
        String path = uri.getPath();
        if (host == null || path == null || !"https".equalsIgnoreCase(uri.getScheme())) {
            return false;
        }

        return ("github.com".equalsIgnoreCase(host) && APK_RELEASE_PATH.equals(path))
            || ("release-assets.githubusercontent.com".equalsIgnoreCase(host)
                && path.toLowerCase(Locale.ROOT).endsWith(".apk"));
    }

    private boolean isVeterinaryOrAdminPath(Uri uri) {
        String path = uri.getPath();
        return path != null
            && (path.startsWith("/clinic/")
                || path.equals("/clinic")
                || path.startsWith("/admin/")
                || path.equals("/admin"));
    }

    private void handleWebPermissionRequest(PermissionRequest request) {
        if (!isTrustedAppOrigin(request.getOrigin())) {
            request.deny();
            return;
        }

        boolean requestsVideo = false;
        for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) {
                requestsVideo = true;
                break;
            }
        }

        if (!requestsVideo) {
            request.deny();
            return;
        }

        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            request.grant(new String[] { PermissionRequest.RESOURCE_VIDEO_CAPTURE });
            return;
        }

        if (pendingCameraRequest != null) {
            pendingCameraRequest.deny();
        }
        pendingCameraRequest = request;
        requestPermissions(
            new String[] { Manifest.permission.CAMERA },
            CAMERA_PERMISSION_REQUEST
        );
    }

    private void handleDownload(
        String url,
        String contentDisposition,
        String mimeType
    ) {
        Uri uri = Uri.parse(url);
        if ("data".equalsIgnoreCase(uri.getScheme())) {
            saveDataDownload(url, contentDisposition, mimeType);
            return;
        }

        if (!isTrustedAppOrigin(uri) && !isSmartVetApkDownload(uri)) {
            openExternalUrl(uri);
            return;
        }

        DownloadManager manager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        if (manager == null) {
            showDownloadMessage("Android downloads are unavailable on this device.");
            return;
        }

        String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
        DownloadManager.Request request = new DownloadManager.Request(uri)
            .setTitle(fileName)
            .setDescription("Downloading from SmartVet")
            .setNotificationVisibility(
                DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            )
            .setAllowedOverMetered(true);

        if (mimeType != null && !mimeType.isEmpty()) {
            request.setMimeType(mimeType);
        }

        if (isTrustedAppOrigin(uri)) {
            String cookie = CookieManager.getInstance().getCookie(url);
            if (cookie != null && !cookie.isEmpty()) {
                request.addRequestHeader("Cookie", cookie);
            }
        }

        try {
            manager.enqueue(request);
            showDownloadMessage("Download started. Open Downloads when it finishes.");
        } catch (IllegalArgumentException | SecurityException error) {
            showDownloadMessage("Unable to start this download.");
        }
    }

    private void saveDataDownload(
        String url,
        String contentDisposition,
        String mimeType
    ) {
        pendingDataDownload = null;
        pendingDataDownloadMime = null;

        int comma = url.indexOf(',');
        if (comma < 0 || !url.substring(0, comma).toLowerCase(Locale.ROOT).contains(";base64")) {
            showDownloadMessage("This file format cannot be saved from the app.");
            return;
        }

        try {
            pendingDataDownload = Base64.decode(url.substring(comma + 1), Base64.DEFAULT);
        } catch (IllegalArgumentException error) {
            showDownloadMessage("Unable to read the downloaded image.");
            return;
        }

        String header = url.substring(5, comma);
        int mimeEnd = header.indexOf(';');
        pendingDataDownloadMime = mimeEnd < 0 ? header : header.substring(0, mimeEnd);
        if (pendingDataDownloadMime.isEmpty() && mimeType != null) {
            pendingDataDownloadMime = mimeType;
        }

        String fileName = URLUtil.guessFileName(url, contentDisposition, pendingDataDownloadMime);
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT)
            .addCategory(Intent.CATEGORY_OPENABLE)
            .setType(pendingDataDownloadMime)
            .putExtra(Intent.EXTRA_TITLE, fileName);

        try {
            startActivityForResult(intent, SAVE_DATA_DOWNLOAD_REQUEST);
        } catch (ActivityNotFoundException error) {
            pendingDataDownload = null;
            pendingDataDownloadMime = null;
            showDownloadMessage("No file picker is available on this device.");
        }
    }

    private void openExternalUrl(Uri uri) {
        String scheme = uri.getScheme();
        if (!"https".equalsIgnoreCase(scheme)
            && !"mailto".equalsIgnoreCase(scheme)
            && !"tel".equalsIgnoreCase(scheme)) {
            showDownloadMessage("This link cannot be opened from SmartVet.");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException error) {
            showDownloadMessage("No app is available to open this link.");
        }
    }

    private void showDownloadMessage(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    @Override
    public void onRequestPermissionsResult(
        int requestCode,
        String[] permissions,
        int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == NOTIFICATION_PERMISSION_REQUEST) {
            boolean granted = grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED;

            if (granted) {
                postNotification("SmartVet", "Notifications are enabled on this device.");
            }

            notifyJavascriptPermissionResult(granted);
            return;
        }

        if (requestCode != CAMERA_PERMISSION_REQUEST) {
            return;
        }

        PermissionRequest request = pendingCameraRequest;
        pendingCameraRequest = null;
        if (request == null) {
            return;
        }

        if (grantResults.length > 0
            && grantResults[0] == PackageManager.PERMISSION_GRANTED
            && isTrustedAppOrigin(request.getOrigin())) {
            request.grant(new String[] { PermissionRequest.RESOURCE_VIDEO_CAPTURE });
        } else {
            request.deny();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == FILE_CHOOSER_REQUEST && pendingFileChooser != null) {
            Uri[] result = resultCode == RESULT_OK && data != null
                ? WebChromeClient.FileChooserParams.parseResult(resultCode, data)
                : null;
            pendingFileChooser.onReceiveValue(result);
            pendingFileChooser = null;
            return;
        }

        if (requestCode == SAVE_DATA_DOWNLOAD_REQUEST) {
            Uri destination = resultCode == RESULT_OK && data != null
                ? data.getData()
                : null;
            if (destination != null && pendingDataDownload != null) {
                try (OutputStream output = getContentResolver().openOutputStream(destination)) {
                    if (output == null) {
                        showDownloadMessage("Unable to save the image.");
                    } else {
                        output.write(pendingDataDownload);
                        showDownloadMessage("Image saved.");
                    }
                } catch (IOException error) {
                    showDownloadMessage("Unable to save the image.");
                }
            }
            pendingDataDownload = null;
            pendingDataDownloadMime = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (pendingCameraRequest != null) {
            pendingCameraRequest.deny();
            pendingCameraRequest = null;
        }
        if (pendingFileChooser != null) {
            pendingFileChooser.onReceiveValue(null);
            pendingFileChooser = null;
        }
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
