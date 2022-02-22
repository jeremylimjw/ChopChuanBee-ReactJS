import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, message, Radio } from 'antd'
import React, { useState } from 'react'
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyToolbar from '../../common/MyToolbar';

export default function A2Form({ employee, setEmployee }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();
    
    const initialValues = employee.access_rights.reduce((prev, current) => {
        prev[current.view_id] = current.has_write_access;
        return prev;
    }, {})

    function onFinish() {
        const accessRights = Object.keys(form.getFieldsValue())
            .map(key => ({ view_id: key, has_write_access: form.getFieldValue(key)}))
            .filter(x => x.has_write_access != null);

        setLoading(true);
        EmployeeApiHelper.updateAccessRights(employee.id, accessRights)
            .then(() => {
                setEmployee({...employee, access_rights: accessRights});
                message.success(`Employee access rights successfully updated!`);
                setLoading(false);
                setEditing(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    return (
        <>
            <MyToolbar title="Access Rights">
                { hasWriteAccessTo(View.ADMIN.name) && 
                <Form.Item>
                    { editing ? 
                        <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                        :
                        <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }}>Edit</Button>
                    }
                </Form.Item>
                }
            </MyToolbar>

            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off" labelAlign="left" initialValues={initialValues}>
                { Object.keys(View)
                    .filter(x => x !== 'ADMIN' && x !== 'GENERAL')
                    .map((key, idx) => <Form.Item key={idx} label={View[key].name} name={View[key].id} initialValue={undefined}>
                            <Radio.Group disabled={!editing}>
                                <Radio value={undefined}>None</Radio>
                                <Radio value={false}>View Only</Radio>
                                <Radio value={true}>Full Access</Radio>
                            </Radio.Group>
                        </Form.Item>
                    )
                }
            </Form>
        </>
    )
}
