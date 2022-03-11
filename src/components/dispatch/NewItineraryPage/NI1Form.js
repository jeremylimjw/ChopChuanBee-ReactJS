import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, DatePicker, Form, Input, Select, Table } from 'antd';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { getRoleTag, Role } from '../../../enums/Role';
import { useApp } from '../../../providers/AppProvider';
import { exactLength, NUMBER, REQUIRED } from '../../../utilities/form';
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function NI1Form({ itinerary, setItinerary, selectedEmployee, setSelectedEmployee, step, setStep }) {

    const { handleHttpError } = useApp();

    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();
  
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        setLoading(true);
        EmployeeApiHelper.get({ status: true, role_id: Role.DRIVER.id })
            .then(results => {
                setEmployees(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])
  
    function onSearchFormValuesChange(_, form) {
        EmployeeApiHelper.get({ ...form, status: true, role_id: Role.DRIVER.id })
            .then(results => {
                setEmployees(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }
  
    function resetForm() {
      form.resetFields();
      onSearchFormValuesChange(null, form.getFieldsValue());
    }

    function handleRowSelect(_, selectedRows) {
        setSelectedEmployee(selectedRows[0]);
    }

    async function nextStep() {
        try {
            await form.validateFields();

            // call api to convert postal code here
            setItinerary({
                ...itinerary, 
                longitude: 0, 
                latitude: 0 
            })

            setStep(step+1);
        } catch (err) { }
    }

    function onFormValuesChange(_, values) {
        setItinerary(values);
    }

    return (
        <>
            <MyCard style={{ width: 450 }} title="Itinerary Details">

                <Form labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={form} autoComplete="off" labelAlign="left" onValuesChange={onFormValuesChange} initialValues={{...itinerary}}>
                    
                    <Form.Item name="start_time" label="Start Date" rules={[REQUIRED]}>
                        <DatePicker showTime format="DD/MM/YYYY, H:mm:ss a"/>
                    </Form.Item>

                    <Form.Item name="session" label="Session" rules={[REQUIRED]}>
                        <Select placeholder="Select Session">
                            <Select.Option value="AM">AM</Select.Option>
                            <Select.Option value="PM">PM</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Origin Postal Code" name="origin_postal_code" rules={[REQUIRED, NUMBER, exactLength(6)]}>
                        <Input />
                    </Form.Item>

                </Form>
            </MyCard>
            
            <MyCard>
                <MyToolbar title="All Drivers">
                    <Form form={searchForm} onValuesChange={debounce(onSearchFormValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="name">
                            <Input placeholder='Search Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                </MyToolbar>

                <Table loading={loading}
                rowSelection={{ type: 'radio', onChange: handleRowSelect, selectedRowKeys: [selectedEmployee?.id] }}
                columns={columns}
                dataSource={employees}
                pagination={{ pageSize: 6, showTotal: showTotal }}
                rowKey="id"
                />

                <MyToolbar style={{ marginTop: 15 }}>
                    <Button type="primary" onClick={nextStep} disabled={selectedEmployee.id == null}>Next</Button>
                </MyToolbar>

            </MyCard>
        </>
    )
}
  
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: 300,
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        title: 'Role',
        dataIndex: 'role_id',
        key: 'role_id',
        width: 100,
        align: 'center',
        ellipsis: true,
        render: (role_id) => getRoleTag(role_id),
        sorter: (a, b) => sortByNumber(a.role_id, b.role_id),
    },
    {
        title: 'Contact Number',
        dataIndex: 'contact_number',
        width: 250,
        ellipsis: true,
        render: (contact_number) => contact_number || '-',
        sorter: (a, b) => sortByString(a.contact_number, b.contact_number),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        ellipsis: true,
        render: (email) => email || '-',
        sorter: (a, b) => sortByString(a.email, b.email),
    },
];
