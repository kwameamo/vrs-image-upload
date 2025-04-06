'use client'

// Firebase imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase/firebaseConfig.js";

// React imports
import React, { useState, useEffect, useRef, useMemo } from 'react';

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
// Modify the LoginPage component
const LoginPage = ({ onLoginSuccess }) => {
  // Change stationId to email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Station mapping - use this to find the station ID from email
  const stationMapping = {
    'er1@dvlavrs.app': { id: 'ER1', name: 'Koforidua Station' },
    'er2@dvlavrs.app': { id: 'ER2', name: 'Akim Oda Station' },
    'er3@dvlavrs.app': { id: 'ER3', name: 'Kyebi Station' },
    'er4@dvlavrs.app': { id: 'ER4', name: 'Nkawkaw Station' },
    // Greater Accra Region (GR)
    'gr1@dvlavrs.app': { id: 'GR1', name: 'Accra Station (Haatso)' },
    'gr2@dvlavrs.app': { id: 'GR2', name: 'DVLA Headquarters (Cantonments)' },
    'gr3@dvlavrs.app': { id: 'GR3', name: 'Tema Station' },
    'gr4@dvlavrs.app': { id: 'GR4', name: 'Weija Station' },
    // Ashanti Region (AR)
    'ar1@dvlavrs.app': { id: 'AR1', name: 'Agona Ashanti Station' },
    'ar2@dvlavrs.app': { id: 'AR2', name: 'Bekwai Station' },
    'ar3@dvlavrs.app': { id: 'AR3', name: 'Kumasi Station' },
    'ar4@dvlavrs.app': { id: 'AR4', name: 'Mampong-Ashanti Station' },
    'ar5@dvlavrs.app': { id: 'AR5', name: 'Obuasi Station' },
    'ar6@dvlavrs.app': { id: 'AR6', name: 'Offinso Station' },
    // Add other stations as needed
  };
  
  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Form validation
    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }
    
    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      
      // For debugging
      console.log(`Attempting to log in with: ${normalizedEmail}`);
      
      // Check if this is a valid station email
      const stationInfo = stationMapping[normalizedEmail];
      if (!stationInfo) {
        setError('Email not recognized as a valid station');
        setLoading(false);
        return;
      }
      
      // Try to authenticate with Firebase
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      
      // Pass the station ID to the onLoginSuccess callback
      onLoginSuccess(stationInfo.id);
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different Firebase auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Update the reset password function to use email
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }
    
    // Similar validation as in handleLogin...
    // For now, just show the success message
    setTimeout(() => {
      setResetSuccess(true);
      
      setTimeout(() => {
        setResetSuccess(false);
        setShowResetForm(false);
      }, 5000);
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
                  Password reset email has been sent. Please check your inbox.
                </p>
              </div>
            )}
            
            {!showResetForm ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your station email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your station email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
  const [loading, setLoading] = useState(false); // Add this line
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

  // Add this function to filter uploads based on search
  const filteredUploads = useMemo(() => {
    if (!searchQuery.trim()) {
      // If no search query, return all uploads sorted by timestamp
      return [...uploads].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    }
    
    // Filter uploads where chassis ID contains the search query
    return [...uploads]
      .filter(upload => upload.id.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [uploads, searchQuery]);

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

  useEffect(() => {
    // First try to load from localStorage
    const savedUploads = localStorage.getItem(`vrsUploads_${stationId}`);
    
    if (savedUploads) {
      try {
        // Parse the data
        let loadedUploads = JSON.parse(savedUploads);
        
        // Filter out uploads older than 2 days
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        const filteredUploads = loadedUploads.filter(upload => {
          const uploadDate = new Date(upload.timestamp);
          return uploadDate > twoDaysAgo;
        });
        
        // If we removed some uploads, update localStorage
        if (filteredUploads.length < loadedUploads.length) {
          // Save the filtered list back to localStorage
          localStorage.setItem(`vrsUploads_${stationId}`, JSON.stringify(filteredUploads));
          
          // TODO: Consider deleting old images from Cloudinary too
          // This would require an additional API endpoint
        }
        
        // Update state with uploads that have Cloudinary URLs
        setUploads(filteredUploads);
        
      } catch (error) {
        console.error("Error loading saved uploads:", error);
      }
    }
  }, [stationId]);
  
// In the ChassisImageManager component
// Get station name from ID
const getStationName = (id) => {
  const stations = {
    // Greater Accra Region (GR)
    'GR1': 'Accra Station (Haatso)',
    'GR2': 'DVLA Headquarters (Cantonments)',
    'GR3': 'Tema Station',
    'GR4': 'Weija Station',
  
    // Ashanti Region (AR)
    'AR1': 'Agona Ashanti Station',
    'AR2': 'Bekwai Station',
    'AR3': 'Kumasi Station',
    'AR4': 'Mampong-Ashanti Station',
    'AR5': 'Obuasi Station',
    'AR6': 'Offinso Station',
  
    // Eastern Region (ER)
    'ER1': 'Koforidua Station',
    'ER2': 'Akim Oda Station',
    'ER3': 'Kyebi Station',
    'ER4': 'Nkawkaw Station',
    
    // Other regions...
  };    
  return stations[id] || id;
};

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    setError('');
    setLoading(true);
    
    // Validation
    if (chassisId.length !== 4 || !/^\d+$/.test(chassisId)) {
      setError('Please enter exactly 4 numbers for the Chassis ID');
      setLoading(false);
      return;
    }
  
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      setLoading(false);
      return;
    }
  
    // Check file sizes - Vercel has 4.5MB limit for serverless functions
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
    const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError(`${oversizedFiles.length} file(s) exceed the 4MB size limit. Please compress or select smaller images.`);
      setLoading(false);
      return;
    }
  
    try {
      const uploadedImages = [];
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('stationId', stationId);
        formData.append('chassisId', chassisId);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        
        const result = await response.json();
        
        uploadedImages.push({
          data: result.url,
          name: file.name,
          type: file.type,
          size: file.size,
          public_id: result.public_id
        });
      }
      
      // Create new upload entry with the Cloudinary image URLs
      const newUpload = {
        id: chassisId,
        images: uploadedImages,
        timestamp: new Date().toISOString(),
        displayDate: new Date().toLocaleString(),
        fileCount: selectedFiles.length,
        station: stationId
      };
      
      // Update state
      setUploads(prevUploads => [...prevUploads, newUpload]);
      
      // Store in localStorage for persistence
      try {
        const allUploads = [...uploads, newUpload];
        localStorage.setItem(`vrsUploads_${stationId}`, JSON.stringify(allUploads));
      } catch (storageError) {
        console.warn('Could not save to localStorage', storageError);
      }
      
      // Reset form
      setChassisId('');
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fix the downloadImage function
  const downloadImage = (imageData, imageName, imageType) => {
    let downloadUrl = imageData;
    
    // If using Cloudinary, modify the URL for download
    if (imageData.includes('cloudinary.com')) {
      // Add fl_attachment parameter to force download
      downloadUrl = imageData.replace('/upload/', '/upload/fl_attachment/');
    }
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    const fileExtension = imageType.split('/')[1] || 'jpg';
    const fileName = imageName || `chassis-${selectedUpload.id}-image.${fileExtension}`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

// Fix the downloadAllImages function
const downloadAllImages = () => {
  if (!selectedUpload || selectedUpload.images.length === 0) return;
  
  // Sequential downloads with larger delays to avoid browser throttling
  const downloadSequentially = async () => {
    for (let i = 0; i < selectedUpload.images.length; i++) {
      const image = selectedUpload.images[i];
      
      // Process one image at a time
      let downloadUrl = image.data;
      
      // If using Cloudinary, modify the URL for download
      if (image.data.includes('cloudinary.com')) {
        // Add fl_attachment parameter to force download
        downloadUrl = image.data.replace('/upload/', '/upload/fl_attachment/');
      }
      
      // Create link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename
      const fileExtension = image.type.split('/')[1] || 'jpg';
      const fileName = image.name || `chassis-${selectedUpload.id}-image-${i + 1}.${fileExtension}`;
      
      // Set download attribute
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Wait for a bit before the next download
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };
  
  // Start sequential downloads
  downloadSequentially();
};

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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
                    className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Images"}
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