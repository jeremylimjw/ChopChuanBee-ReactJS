import { Form, Select, DatePicker } from 'antd'
import React, { useEffect } from 'react'

const LeaveForm = () => {
  const [leaveForm] = Form.useForm()
  const { RangePicker } = DatePicker
  const handleFinish = (values) => { }

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
    <div>
      <Form form={leaveForm} onFinish={handleFinish}>
        <Form.Item
          rules={[{ required: true, message: 'Select a leave type!' }]}
          label='Select leave type...'
          name='leaveType'
        >
          <Select>{processLeaveTypeOptions()}</Select>
        </Form.Item>
        <Form.Item

        >

        </Form.Item>
        <DateRangePicker></DateRangePicker>
      </Form>


    </div>
  )
}

export default LeaveForm
