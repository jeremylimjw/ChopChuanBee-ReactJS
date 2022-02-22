import React from 'react';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import EmployeeTable from './EmployeeTable';

const ManageEmployeesPage = () => {
  
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

export default ManageEmployeesPage;
