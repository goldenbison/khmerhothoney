document.addEventListener('DOMContentLoaded', function() {
    // Check if QRCode is defined
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded!');
        alert('QR Code library could not be loaded. Please check your internet connection and try again.');
        return;
    }
    
    console.log("QRCode library loaded successfully!");
    
    // QR Code Generator
    const generateQR = (function() {
        // Get the current host including protocol and port
        const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
        const baseUrl = isLocal ? 
            window.location.origin + '/uses?r=' : 
            'https://www.khmerhothoney.com/uses?r=';
        
        console.log("Using base URL for QR codes:", baseUrl);
        
        // Function to encode the location to Base64
        function encodeLocation(locationCode) {
            // Use built-in btoa function to encode to Base64
            return btoa(locationCode);
        }
        
        return {
            // Generate QR code for a specific location with encoding
            createQRCodeUrl: function(locationCode) {
                const encodedLocation = encodeLocation(locationCode);
                return baseUrl + encodedLocation;
            },
            
            // Format location name (remove spaces, special chars)
            formatLocation: function(prefix, suffix, index) {
                // Clean up prefix and suffix (remove spaces, special chars except underscores)
                const cleanPrefix = prefix.replace(/[^\w]/g, '');
                const cleanSuffix = suffix.replace(/[^\w]/g, '');
                
                // Format: PrefixSuffix-N (e.g., PizzaHutBKK1-1)
                return `${cleanPrefix}${cleanSuffix}-${index + 1}`;
            },
            
            // Generate QR codes for locations
            renderBatchQRCodes: function(prefix, suffix, count) {
                let html = '<div class="qr-code-grid">';
                
                for (let i = 0; i < count; i++) {
                    const locationCode = this.formatLocation(prefix, suffix, i);
                    const targetUrl = this.createQRCodeUrl(locationCode);
                    const encodedLocation = encodeLocation(locationCode);
                    const qrId = 'qr-' + btoa(locationCode); // Use encoded version for element ID too
                    
                    html += `
                        <div class="qr-code-item">
                            <div class="qr-image-container">
                                <div id="${qrId}" class="qr-code"></div>
                            </div>
                            <div class="qr-code-info">
                                <p><strong>Location:</strong> ${locationCode}</p>
                                <p><strong>Encoded:</strong> ${encodedLocation}</p>
                                <p><strong>URL:</strong> ${targetUrl}</p>
                                <button class="download-qr" data-location="${locationCode}">Download</button>
                            </div>
                        </div>
                    `;
                }
                
                html += '</div>';
                return html;
            },
            
            // Create QR codes in the DOM after HTML is inserted
            generateQRCodesInDOM: function(prefix, suffix, count) {
                for (let i = 0; i < count; i++) {
                    const locationCode = this.formatLocation(prefix, suffix, i);
                    const targetUrl = this.createQRCodeUrl(locationCode);
                    const qrId = 'qr-' + btoa(locationCode);
                    const container = document.getElementById(qrId);
                    
                    if (container) {
                        // Create QR code using qrcodejs library
                        new QRCode(container, {
                            text: targetUrl,
                            width: 250,
                            height: 250,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });
                    }
                }
            },
            
            // Download a single QR code
            downloadQRCode: function(locationCode) {
                const qrId = 'qr-' + btoa(locationCode);
                const qrContainer = document.getElementById(qrId);
                
                if (!qrContainer) {
                    alert('QR code not found.');
                    return;
                }
                
                try {
                    // Get the canvas from the QR container
                    const canvas = qrContainer.querySelector('canvas');
                    if (!canvas) {
                        alert('QR code image not found.');
                        return;
                    }
                    
                    // Get the data URL and trigger download
                    const dataURL = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = 'KHH-' + locationCode + '.png';
                    link.href = dataURL;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (e) {
                    console.error('Error downloading QR code:', e);
                    alert('Could not download QR code. Please try again.');
                }
            }
        };
    })();
    
    // UI Interaction
    const qrForm = document.getElementById('qr-generator-form');
    const qrOutput = document.getElementById('qr-output');
    
    if (qrForm) {
        qrForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const locationPrefix = document.getElementById('location-prefix').value.trim();
            const locationSuffix = document.getElementById('location-suffix').value.trim();
            const count = parseInt(document.getElementById('qr-count').value, 10);
            
            if (!locationPrefix || !locationSuffix) {
                qrOutput.innerHTML = '<p class="error">Please enter valid location information.</p>';
                return;
            }
            
            if (isNaN(count) || count < 1) {
                qrOutput.innerHTML = '<p class="error">Please enter a valid number of QR codes.</p>';
                return;
            }
            
            if (count > 100) {
                qrOutput.innerHTML = '<p class="error">Maximum 100 QR codes per batch.</p>';
                return;
            }
            
            // First insert the HTML structure
            qrOutput.innerHTML = generateQR.renderBatchQRCodes(locationPrefix, locationSuffix, count);
            
            // Then generate the QR codes in the DOM
            setTimeout(() => {
                generateQR.generateQRCodesInDOM(locationPrefix, locationSuffix, count);
            }, 100);
            
            // Add event listeners to download buttons
            document.querySelectorAll('.download-qr').forEach(button => {
                button.addEventListener('click', function() {
                    const locationCode = this.getAttribute('data-location');
                    generateQR.downloadQRCode(locationCode);
                });
            });
        });
    }
    
    // Option to download all as a ZIP
    const downloadAllBtn = document.getElementById('download-all-btn');
    
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', function() {
            const locationPrefix = document.getElementById('location-prefix').value.trim();
            const locationSuffix = document.getElementById('location-suffix').value.trim();
            const count = parseInt(document.getElementById('qr-count').value, 10);
            
            if (!locationPrefix || !locationSuffix || isNaN(count) || count < 1 || count > 100) {
                alert('Please generate a valid batch of QR codes first (maximum 100).');
                return;
            }
            
            // Download QR codes one by one with a delay
            for (let i = 0; i < count; i++) {
                const locationCode = generateQR.formatLocation(locationPrefix, locationSuffix, i);
                setTimeout(() => {
                    generateQR.downloadQRCode(locationCode);
                }, i * 300); // 300ms delay between downloads
            }
        });
    }
    
    // Update the example URL format if that element exists
    const urlFormatExample = document.getElementById('url-format-example');
    if (urlFormatExample) {
        const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
        const exampleUrl = isLocal ? 
            window.location.origin + '/uses?location=PizzaHutBKK1-1' : 
            'https://www.khmerhothoney.com/uses?location=PizzaHutBKK1-1';
        
        urlFormatExample.textContent = exampleUrl;
    }
});