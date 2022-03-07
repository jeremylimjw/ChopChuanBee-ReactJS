import React, { useState } from "react";
import { Form, Typography, Input, DatePicker, Divider, Modal, message } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons/lib/icons";
import { useApp } from "../../../providers/AppProvider";
import { AccountingAPIHelper } from "../../../api/AccountingAPIHelper";
import { REQUIRED } from "../../../utilities/form";

export default function NewBalanceSheetModal({ BalanceSheets, setBalanceSheets, isModalVisible, setIsModalVisible }) {
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
          AccountingAPIHelper.createBalanceSheet(values)
            .then(newBalanceSheet => {
              message.success('Balance Sheet has been successfully created!')
              setBalanceSheets([newBalanceSheet, ...BalanceSheets]);
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
            title="Create A Balance Sheet"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleOk} 
            width={600}
            destroyOnClose={true}
            okButtonProps={{ loading: loading }}  
        >
            <Form {...layout} form={form} autoComplete="off" labelAlign="left">
                <Form.Item
                    rules={[REQUIRED]}
                    label="Name"
                    name="name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    rules={[REQUIRED]}
                    label="End Date"
                    name="end_date"
                >
                    <DatePicker />
                </Form.Item>
            </Form>

        </Modal>
    );
    
}