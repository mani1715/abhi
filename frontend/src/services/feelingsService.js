import api from './api';

// ============================================
// FEELINGS SERVICES
// ============================================

export const getAllFeelingsServices = async (activeOnly = false) => {
  const response = await api.get(`/feelings-services/?active_only=${activeOnly}`);
  return response.data;
};

export const getFeelingsService = async (serviceId) => {
  const response = await api.get(`/feelings-services/${serviceId}`);
  return response.data;
};

export const createFeelingsService = async (serviceData) => {
  const response = await api.post('/feelings-services/', serviceData);
  return response.data;
};

export const updateFeelingsService = async (serviceId, serviceData) => {
  const response = await api.put(`/feelings-services/${serviceId}`, serviceData);
  return response.data;
};

export const deleteFeelingsService = async (serviceId) => {
  const response = await api.delete(`/feelings-services/${serviceId}`);
  return response.data;
};

// ============================================
// SERVICE REQUESTS
// ============================================

export const createServiceRequest = async (requestData) => {
  const response = await api.post('/feelings-services/requests', requestData);
  return response.data;
};

export const getAllServiceRequests = async (statusFilter = null) => {
  const params = statusFilter ? `?status_filter=${statusFilter}` : '';
  const response = await api.get(`/feelings-services/requests${params}`);
  return response.data;
};

export const getServiceRequest = async (requestId) => {
  const response = await api.get(`/feelings-services/requests/${requestId}`);
  return response.data;
};

export const updateServiceRequest = async (requestId, updateData) => {
  const response = await api.put(`/feelings-services/requests/${requestId}`, updateData);
  return response.data;
};

// ============================================
// GENERATED LINKS
// ============================================

export const generateLink = async (linkData) => {
  const response = await api.post('/feelings-services/links', linkData);
  return response.data;
};

export const getAllGeneratedLinks = async (activeOnly = false) => {
  const response = await api.get(`/feelings-services/links?active_only=${activeOnly}`);
  return response.data;
};

export const getGeneratedLink = async (linkId) => {
  const response = await api.get(`/feelings-services/links/${linkId}`);
  return response.data;
};

export const updateGeneratedLink = async (linkId, updateData) => {
  const response = await api.put(`/feelings-services/links/${linkId}`, updateData);
  return response.data;
};

export const deleteGeneratedLink = async (linkId) => {
  const response = await api.delete(`/feelings-services/links/${linkId}`);
  return response.data;
};

// ============================================
// PUBLIC LINK ACCESS
// ============================================

export const accessPublicLink = async (shortCode) => {
  const response = await api.get(`/feelings-services/public/${shortCode}`);
  return response.data;
};
