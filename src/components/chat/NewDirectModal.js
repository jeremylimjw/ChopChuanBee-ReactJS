import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Form, Input, List, Modal, Spin } from 'antd'
import debounce from 'lodash.debounce'
import React, { useState, useEffect } from 'react'
import { EmployeeApiHelper } from '../../api/EmployeeApiHelper'
import { getRole } from '../../enums/Role'
import { useApp } from '../../providers/AppProvider'

export default function NewDirectModal({ isModalVisible, setIsModalVisible }) {

    return (
        <Modal width={600} bodyStyle={{ paddingTop: 0, paddingBottom: 0, overflowY: 'scroll', height: '60vh' }}
          title='New Direct Message'
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose
        >
            <MyModalContent />
        </Modal>
    )
}

function MyModalContent() {

    const { handleHttpError } = useApp();

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)
    const [employees, setEmployees] = useState([])

    useEffect(() => {
        setLoading(true);
        EmployeeApiHelper.get({ status: true, order_by: 'name' })
            .then(results => {
                setEmployees(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setEmployees, setLoading])

    function onValuesChange(_, form) {
        EmployeeApiHelper.get({ ...form, status: true, order_by: 'name' })
            .then(results => {
                setEmployees(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function handleItemClick(employee) {
        console.log(employee);
    }

    return (
        <>
            <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                <Form.Item name="name" style={{ padding: '20px 0', width: '100%' }}>
                    <Input placeholder='Search Name' suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
            </Form>

            { loading && 
                <div style={{ textAlign: 'center' }}>
                    <Spin />
                </div>
            }

            <List className="new-direct-modal"
                itemLayout="horizontal"
                dataSource={employees}
                renderItem={item => (
                    <List.Item onClick={() => handleItemClick(item)}>
                        <List.Item.Meta
                            avatar={(
                                <Avatar style={{ marginTop: 5 }} size="large" icon={<UserOutlined />} />
                            )}
                            title={item.name}
                            description={getRole(item.role_id).name}
                        />
                    </List.Item>
                )}
            />
        </>
    )

}
