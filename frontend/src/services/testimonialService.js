import api from './api';

const TESTIMONIALS_URL = '/testimonials';

// Public API - Get approved testimonials
export const getPublicTestimonials = async () => {
  try {
    const response = await api.get(TESTIMONIALS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    throw error;
  }
};

// Public API - Submit testimonial (no auth required)
export const submitTestimonial = async (testimonialData) => {
  try {
    const response = await api.post(`${TESTIMONIALS_URL}/submit`, testimonialData);
    return response.data;
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    throw error;
  }
};

// Admin API - Get all testimonials (requires authentication)
export const getAllTestimonials = async () => {
  try {
    const response = await api.get(`${TESTIMONIALS_URL}/admin/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    throw error;
  }
};

// Admin API - Create testimonial
export const createTestimonial = async (testimonialData) => {
  try {
    const response = await api.post(`${TESTIMONIALS_URL}/admin/create`, testimonialData);
    return response.data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

// Admin API - Update testimonial
export const updateTestimonial = async (id, testimonialData) => {
  try {
    const response = await api.put(`${TESTIMONIALS_URL}/admin/${id}`, testimonialData);
    return response.data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

// Admin API - Delete testimonial
export const deleteTestimonial = async (id) => {
  try {
    const response = await api.delete(`${TESTIMONIALS_URL}/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

// Client API - Submit testimonial for a project
export const submitClientTestimonial = async (projectId, testimonialData) => {
  try {
    const token = localStorage.getItem('client_token');
    const response = await api.post(
      `${TESTIMONIALS_URL}/client/submit?project_id=${projectId}`,
      testimonialData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting client testimonial:', error);
    throw error;
  }
};

// Client API - Get testimonial for a specific project
export const getProjectTestimonial = async (projectId) => {
  try {
    const token = localStorage.getItem('client_token');
    const response = await api.get(
      `${TESTIMONIALS_URL}/client/project/${projectId}/testimonial`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching project testimonial:', error);
    throw error;
  }
};

// Client API - Update client's own testimonial
export const updateClientTestimonial = async (testimonialId, testimonialData) => {
  try {
    const token = localStorage.getItem('client_token');
    const response = await api.put(
      `${TESTIMONIALS_URL}/client/testimonial/${testimonialId}`,
      testimonialData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating client testimonial:', error);
    throw error;
  }
};

// Client API - Get my testimonials
export const getMyTestimonials = async () => {
  try {
    const token = localStorage.getItem('client_token');
    const response = await api.get(
      `${TESTIMONIALS_URL}/client/my-testimonials`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching my testimonials:', error);
    throw error;
  }
};

export default {
  getPublicTestimonials,
  submitTestimonial,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  submitClientTestimonial,
  getProjectTestimonial,
  updateClientTestimonial,
  getMyTestimonials
};
