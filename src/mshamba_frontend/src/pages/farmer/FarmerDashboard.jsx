import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../../components/Layout';

const FarmerDashboard = () => {
  return (
    <Layout userType="farmer">
      <Outlet />
    </Layout>
  );
};

export default FarmerDashboard;