import { Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import EmployeeTable from '../components/humanResourceModule/EmployeeTable';
import { employeeSampleData } from '../utilities/SampleData';

const HREmployeeManagementPage = () => {
    const [modalVisibility, setModalVisibility] = useState(false)
    const [employeesDataSource, setEmployeesDataSource] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading) {
            //getAllEmployeeData()
            initializeEmployeesDataSrc()
        } else {
            return
        }
    }, [loading])

    const initializeEmployeesDataSrc = () => {
        setEmployeesDataSource(employeeSampleData)
        setLoading(false)
    }


    return <div>
        <Typography.Title>Employee Management</Typography.Title>
        {loading ? <Spin /> : <EmployeeTable employeesDataSource={employeesDataSource} />}
    </div>
};

export default HREmployeeManagementPage;
