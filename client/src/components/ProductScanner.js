import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BrowserMultiFormatReader } from '@zxing/library';

function ProductScanner({ onAddToCart }) {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [scannedProduct, setScannedProduct] = useState(null);
    const videoRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        let codeReader;

        if (showModal) {
            codeReader = new BrowserMultiFormatReader();
            setIsScanning(true);

            codeReader
                .listVideoInputDevices()
                .then(videoInputDevices => {
                    if (videoInputDevices.length > 0) {
                        const selectedDeviceId = videoInputDevices[0].deviceId;

                        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, error) => {
                            if (result) {
                                console.log('QR Code result:', result.text);
                                try {
                                    // Assuming the QR code contains JSON string with product info
                                    const product = JSON.parse(result.text);
                                    // Validate the product data
                                    if (product.name && product.price) {
                                        setScannedProduct(product);
                                        console.log(11);
                                        onAddToCart(product); // Call the function to add product to cart
                                        console.log(12);
                                        alert(`${product.name} has been added to your cart!`);
                                        handleClose(); // Close the modal after successful scan
                                    } else {
                                        setError('Invalid QR code data.');
                                    }
                                } catch (e) {
                                    console.error('Error parsing QR code data:', e);
                                    setError('Error parsing QR code data. Please try again.');
                                }
                            }

                            if (error) {
                                console.error('Error decoding QR code:', error);
                                setError('Error decoding QR code. Please try again.');
                            }
                        });
                    } else {
                        setError('No video input devices found.');
                    }
                })
                .catch(err => {
                    console.error('Error accessing video input devices:', err);
                    setError('Error accessing camera. Please try again.');
                });
        }

        return () => {
            if (codeReader) {
                codeReader.reset();
                setIsScanning(false);
            }
        };
    }, [showModal, onAddToCart]);

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Scan QR Code
            </Button>

            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Scan QR Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="qr-scanner">
                        <video ref={videoRef} style={{ width: '100%' }} />
                        {error && (
                            <div className="alert alert-danger mt-3">
                                {error}
                            </div>
                        )}
                        {scannedProduct && (
                            <div className="mt-3">
                                <p>Scanned Product:</p>
                                <p>Name: {scannedProduct.name}</p>
                                <p>Price: ${scannedProduct.price}</p>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProductScanner;
