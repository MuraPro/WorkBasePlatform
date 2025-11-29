import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getIsLoggedIn, getUsersLoadingStatus } from '@entities/user';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const isLoaded = useSelector(getUsersLoadingStatus);

  if (!isLoaded) return null;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
