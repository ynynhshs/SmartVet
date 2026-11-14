# SmartVet Android APK distribution

The Android app is a signed WebView wrapper for pet owners. It starts at the
owner-only login page, rejects non-owner accounts in that app login flow, and
redirects clinic/admin dashboard navigation back to the owner login page. The
veterinary dashboard is not included in the mobile app. The owner dashboard's
download action points to the latest GitHub Release APK.

The app loads `https://smartvet-3yqh.onrender.com` by default. Change
`smartvetBaseUrl` in `android/app/build.gradle` if the production site moves.

## Create and protect the signing key

Create one release key on a trusted computer and keep a secure backup. Never
commit the keystore or send it in chat. Android requires the same key for every
future update to this app.

Install a JDK 17 or newer to get `keytool`. In PowerShell, create the keystore
outside the repository:

```powershell
keytool -genkeypair -v -keystore "$HOME\smartvet-release.jks" -alias smartvet-release -keyalg RSA -keysize 2048 -validity 10000
```

In the GitHub repository, open **Settings → Secrets and variables → Actions**
and add these repository secrets:

- `ANDROID_KEYSTORE_BASE64`: output of
  `[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\smartvet-release.jks"))`
- `ANDROID_KEYSTORE_PASSWORD`: the keystore password
- `ANDROID_KEY_ALIAS`: `smartvet-release` (or the alias chosen above)
- `ANDROID_KEY_PASSWORD`: the key password

Do not disclose these values in an issue, commit, or chat.

## Build and publish

After adding the secrets, push a version tag to build a signed APK and attach it
to a GitHub Release:

```powershell
git tag android-v1.0.0
git push origin android-v1.0.0
```

The workflow can also be started manually from the repository's **Actions**
tab. Manual builds are uploaded as workflow artifacts; version tags additionally
publish `SmartVet.apk` to Releases, which makes the dashboard download link
available.

The dashboard link will not return an APK until the signing secrets are set and
the first version tag has built successfully.

Android may ask users to allow app installation from the browser or dashboard.
The app requests camera access only for SmartVet's QR scanner and uses Android's
file picker for uploads.
