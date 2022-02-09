import React, { useEffect, useState } from 'react';
import { ReloadOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, InputNumber, Space, Spin } from 'antd';
import { useApp } from '../../providers/AppProvider'

const LeaveAccountForm = (props) => {
  const [form] = Form.useForm()
  const [initialFormValues, setInitialFormValues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loading) {
      let initialValues = processInitialValues()
      setInitialFormValues(initialValues)
      setLoading(false)
    }
  }, [])

  const processInitialValues = () => {
    let initialValues
    props.leaveAccountList.forEach((value) => {
      initialValues = {
        ...initialValues,
        [value.leave_type.id]: `${value.entitled_days}`
      }
    })
    console.log(props.leaveAccountList)
    return initialValues
  }

  const onFinish = (values) => {
    let processedValues = { ...values }
    for (const id in values) {
      if (!values[id]) {
        processedValues[id] = 0
      }
    }
    props.updateEntitledLeaves(processedValues)
    setInitialFormValues(processedValues) // Initial form values
    form.resetFields() // Reset field to initial form values
  }

  return <div>
    {!loading ?
      <Form
        layout='vertical'
        form={form}
        initialValues={initialFormValues}
        onFinish={onFinish}>
        <Form.Item
          label='Annual Leave'
          name='1'
        >
          <Space>
            <InputNumber
              min={0}
              defaultValue={initialFormValues['1']}
              addonAfter={'Days'} />
          </Space>
        </Form.Item>
        <Form.Item
          label='Compassionate Leave'
          name='2'
        >
          <Space>
            <InputNumber
              min={0}
              defaultValue={initialFormValues['2']}
              addonAfter={'Days'} />
          </Space>
        </Form.Item>
        <Form.Item
          label='Maternity / Paternity Leave'
          name='3'
        >
          <Space>
            <InputNumber
              min={0}
              defaultValue={initialFormValues['3']}
              addonAfter={'Days'} />
          </Space>
        </Form.Item>
        <Form.Item
          label='Sick Leave'
          name='4'
        >
          <Space>
            <InputNumber
              min={0}
              defaultValue={initialFormValues['4']}
              addonAfter={'Days'} />
          </Space>
        </Form.Item>
        <Form.Item
          label='Childcare Leave'
          name='5'
        >
          <Space>
            <InputNumber
              min={0}
              defaultValue={initialFormValues['5']}
              addonAfter={'Days'} />
          </Space>
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
      :
      <Spin />
    }
  </div>;
};

export default LeaveAccountForm;
