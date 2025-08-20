import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../../components/Layout';

const InvestorDashboard = () => {
  return (
    <Layout userType="investor">
      <Outlet />
    </Layout>
  );
};

export default InvestorDashboard;