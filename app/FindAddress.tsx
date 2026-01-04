// app/FindAddress.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

type Selected = {
  lat: number;
  lng: number;
  address?: string;
};

export default function FindAddress() {
  const { setUser } = useUser();
  const router = useRouter();
  const webRef = useRef<WebView | null>(null);
  const lastRequestRef = useRef<number>(0);

  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [fetchingAddress, setFetchingAddress] = useState(false);

  /* -------------------- LOCATION INIT -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        let lat = 20.5937;
        let lng = 78.9629;

        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({});
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }

        setHtml(createLeafletHtml(lat, lng));
      } catch (err) {
        console.warn("Location error", err);
        setHtml(createLeafletHtml(20.5937, 78.9629));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------------------- MAP MESSAGE -------------------- */
  const onMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.lat && data?.lng) {
        setSelected({ lat: data.lat, lng: data.lng });
        await doReverseGeocode(data.lat, data.lng);
      }
    } catch (err) {
      console.warn("onMessage parse error", err);
    }
  };

  /* -------------------- REVERSE GEOCODE -------------------- */
  const doReverseGeocode = async (lat: number, lng: number) => {
    const now = Date.now();
    if (now - lastRequestRef.current < 1200) return;
    lastRequestRef.current = now;

    try {
      setFetchingAddress(true);

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "IndrakumarApp/1.0 (indrakumar@gmail.com)",
          Accept: "application/json",
        },
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.warn("Non-JSON response:", text.slice(0, 200));
        throw new Error("Invalid response type");
      }

      const json = await res.json();
      const display =
        json.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      setSelected({ lat, lng, address: display });
    } catch (err) {
      console.warn("reverse geocode failed", err);
      setSelected({
        lat,
        lng,
        address: "Address not available",
      });
    } finally {
      setFetchingAddress(false);
    }
  };

  /* -------------------- CONFIRM ADDRESS -------------------- */
  const confirmAddress = () => {
    if (!selected) {
      Alert.alert(
        "No location selected",
        "Tap on the map to pick a location first."
      );
      return;
    }

    const newAddr = {
      id: Date.now().toString(),
      label: selected.address
        ? selected.address.split(",")[0]
        : "Selected location",
      details: selected.address || `${selected.lat}, ${selected.lng}`,
    };

    setUser((prev: any) => ({
      ...prev,
      addresses: [...(prev.addresses || []), newAddr],
      selectedAddress: newAddr,
    }));

    router.back();
  };

  /* -------------------- LOADING -------------------- */
  if (loading || !html) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Preparing map…</Text>
      </View>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tap map to pick a location</Text>
        <Text style={styles.subtitle}>
          Tap anywhere on the map to set marker
        </Text>
      </View>

      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webview}
        onMessage={onMessage}
      />

      <View style={styles.footer}>
        {selected ? (
          <>
            <Text numberOfLines={2} style={styles.addressText}>
              {fetchingAddress
                ? "Fetching address…"
                : selected.address}
            </Text>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={confirmAddress}
              disabled={fetchingAddress}
            >
              <Text style={styles.confirmBtnText}>
                Confirm Location
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.hint}>
            Tap on the map to place a marker
          </Text>
        )}
      </View>
    </View>
  );
}

/* -------------------- LEAFLET HTML -------------------- */
function createLeafletHtml(initialLat: number, initialLng: number) {
  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
<style>
html,body,#map{height:100%;margin:0;padding:0}
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script>
(function(){
  const map = L.map('map').setView([${initialLat}, ${initialLng}], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19
  }).addTo(map);

  let marker=null;
  map.on('click',function(e){
    if(marker){map.removeLayer(marker);}
    marker=L.marker(e.latlng).addTo(map);
    window.ReactNativeWebView.postMessage(
      JSON.stringify({lat:e.latlng.lat,lng:e.latlng.lng})
    );
  });
})();
</script>
</body>
</html>`;
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { color: "#666", marginTop: 4 },
  webview: { flex: 1 },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  addressText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
  hint: { color: "#666" },
  confirmBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
