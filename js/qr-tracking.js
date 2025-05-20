// qr-tracking.js - Script for handling QR code tracking
import { logQrScan } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check for encoded parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedParam = urlParams.get('r');
    
    if (encodedParam) {
        try {
            // Decode the Base64 encoded location
            const locationCode = atob(encodedParam);
            
            // Log the QR scan with decoded location information
            logQrScan(locationCode);
            
            // No welcome message - just log the scan silently
            console.log('QR scan detected and logged:', locationCode);
            
        } catch (e) {
            console.error('Error decoding location parameter:', e);
        }
    }
});