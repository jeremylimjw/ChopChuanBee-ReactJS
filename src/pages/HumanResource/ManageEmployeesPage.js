import React from 'react';
import EmployeeTable from '../../components/humanResourceModule/ManageEmployee/EmployeeTable';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';

const HREmployeeManagementPage = () => {
  const breadcrumbs = [
    { url: '/humanResource/employees', name: 'Human Resource' },
    { url: '/humanResource/employees', name: 'Employees' }
  ]

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Employees'>

      <MyCard>
        <EmployeeTable />
      </MyCard>

    </MyLayout>
  )
};

export default HREmployeeManagementPage;
