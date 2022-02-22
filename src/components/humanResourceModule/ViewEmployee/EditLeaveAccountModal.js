import { Form, InputNumber, message, Modal } from 'antd'
import React, { useState } from 'react'
import { HRApiHelper } from '../../../api/humanResource';
import { getLeaveType } from '../../../enums/LeaveType';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';

export default function EditLeaveAccountModal({ employee, leaveAccounts, setLeaveAccounts, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const initialValues = leaveAccounts.reduce((prev, current) => {
        prev[`${current.id}`] = current.entitled_days;
        return prev;
    }, {})

    async function onFinish() {
        try {
            const values = await form.validateFields();
            const newLeaveAccounts = leaveAccounts.map(x => ({...x, entitled_days: values[x.id]}))

            setLoading(true);
            HRApiHelper.updateEmployeeLeaveAccounts(newLeaveAccounts)
                .then(() => {
                    setLeaveAccounts(newLeaveAccounts)
                    refreshBalances();
                    message.success(`Employee leaves successfully updated!`);
                    setLoading(false);
                    setIsModalVisible(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        } catch(err) { }
    }

    async function refreshBalances() {
        HRApiHelper.getLeaveAccountsById(employee.id)
            .then((results) => {
                setLeaveAccounts(results)
            })
            .catch(handleHttpError);
    }

    return (
        <Modal width={500} 
            title='Manage Entitled Leaves' 
            visible={isModalVisible} 
            onCancel={() => setIsModalVisible(false)}
            onOk={onFinish}
            okButtonProps={{ loading: loading }}
        >
            { leaveAccounts && 
                <>
                    <Form form={form} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} autoComplete="off" labelAlign="left" initialValues={initialValues}>
                        { leaveAccounts.map((item, idx) => (
                            <Form.Item key={idx} label={getLeaveType(item.leave_type_id).name} name={item.id} required={[REQUIRED]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            )
                        )}
                    </Form>
                </>
            }

        </Modal>
    )
}
