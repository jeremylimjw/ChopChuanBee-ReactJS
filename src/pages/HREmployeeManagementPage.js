import { Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { EmployeeApiHelper } from '../api/employees';
import EmployeeTable from '../components/humanResourceModule/EmployeeTable';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout';
import { employeeSampleData } from '../utilities/SampleData';

const HREmployeeManagementPage = () => {
  const [employeesDataSource, setEmployeesDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const breadcrumbs = [
    { url: '/', name: 'Human Resource' },
    { url: '', name: 'Employees' }
  ]

  useEffect(() => {
    if (loading) {
      initializeEmployeesDataSrc()
    } else {
      return
    }
  }, [loading])

  const initializeEmployeesDataSrc = async () => {
    let data = await EmployeeApiHelper.getAllEmployees()
    setEmployeesDataSource(data)
    console.log(data)
    setLoading(false)
  }

  return <>
    <MyLayout
      breadcrumbs={breadcrumbs}
      bannerTitle='Employee Management'
    >
      <MyCard>
        {loading ? <Spin /> : <EmployeeTable employeesDataSource={employeesDataSource} />}
      </MyCard>
    </MyLayout>
  </>
};

export default HREmployeeManagementPage;
