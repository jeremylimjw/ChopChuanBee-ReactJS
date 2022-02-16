import { Form, Select, DatePicker, Button, Modal, Input, Typography, Space, Divider, InputNumber } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const LeaveForm = (props) => {
  const [leaveForm] = Form.useForm()
  const employeeList = props.employeeList || []
  const [selectedLeaveBal, setSelectedLeaveBal] = useState(0)
  const [selectedLeaveAccounts, setSelectedLeaveAccounts] = useState([])
  const { RangePicker } = DatePicker
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  useEffect(() => {
    employeeList.length === 0 ? setSelectedLeaveAccounts(props.leaveAccounts) : setSelectedLeaveAccounts([])
  }, [])

  // Updates current leave balance in situations where user 
  // changes the selected employee after choosing an employee AND the leave type
  useEffect(() => {
    renderLeaveBalance(leaveForm.getFieldValue('leaveTypeId'))
  }, [selectedLeaveAccounts])

  const leaveTypeList = {
    1: 'Annual',
    2: 'Compassionate',
    3: 'Maternal / Paternal',
    4: 'Sick',
    5: 'Child Care',
  }

  // values is a JSON object that contains the form input values
  const handleFinish = (values) => {
    let employee_id = props.selectedEmployee ? props.selectedEmployee.id : values.employee_id
    let [startDate, endDate] = values.dateRange
    let leaveApplication = {
      leave_account_id: mapLeaveAccountId(employee_id, parseInt(values.leaveTypeId)),
      paid: true,
      start_date: startDate.format('YYYY-MM-DD HH:mm:ss'),
      end_date: endDate.format('YYYY-MM-DD HH:mm:ss'),
      remarks: values.remarks
    }
    let numDays = endDate.diff(startDate, 'days')
    numDays = calculateLeaveDays(startDate, numDays)
    leaveApplication = {
      ...leaveApplication,
      num_days: numDays
    }
    props.submitLeaveApplicationForm(leaveApplication)
    leaveForm.resetFields()
    setSelectedLeaveBal(0)
  }

  const mapLeaveAccountId = (employeeId, leaveTypeId) => {
    let leave_account_id = props.leaveAccounts.find((element) => element.leave_type.id === leaveTypeId && element.employee_id === employeeId)
    return leave_account_id.id
  }

  const calculateLeaveDays = (date, totalDays) => {
    let startDate = date
    let numDays = 1
    while (totalDays !== 0) {
      startDate.add(1, 'days')
      if (startDate.isoWeekday() !== 6 && startDate.isoWeekday() !== 7) {
        numDays++
      }
      totalDays--
    }
    return numDays
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

  const filterEmployeeLeaveAccounts = (employee_id) => {
    let filteredArr = props.leaveAccounts.filter((element) => element.employee_id === employee_id)
    setSelectedLeaveAccounts(filteredArr)
  }

  const renderLeaveBalance = (value) => {
    let balance = selectedLeaveAccounts.filter((element) => element.leave_type.id === parseInt(value))
    if (balance.length > 0) {
      setSelectedLeaveBal(balance[0].entitled_days)
    } else {
      setSelectedLeaveBal(0)
    }
    leaveForm.setFieldsValue({ leaveTypeId: value })
  }

  return (
    <Form
      {...layout}
      layout='vertical'
      form={leaveForm}
      onFinish={handleFinish}>
      <Form.Item
        rules={[{ required: props.selectedEmployee ? false : true, message: 'Select an employee!' }]}
        label='Employee Name'
        name='employee_id'
      >
        {props.selectedEmployee ?
          <Typography.Title level={5}>{props.selectedEmployee.name}</Typography.Title>
          : <Select
            showSearch={true}
            placeholder='Select employee...'
            optionFilterProp="children"
            onSelect={(e) => filterEmployeeLeaveAccounts(e)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {employeeList.map((value) => {
              return (<Select.Option
                value={value.id}>
                {value.name}
              </Select.Option>)
            })}
          </Select>
        }

      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Select a leave type!' }]}
        label='Select leave type...'
        name='leaveTypeId'
      >
        <p>Current Leave Balance: {selectedLeaveBal}</p>
        <Select
          onSelect={e => renderLeaveBalance(e)}>
          {processLeaveTypeOptions()}
        </Select>

      </Form.Item>
      <Form.Item
        label='Date'
        name='dateRange'
      >
        <RangePicker
          placeholder={['Start Date', 'End Date']}
          rules={[{ required: true, message: 'Select a date!' }]}
          disabledDate={(prev) => (prev < moment().startOf('day'))}
        />
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
