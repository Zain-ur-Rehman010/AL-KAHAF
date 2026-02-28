// Frontend Configuration

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://al-kahaf-production.up.railway.app/api/v1';

const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',

  // Courses
  GET_COURSES: '/courses',
  GET_COURSE: (id) => `/courses/${id}`,
  CREATE_COURSE: '/courses',
  UPDATE_COURSE: (id) => `/courses/${id}`,
  DELETE_COURSE: (id) => `/courses/${id}`,

  // Users
  GET_USER: (id) => `/users/${id}`,
  UPDATE_USER: (id) => `/users/${id}`,
  GET_USER_PROFILE: (id) => `/users/${id}/profile`,

  // Instructors
  GET_INSTRUCTORS: '/instructors',
  GET_INSTRUCTOR: (id) => `/instructors/${id}`,
  GET_INSTRUCTOR_COURSES: (id) => `/instructors/${id}/courses`,
  GET_INSTRUCTOR_EARNINGS: (id) => `/instructors/${id}/earnings`,

  // Enrollments
  ENROLL_COURSE: '/enrollments',
  GET_ENROLLMENTS: '/enrollments',
};

const getFullUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

module.exports = {
  API_BASE_URL,
  API_ENDPOINTS,
  getFullUrl
};
