import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { BrowserMultiFormatReader } from '@zxing/library';

function ProductScanner({ onAddToCart }) {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [scannedProduct, setScannedProduct] = useState(null);
    const videoRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    const handleClose = () => {
        setShowModal(false);
        setScannedProduct(null);
        setError(null);
    };

    const handleShow = () => setShowModal(true);

    useEffect(() => {
        let codeReader;

        if (showModal) {
            codeReader = new BrowserMultiFormatReader();
            setIsScanning(true);

            codeReader
                .listVideoInputDevices()
                .then(videoInputDevices => {
                    setDevices(videoInputDevices);
                    if (videoInputDevices.length > 0) {
                        const defaultDeviceId = videoInputDevices[0].deviceId;
                        setSelectedDeviceId(defaultDeviceId);

                        // Start scanning with the default device
                        codeReader.decodeFromVideoDevice(defaultDeviceId, videoRef.current, handleScanResult);
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
    }, [showModal]);

    const handleScanResult = (result, error) => {
        if (result) {
            console.log('QR Code result:', result.text);
            try {
                const product = JSON.parse(result.text);
                if (product.name && product.price) {
                    setScannedProduct(product);
                    onAddToCart(product);
                    alert(`${product.name} has been added to your cart!`);
                    handleClose();
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
    };

    const handleDeviceChange = (e) => {
        const deviceId = e.target.value;
        setSelectedDeviceId(deviceId);

        if (isScanning) {
            // Stop scanning with the current device and switch to the new one
            const codeReader = new BrowserMultiFormatReader();
            codeReader.reset();
            codeReader.decodeFromVideoDevice(deviceId, videoRef.current, handleScanResult);
        }
    };

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
                    <Form.Group controlId="cameraSelect">
                        <Form.Label>Select Camera</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedDeviceId}
                            onChange={handleDeviceChange}
                        >
                            {devices.map((device, index) => (
                                <option key={index} value={device.deviceId}>
                                    {device.label || `Camera ${index + 1}`}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
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
