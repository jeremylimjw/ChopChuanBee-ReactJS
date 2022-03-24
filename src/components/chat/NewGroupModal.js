import { Form, Input, Modal, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { EmployeeApiHelper } from '../../api/EmployeeApiHelper'
import { useApp } from '../../providers/AppProvider'
import { REQUIRED } from '../../utilities/form'

export default function NewGroupModal({ isModalVisible, setIsModalVisible }) {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)

    async function handleSubmitEvent() {
        try {
            const values = await form.validateFields();

            setLoading(true);
            console.log(values);
            setLoading(true);
        } catch (err) { }
    }

    return (
        <Modal width={600} bodyStyle={{ paddingBottom: 0 }}
          title='New Group Chat'
          visible={isModalVisible}
          onOk={handleSubmitEvent}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ loading: loading }}
          destroyOnClose
        >
            <MyModalContent form={form} />
        </Modal>
    )
}

function MyModalContent({ form }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false)
    const [employees, setEmployees] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        setLoading(true);
        EmployeeApiHelper.get({ status: true, order_by: 'name' })
            .then(results => {
                setEmployees(results);
                setOptions(results.map(x => ({ label: x.name, value: x.id, employee: x })));
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setEmployees, setOptions, setLoading])

    function onSearch(value) {
        const filtered = employees.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) >= 0);
        setOptions(filtered.map(x => ({ label: x.name, value: x.id, employee: x })));
    }

    return (
        <>
            <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} autoComplete="off" labelAlign="left">
                <Form.Item label="Title" name="title" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Participants" name="participants" rules={[REQUIRED]}>
                    <Select loading={loading}
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select employees"
                        options={options}
                        onSearch={onSearch}
                        filterOption={false}
                    />
                </Form.Item>
            </Form>
        </>
    )

}
