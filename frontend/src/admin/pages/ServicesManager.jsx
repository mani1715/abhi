import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import axios from 'axios';

const ServicesManager = () => {
  const { adminData, addService, updateService, deleteService, fetchServices } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    icon: 'Code',
    title: '',
    description: '',
    image: '',
    images: [],
    link: '',
    link_text: 'Learn More',
    features: [],
    price: '',
    order: 1,
    active: true
  });
  
  // Image management states
  const [imageInputMethod, setImageInputMethod] = useState('url'); // 'url' or 'upload'
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const iconOptions = [
    'Code', 'ShoppingCart', 'Layers', 'Palette', 'Smartphone', 
    'Database', 'Cloud', 'Settings', 'Zap', 'Globe'
  ];

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '/api';

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        ...service,
        image: service.image || '',
        images: service.images || [],
        link: service.link || '',
        link_text: service.link_text || 'Learn More'
      });
    } else {
      setEditingService(null);
      setFormData({
        icon: 'Code',
        title: '',
        description: '',
        image: '',
        images: [],
        link: '',
        link_text: 'Learn More',
        features: [],
        price: '',
        order: adminData.services.length + 1,
        active: true
      });
    }
    setImageUrlInput('');
    setImagePreview(null);
    setUploadError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setImageUrlInput('');
    setImagePreview(null);
    setUploadError('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeaturesChange = (value) => {
    const featuresArray = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({ ...prev, features: featuresArray }));
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BACKEND_URL}/services/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.url;
        setImagePreview(imageUrl);
        // Auto-add to images array
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), imageUrl]
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.detail || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle URL input
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) {
      setUploadError('Please enter a valid image URL.');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrlInput);
    } catch (e) {
      setUploadError('Invalid URL format. Please enter a complete URL (e.g., https://example.com/image.jpg)');
      return;
    }

    setImagePreview(imageUrlInput);
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), imageUrlInput]
    }));
    setImageUrlInput('');
    setUploadError('');
  };

  // Remove image from array
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Move image position
  const handleMoveImage = (index, direction) => {
    const newImages = [...formData.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data with backward compatibility
    const submitData = {
      ...formData,
      image: formData.images && formData.images.length > 0 ? formData.images[0] : formData.image
    };
    
    if (editingService) {
      updateService(editingService.id, submitData);
    } else {
      addService(submitData);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };

  const handleToggleActive = (service) => {
    updateService(service.id, { ...service, active: !service.active });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1C2A3A', margin: '0 0 8px 0' }}>
            Services Manager
          </h1>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Manage your service offerings - {adminData.services.length} services
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {adminData.services.map((service) => {
          const serviceImages = service.images || (service.image ? [service.image] : []);
          return (
            <div
              key={service.id}
              className="admin-stat-card"
              style={{
                opacity: service.active ? 1 : 0.5,
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => handleOpenModal(service)}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                {serviceImages.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <img 
                      src={serviceImages[0]} 
                      alt={service.title}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {serviceImages.length > 1 && (
                      <div style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        marginTop: '4px',
                        textAlign: 'center'
                      }}>
                        +{serviceImages.length - 1} more image{serviceImages.length > 2 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
                <div className="admin-stat-icon purple" style={{ marginBottom: '16px' }}>
                  {service.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1C2A3A',
                  margin: '0 0 8px 0'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 16px 0',
                  lineHeight: '1.6'
                }}>
                  {service.description}
                </p>
                {service.link && (
                  <div style={{
                    fontSize: '13px',
                    color: '#7C5CFF',
                    marginBottom: '8px',
                    wordBreak: 'break-all'
                  }}>
                    🔗 {service.link}
                  </div>
                )}
              </div>

              {service.features && service.features.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  {service.features.map((feature, idx) => (
                    <div key={idx} style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      padding: '4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#7C5CFF' }}>✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#7C5CFF'
                }}>
                  {service.price}
                </div>
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={service.active}
                    onChange={() => handleToggleActive(service)}
                  />
                  <span className="admin-toggle-slider"></span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={handleCloseModal} className="admin-modal-close">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Service Title *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Icon</label>
                  <select
                    className="admin-form-select"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description *</label>
                  <textarea
                    className="admin-form-textarea"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    rows="4"
                  />
                </div>

                {/* IMAGE MANAGEMENT SECTION */}
                <div className="admin-form-group" style={{ 
                  border: '2px solid #E5E7EB', 
                  borderRadius: '8px', 
                  padding: '16px',
                  backgroundColor: '#F9FAFB'
                }}>
                  <label className="admin-form-label" style={{ marginBottom: '12px', display: 'block' }}>
                    <ImageIcon size={18} style={{ display: 'inline', marginRight: '8px' }} />
                    Service Images
                  </label>
                  
                  {/* Image Input Method Toggle */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setImageInputMethod('url')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: imageInputMethod === 'url' ? '2px solid #7C5CFF' : '1px solid #D1D5DB',
                        borderRadius: '6px',
                        backgroundColor: imageInputMethod === 'url' ? '#F3F0FF' : 'white',
                        color: imageInputMethod === 'url' ? '#7C5CFF' : '#6B7280',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <LinkIcon size={16} />
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMethod('upload')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: imageInputMethod === 'upload' ? '2px solid #7C5CFF' : '1px solid #D1D5DB',
                        borderRadius: '6px',
                        backgroundColor: imageInputMethod === 'upload' ? '#F3F0FF' : 'white',
                        color: imageInputMethod === 'upload' ? '#7C5CFF' : '#6B7280',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Upload size={16} />
                      Upload File
                    </button>
                  </div>

                  {/* URL Input */}
                  {imageInputMethod === 'url' && (
                    <div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="url"
                          className="admin-form-input"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="admin-btn admin-btn-primary"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Add Image
                        </button>
                      </div>
                      <small style={{ color: '#6B7280', fontSize: '12px' }}>
                        Enter a complete image URL and click "Add Image"
                      </small>
                    </div>
                  )}

                  {/* File Upload */}
                  {imageInputMethod === 'upload' && (
                    <div>
                      <label
                        style={{
                          display: 'block',
                          padding: '40px 20px',
                          border: '2px dashed #D1D5DB',
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: 'white',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#7C5CFF';
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <Upload size={32} style={{ margin: '0 auto 12px', color: '#7C5CFF' }} />
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </div>
                        <small style={{ color: '#6B7280', fontSize: '12px' }}>
                          JPG, PNG, or WEBP (max 5MB)
                        </small>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadError && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}>
                      {uploadError}
                    </div>
                  )}

                  {/* Current Images Display */}
                  {formData.images && formData.images.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ 
                        fontWeight: '500', 
                        marginBottom: '8px',
                        color: '#374151'
                      }}>
                        Current Images ({formData.images.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {formData.images.map((img, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px',
                              backgroundColor: 'white',
                              borderRadius: '6px',
                              border: '1px solid #E5E7EB'
                            }}
                          >
                            <img
                              src={img}
                              alt={`Service ${index + 1}`}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E?%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            <div style={{ flex: 1, fontSize: '13px', color: '#6B7280', wordBreak: 'break-all' }}>
                              {img.length > 50 ? img.substring(0, 50) + '...' : img}
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, 'up')}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                  }}
                                  title="Move up"
                                >
                                  ↑
                                </button>
                              )}
                              {index < formData.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, 'down')}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                  }}
                                  title="Move down"
                                >
                                  ↓
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  border: '1px solid #DC2626',
                                  borderRadius: '4px',
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  cursor: 'pointer'
                                }}
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Service Link URL</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.link || ''}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://example.com/service or /services/web-development"
                  />
                  <small style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    External link (https://...) or internal path (/page)
                  </small>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Link Button Text</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.link_text || 'Learn More'}
                    onChange={(e) => handleInputChange('link_text', e.target.value)}
                    placeholder="Learn More"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Features (comma-separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.features.join(', ')}
                    onChange={(e) => handleFeaturesChange(e.target.value)}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Price</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Starting at $2,999"
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => handleInputChange('active', e.target.checked)}
                    />
                    <span>Active Service</span>
                  </label>
                </div>
              </div>
              
              <div className="admin-modal-footer">
                <button type="button" onClick={handleCloseModal} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
