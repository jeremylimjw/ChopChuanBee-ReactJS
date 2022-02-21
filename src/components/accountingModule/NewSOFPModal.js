import React, { useState } from "react";
import { Form, Typography, Input, DatePicker, Divider, Modal, message } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons/lib/icons";
import { AccountingAPIHelper } from "../../api/accounting";
import { REQUIRED } from "../../utilities/form";
import { useApp } from "../../providers/AppProvider";

export default function NewSupplierModal({ SOFPs, setSOFPs, isModalVisible, setIsModalVisible }) {
    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    async function handleOk() {
        try {
          const values = await form.validateFields();
          setLoading(true);
          AccountingAPIHelper.create(values)
            .then(newSOFP => {
              message.success('Statement of Financial Position has been successfully created!')
              setSOFPs([newSOFP, ...SOFPs]);
              setLoading(false);
              setIsModalVisible(false);
              form.resetFields();
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
        } catch (err) { }
    }

    return(
        <Modal
            title="Create A Supplier"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleOk} 
            width={600}
            destroyOnClose={true}
            bodyStyle={{ height: "60vh", overflowY: "scroll" }}
            okButtonProps={{ loading: loading }}  
        >
            <Form {...layout} form={form} autoComplete="off" labelAlign="left">
                <Form.Item
                    rules={[REQUIRED]}
                    label="Statement of Financial Position Title"
                    name="name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    rules={[REQUIRED]}
                    label="Date"
                    name="end_date"
                >
                    <DatePicker />
                </Form.Item>
            </Form>

        </Modal>
    );
    
}