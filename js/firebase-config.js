// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAD1UKzzjAYbxI1V-tg2fuXxshsEQcpXpc",
    authDomain: "khmer-hot-honey.firebaseapp.com",
    projectId: "khmer-hot-honey",
    storageBucket: "khmer-hot-honey.firebasestorage.app",
    messagingSenderId: "98813841413",
    appId: "1:98813841413:web:0d829c4cacf8489082cc6c",
    measurementId: "G-L8QZPED8YS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Log page view with additional parameters
function logPageView(pageName) {
    logEvent(analytics, 'page_view', {
        page_name: pageName,
        page_location: window.location.href
    });
}

// Log QR code scan with bottle ID
function logQrScan(locationCode) {
    logEvent(analytics, 'qr_scan', {
        location_code: locationCode,
        scan_time: new Date().toISOString(),
        scan_location: window.location.href
    });
    
    // Also store the QR scan in Firestore for more detailed analytics
    addDoc(collection(db, "qr_scans"), {
        location_code: locationCode,
        scan_time: serverTimestamp(),
        scan_location: window.location.href,
        user_agent: navigator.userAgent,
        language: navigator.language,
        screen_size: `${window.innerWidth}x${window.innerHeight}`
    })
    .then(() => {
        console.log("QR scan logged successfully");
    })
    .catch((error) => {
        console.error("Error logging QR scan: ", error);
    });
}

// Function to handle form submission (used on contact page)
function submitContactForm(formData) {
    return addDoc(collection(db, "contact_messages"), {
        ...formData,
        timestamp: serverTimestamp()
    });
}

// Export functions for use in other files
export { app, analytics, db, logPageView, logQrScan, submitContactForm };