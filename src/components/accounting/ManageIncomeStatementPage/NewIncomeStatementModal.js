import React, { useState } from "react";
import { Form, Input, DatePicker, Modal, message } from "antd";
import { useApp } from "../../../providers/AppProvider";
import { AccountingAPIHelper } from "../../../api/AccountingAPIHelper";
import { REQUIRED } from "../../../utilities/form";

export default function NewIncomeStatementModal({ incomes, setIncomes, isModalVisible, setIsModalVisible }) {
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
            const [startDate, endDate] = values.dateRange
            const incomeStatement = {
              name: values.name,
              start_date: startDate.format('YYYY-MM-DD HH:mm:ss'),
              end_date: endDate.format('YYYY-MM-DD HH:mm:ss'),
              remarks: values.remarks,
            }
          setLoading(true);
          AccountingAPIHelper.createIncome(incomeStatement)
            .then(newIncome => {
              message.success('Income Statement has been successfully created!')
              setIncomes([newIncome, ...incomes]);
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
            title="Create An Income Statement"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleOk} 
            width={600}
            destroyOnClose={true}
            okButtonProps={{ loading: loading }}  
        >
            <Form {...layout} form={form} autoComplete="off" labelAlign="left">
            <Form.Item rules={[REQUIRED]} label="Name" name="name">
                <Input />
            </Form.Item>
            
            <Form.Item label='Date' name='dateRange' rules={[REQUIRED]}>
                <DatePicker.RangePicker style={{ width: '100%' }} allowClear={false} placeholder={['Start Date', 'End Date']}/>
            </Form.Item>

            <Form.Item
                label="Remarks"
                name="remarks"
            >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
            </Form>
        </Modal>
    );
    
}