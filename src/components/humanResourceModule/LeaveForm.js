import { Form, Select, DatePicker, Button, Modal, Input } from 'antd'
import React, { useEffect, useState } from 'react'

const LeaveForm = (props) => {
  const [leaveForm] = Form.useForm()
  const dateFormat = ''
  const { RangePicker } = DatePicker

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  // values is a JSON object that contains the form input values
  const handleFinish = (values) => {
    //props.submitLeaveForm(values)
  }

  useEffect(() => {
    // pull list of leave type from DB
  }, [])
  const leaveTypeList = {
    annual: 'Annual',
    compassionate: 'Compassionate',
    maternal: 'Maternal',
    sick: 'Sick',
    childCare: 'Child Care',
  }
  const processLeaveTypeOptions = () => {
    let leaveTypeOptions = Object.keys(leaveTypeList).map((option) => {
      return <Select.Option
        key={option}
        value={option}>
        {leaveTypeList[option]}
      </Select.Option>
    })
    return leaveTypeOptions
  }

  return (
    <Form

      layout='vertical'
      form={leaveForm}
      onFinish={handleFinish}>
      <Form.Item
        rules={[{ required: true, message: 'Select a leave type!' }]}
        label='Select leave type...'
        name='leaveType'
      >
        <Select>{processLeaveTypeOptions()}</Select>
      </Form.Item>
      <Form.Item
        label='Date'
        name='dateRange'
      >
        <RangePicker />
      </Form.Item>
      <Form.Item
        label='Remarks'
        name='remarks'
      >
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
      <Form.Item>
        <Button
          style={{ float: 'right' }}
          type='primary'
          htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LeaveForm
