import { MinusOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Divider, Form, Input, message, Radio, Select, Typography } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { ChargedUnderApiHelper } from '../../../api/ChargedUnderApiHelper';
import { CustomerApiHelper } from '../../../api/CustomerApiHelper';
import { useApp } from '../../../providers/AppProvider';
import { EMAIL, exactLength, minLength, NUMBER, REQUIRED } from '../../../utilities/form';

export default function NewCustomerModal({ isModalVisible, setIsModalVisible, customers, setCustomers }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [chargedUnders, setChargedUnders] = useState([]);
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        ChargedUnderApiHelper.get()
            .then(results => {
                setChargedUnders(results)
            })
            .catch(handleHttpError);
    }, [handleHttpError])
    

    async function handleOk() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            CustomerApiHelper.create(values)
                .then(newCustomer => {
                    message.success('Customer successfully created!')
                    setCustomers([newCustomer, ...customers]);
                    setLoading(false);
                    setIsModalVisible(false);
                    form.resetFields();
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <Modal title="Create a Customer" width={600}
            visible={isModalVisible} 
            onOk={handleOk} 
            onCancel={() => setIsModalVisible(false)} 
            bodyStyle={{ height: "60vh", overflowY: "scroll" }}
            okButtonProps={{ loading: loading }}
        >

            <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left">
                <Form.Item label="Company Name" name="company_name" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Address" name="address" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Postal Code" name="postal_code" rules={[REQUIRED, exactLength(6), NUMBER]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="company_email" rules={[EMAIL]}>
                    <Input />
                </Form.Item>

                <Form.Item name="gst_show" label="Show GST">
                    <Radio.Group defaultValue={null}>
                        <Radio value={null}>None</Radio>
                        <Radio value={false}>No</Radio>
                        <Radio value={true}>Yes</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="charged_under_id" label="Charged Under" initialValue={null}>
                    <Select style={{ width: 140 }}>
                        <Select.Option value={null}>None</Select.Option>
                        { chargedUnders.map((x, idx) => <Select.Option key={idx} value={x.id}>{x.name}</Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                </Form.Item>

                <Divider />
                <Typography.Title level={5}>Contact Person 1</Typography.Title>

                <Form.Item label="Name" name="p1_name" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Contact Number" name="p1_phone_number" rules={[REQUIRED, minLength(8)]}>
                    <Input />
                </Form.Item>

                <Divider />
                <div className='flex-last-left'>
                    <Typography.Title level={5}>Contact Person 2</Typography.Title>
                    <div>
                        { expand ? <MinusOutlined onClick={() => setExpand(false)} /> : <PlusOutlined onClick={() => setExpand(true)} />}
                    </div>
                </div>

                { expand && 
                    <>
                        <Form.Item label="POC 2" name="p2_name">
                            <Input />
                        </Form.Item>

                        <Form.Item label="POC 2 Number" name="p2_phone_number" rules={[minLength(8)]}>
                            <Input />
                        </Form.Item>
                    </>
                }

            </Form>

        </Modal>
    )
}
