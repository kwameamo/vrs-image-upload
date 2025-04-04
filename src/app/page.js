'use client'

import React, { useState, useEffect, useRef } from 'react';

const VRSApp = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStationId, setCurrentStationId] = useState('');

  // Handle successful login
  const handleLoginSuccess = (stationId) => {
    setIsAuthenticated(true);
    setCurrentStationId(stationId);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentStationId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChassisImageManager 
          stationId={currentStationId}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

// Login Component
const LoginPage = ({ onLoginSuccess }) => {
  // States for form fields and validation
  const [stationId, setStationId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Station ID options
  const stationOptions = [
    // Greater Accra Region (GR)
    { id: 'GR1', name: 'Accra Regional Office (Haatso)' },
    { id: 'GR2', name: 'DVLA Headquarters (Cantonments)' },
    { id: 'GR3', name: 'Tema Branch' },
    { id: 'GR4', name: 'Weija Branch' },

    // Ashanti Region (AR)
    { id: 'AR1', name: 'Agona Ashanti Branch' },
    { id: 'AR2', name: 'Bekwai Branch' },
    { id: 'AR3', name: 'Kumasi Regional Office' },
    { id: 'AR4', name: 'Mampong-Ashanti Branch' },
    { id: 'AR5', name: 'Obuasi Branch' },
    { id: 'AR6', name: 'Offinso Branch' },

    // Brong-Ahafo Region (BA)
    { id: 'BA1', name: 'Goaso Branch' },
    { id: 'BA2', name: 'Kintampo Branch' },
    { id: 'BA3', name: 'Sunyani Regional Office' },
    { id: 'BA4', name: 'Techiman Branch' },

    // Central Region (CR)
    { id: 'CR1', name: 'Cape Coast Regional Office' },
    { id: 'CR2', name: 'Dunkwa-On-Offin Branch' },
    { id: 'CR3', name: 'Winneba Branch' },

    // Eastern Region (ER)
    { id: 'ER1', name: 'Koforidua Regional Office' },
    { id: 'ER2', name: 'Akim Oda Branch' },
    { id: 'ER3', name: 'Kyebi Branch' },
    { id: 'ER4', name: 'Nkawkaw Branch' },

    // Volta Region (VR)
    { id: 'VR1', name: 'Ho Regional Office' },

    // Western Region (WR)
    { id: 'WR1', name: 'Sefwi Wiawso Branch' },
    { id: 'WR2', name: 'Takoradi Regional Office' },
    { id: 'WR3', name: 'Tarkwa Branch' },
  ];
  
  // For demo purposes - in a real app this would be validated on the server
  const validPassword = 'password123';
  
  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Form validation
    if (!stationId) {
      setError('Please select a Station ID');
      setLoading(false);
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }
    
    // Simulate network delay
    setTimeout(() => {
      // Check credentials
      if (stationOptions.some(station => station.id === stationId) && password === validPassword) {
        onLoginSuccess(stationId);
      } else {
        setError('Invalid Station ID or password');
      }
      setLoading(false);
    }, 800);
  };
  
  // Handle password reset
  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!stationId) {
      setError('Please select a Station ID');
      setLoading(false);
      return;
    }
    
    // Simulate network delay
    setTimeout(() => {
      if (stationOptions.some(station => station.id === stationId)) {
        // Show success message with the reset password
        setResetSuccess(true);
        
        setTimeout(() => {
          setResetSuccess(false);
          setShowResetForm(false);
        }, 5000);
      } else {
        setError('Invalid Station ID');
      }
      setLoading(false);
    }, 800);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 flex flex-col items-center border-b">
            <div className="w-32 mb-2">
              {/* Ghana DVLA Logo */}
              <img 
                src="/dvla-logo.png"
                alt="Ghana DVLA Logo"
                className="w-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {showResetForm ? 'Reset Password' : 'VRS Image Upload'}
            </h2>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                <span className="mr-2">⚠️</span>
                <p>{error}</p>
              </div>
            )}
            
            {resetSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                <p>
                  Password has been reset to: <strong>dvla2025</strong>
                </p>
              </div>
            )}
            
            {!showResetForm ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                <label htmlFor="stationId" className="block text-sm font-medium text-gray-800">
                  Station ID
                </label>
                <select
                  id="stationId"
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" className="text-gray-800">Select Station ID</option>
                  {stationOptions.map(station => (
                    <option key={station.id} value={station.id} className="text-gray-800 font-medium">
                      {station.id} - {station.name}
                    </option>
                  ))}
                </select>
                </div>
                
                <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                  Password
                </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="resetStationId" className="block text-sm font-medium text-gray-700">
                    Station ID
                  </label>
                  <select
                    id="resetStationId"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Station ID</option>
                    {stationOptions.map(station => (
                      <option key={station.id} value={station.id}>
                        {station.id} - {station.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t p-4">
            <button
              type="button"
              className="w-full text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
              onClick={() => {
                setShowResetForm(!showResetForm);
                setError('');
                setResetSuccess(false);
              }}
            >
              {showResetForm ? 'Back to Login' : 'Forgot Password?'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chassis Image Manager Component
const ChassisImageManager = ({ stationId, onLogout }) => {
  const [chassisId, setChassisId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [usingCamera, setUsingCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load uploads for this specific station from localStorage and clean up old uploads
  useEffect(() => {
    const savedUploads = localStorage.getItem(`vrsUploads_${stationId}`);
    if (savedUploads) {
      try {
        let loadedUploads = JSON.parse(savedUploads);
        
        // Filter out uploads older than 2 days
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        // Filter uploads to keep only those newer than 2 days
        const filteredUploads = loadedUploads.filter(upload => {
          const uploadDate = new Date(upload.timestamp);
          return uploadDate > twoDaysAgo;
        });
        
        // If we removed some old uploads, update localStorage
        if (filteredUploads.length < loadedUploads.length) {
          localStorage.setItem(`vrsUploads_${stationId}`, JSON.stringify(filteredUploads));
        }
        
        setUploads(filteredUploads);
      } catch (error) {
        console.error("Error loading saved uploads:", error);
      }
    }
  }, [stationId]);

    // Filter uploads where chassis ID contains the search query
    return [...uploads]
      .filter(upload => upload.id.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [uploads, searchQuery]);

  // Add this function to filter uploads based on search
  const filteredUploads = useMemo(() => {
    if (!searchQuery.trim()) {
      // If no search query, return all uploads sorted by timestamp
      return [...uploads].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    }

  // Add this function to handle camera access
  const startCamera = async () => {
    try {
      setUsingCamera(true);
      // Specify that we want to use the rear camera (environment-facing)
      const constraints = {
        video: {
          facingMode: "environment" // This requests the rear camera
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError("Could not access camera. Please check permissions.");
      setUsingCamera(false);
    }
  };

  // Add this function to capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setSelectedFiles(prev => [...prev, file]);
        }
      }, 'image/jpeg', 0.8);
      
      // Stop camera stream
      stopCamera();
    }
  };

  // Add this function to stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setUsingCamera(false);
  };

  // Save uploads to localStorage whenever they change
  useEffect(() => {
    if (uploads.length > 0) {
      localStorage.setItem(`vrsUploads_${stationId}`, JSON.stringify(uploads));
    } else {
      // If uploads array is empty, remove the item from localStorage
      localStorage.removeItem(`vrsUploads_${stationId}`);
    }
  }, [uploads, stationId]);
  
  // Get station name from ID
  const getStationName = (id) => {
    const stations = {
      // Greater Accra Region (GR)
      'GR1': 'Accra Regional Office (Haatso)',
      'GR2': 'DVLA Headquarters (Cantonments)',
      'GR3': 'Tema Branch',
      'GR4': 'Weija Branch',
    
      // Ashanti Region (AR)
      'AR1': 'Agona Ashanti Branch',
      'AR2': 'Bekwai Branch',
      'AR3': 'Kumasi Regional Office',
      'AR4': 'Mampong-Ashanti Branch',
      'AR5': 'Obuasi Branch',
      'AR6': 'Offinso Branch',
    
      // Brong-Ahafo Region (BA)
      'BA1': 'Goaso Branch',
      'BA2': 'Kintampo Branch',
      'BA3': 'Sunyani Regional Office',
      'BA4': 'Techiman Branch',
    
      // Central Region (CR)
      'CR1': 'Cape Coast Regional Office',
      'CR2': 'Dunkwa-On-Offin Branch',
      'CR3': 'Winneba Branch',
    
      // Eastern Region (ER)
      'ER1': 'Koforidua Regional Office',
      'ER2': 'Akim Oda Branch',
      'ER3': 'Kyebi Branch',
      'ER4': 'Nkawkaw Branch',
    
      // Volta Region (VR)
      'VR1': 'Ho Regional Office',
    
      // Western Region (WR)
      'WR1': 'Sefwi Wiawso Branch',
      'WR2': 'Takoradi Regional Office',
      'WR3': 'Tarkwa Branch'
    };    
    return stations[id] || id;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    setError('');
    
    if (chassisId.length !== 4 || !/^\d+$/.test(chassisId)) {
      setError('Please enter exactly 4 numbers for the Chassis ID');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    if (uploads.some(upload => upload.id === chassisId)) {
      setError('This Chassis ID already exists');
      return;
    }

    // Convert files to base64 strings for storage
    const imagePromises = selectedFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({
          data: reader.result,
          name: file.name,
          type: file.type,
          size: file.size
        });
        reader.readAsDataURL(file);
      });
    });

    const imageData = await Promise.all(imagePromises);

    const newUpload = {
      id: chassisId,
      images: imageData,
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleString(),
      fileCount: selectedFiles.length,
      station: stationId
    };

    setUploads([...uploads, newUpload]);
    setChassisId('');
    setSelectedFiles([]);
  };

  const downloadImage = (imageData, imageName, imageType) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageData;
    
    // Generate filename: chassis-ID-originalname
    const fileExtension = imageType.split('/')[1];
    const fileName = imageName || `chassis-${selectedUpload.id}-image.${fileExtension}`;
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add this function to the ChassisImageManager component

const downloadAllImages = () => {
  if (!selectedUpload || selectedUpload.images.length === 0) return;
  
  // For each image, create a download
  selectedUpload.images.forEach((image, index) => {
    // Create link element
    const link = document.createElement('a');
    link.href = image.data;
    
    // Generate filename
    const fileExtension = image.type.split('/')[1];
    const fileName = image.name || `chassis-${selectedUpload.id}-image-${index + 1}.${fileExtension}`;
    
    // Set download attribute and trigger click
    link.download = fileName;
    
    // Add slight delay between downloads to avoid browser throttling
    setTimeout(() => {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, index * 100);
  });
};

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Sort uploads by timestamp in descending order (newest first)
  const sortedUploads = [...uploads].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Station Info and Logout */}
      <header className="bg-slate-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
          <img 
            src="/dvla-logo.png" 
            alt="DVLA Logo" 
            className="h-8 w-8"
          />
            <div>
              <h1 className="text-lg font-bold">VRS Image Upload System</h1>
              <p className="text-xs opacity-80">
                {stationId} - {getStationName(stationId)}
              </p>
            </div>
          </div>
          <button 
            className="inline-flex items-center px-3 py-1 border border-white text-white text-sm rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-grow p-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`py-2 font-medium text-center rounded-t-lg ${activeTab === 'upload' 
                  ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 border-b border-gray-200'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload Images
              </button>
              <button
                className={`py-2 font-medium text-center rounded-t-lg ${activeTab === 'view' 
                  ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 border-b border-gray-200'}`}
                onClick={() => setActiveTab('view')}
              >
                View Uploads
              </button>
            </div>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="bg-white border rounded-lg shadow-sm p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                  <span className="mr-2">⚠️</span>
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-6">
                <div className="space-y-2">
                <label htmlFor="chassisId" className="block text-sm font-medium text-gray-800">
                  Chassis (last 4 numbers)
                </label>
                  <input
                    id="chassisId"
                    type="text"
                    placeholder="Enter last 4 numbers"
                    maxLength={4}
                    value={chassisId}
                    onChange={(e) => setChassisId(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                    Select Images
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="images"
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      📷
                    </button>
                  </div>
                </div>
                
                {/* Camera UI */}
                {usingCamera && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                      <h3 className="text-lg font-medium mb-2">Take a Photo</h3>
                      <div className="relative">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full rounded-md"
                        ></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={stopCamera}
                          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={capturePhoto}
                          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                          Capture Photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedFiles.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {selectedFiles.length} files selected
                  </div>
                )}
                
                <button 
                  onClick={handleUpload} 
                  className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Upload Images
                </button>
              </div>
              </div>
            </div>
          )}

          {/* View Tab */}
          {activeTab === 'view' && (
            <div className="bg-white border rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4">
                <h3 className="font-medium text-lg mb-4 text-gray-900">Uploaded Sets</h3>
           
                {/* Search Box */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chassis number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm pl-9 pr-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {filteredUploads.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {uploads.length === 0 ? 'No uploads yet' : 'No matching chassis found'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUploads.map((upload) => (
              <button
                key={upload.id}
                className={`w-full text-left px-4 py-3 rounded-md border ${
                  selectedUpload?.id === upload.id 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium' 
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800 font-medium'
                }`}
                onClick={() => setSelectedUpload(upload)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Chassis #{upload.id}</span>
                  <span className="text-xs text-gray-700">
                    {upload.displayDate} • {upload.fileCount} images
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

                <div className="border rounded p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-gray-900">Preview</h3>
                    {selectedUpload && (
                      <button 
                        onClick={downloadAllImages}
                        className="bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Download All ({selectedUpload.images.length})
                      </button>
                    )}
                  </div>
                  
                  {selectedUpload ? (
                    <div className="space-y-6">
                      {selectedUpload.images.map((image, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="border bg-gray-50 rounded-md p-1">
                            <img
                              src={image.data}
                              alt={`Chassis ${selectedUpload.id} - Image ${idx + 1}`}
                              className="w-full h-48 object-contain rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="truncate flex-1 mr-2">
                              {image.name || `Image ${idx + 1}`}
                              <span className="ml-2">({formatFileSize(image.size)})</span>
                            </div>
                            <button 
                              onClick={() => downloadImage(image.data, image.name, image.type)}
                              className="flex-shrink-0 inline-flex items-center px-2 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Select a chassis ID to view images
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VRSApp;
