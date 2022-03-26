import { Form, Input, message, Modal, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { ChatApiHelper } from '../../api/ChatApiHelper'
import { EmployeeApiHelper } from '../../api/EmployeeApiHelper'
import { useApp } from '../../providers/AppProvider'
import { REQUIRED } from '../../utilities/form'

export default function NewGroupModal({ isModalVisible, setIsModalVisible, handleNewChannelEvent }) {

    const { user, handleHttpError } = useApp();

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)

    async function handleSubmitEvent() {
        try {
            if (user === null) return;
            const values = await form.validateFields();

            const channel = {
                title: values.title,
                participants: values.participants.map(id => ({ employee_id: id })),
                owner_id: user.id,
            }
    
            setLoading(true);
            ChatApiHelper.createChannel(channel)
                .then(newChannel => {
                    setLoading(false);
                    handleNewChannelEvent(newChannel)
                    setIsModalVisible(false);
                    message.success("New chat group successfully created!");
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
                
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
