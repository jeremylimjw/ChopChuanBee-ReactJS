import { Form, Select, DatePicker, Button, Modal, Input, Typography, Space, Divider, InputNumber, message } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { EmployeeApiHelper } from '../../../api/employees'
import { HRApiHelper } from '../../../api/humanResource'
import { getLeaveAccount } from '../../../enums/LeaveType'
import { useApp } from '../../../providers/AppProvider'
import { REQUIRED } from '../../../utilities/form'

const NewLeaveForm = (props) => {

  const { handleHttpError } = useApp()
  const [form] = Form.useForm()

  const [employee, setEmployee] = useState();
  const [allEmployees, setAllEmployees] = useState([]);
  const [leaveAccounts, setLeaveAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();

  useEffect(() => {
    if (props.selectedEmployee) {
      setEmployee(props.selectedEmployee)
    }
  }, [setEmployee])

  useEffect(() => {
    if (employee) {
      HRApiHelper.getLeaveAccountsById(employee.id)
        .then((results) => {
          setLeaveAccounts(results)
        })
        .catch(handleHttpError);
    }
  }, [employee, handleHttpError, setLeaveAccounts]);

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

  // const countRequestedDays = (values) => {
  //   let [start, end] = [...values]
  //   if (start && end) {
  //     let days = end.diff(start, 'days')
  //     days = calculateLeaveDays(start, days)
  //   } else {
  //     return
  //   }
  // }

  function onSearch(value) {
    EmployeeApiHelper.get({ name: value, limit: 10 })
      .then((results) => {
        setAllEmployees(results)
      })
      .catch(handleHttpError);
  }

  async function onFinish() {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange
      let numDays = endDate.diff(startDate, 'days')
      numDays = calculateLeaveDays(startDate, numDays)

      const newApplication = {
        employee_id: values.employee_id,
        leave_account_id: values.leave_type_id,
        paid: true,
        start_date: startDate.format('YYYY-MM-DD HH:mm:ss'),
        end_date: endDate.format('YYYY-MM-DD HH:mm:ss'),
        remarks: values.remarks,
        num_days: numDays,
      }
      
      if (props.myCallback) {
        props.myCallback(newApplication)
      }
      // submitLeaveApplicationForm(leaveApplication)
      // form.resetFields()
      // setSelectedLeaveBal(0)
    } catch(err) { }
  }

  return (
    <Modal title='Create Leave'
        visible={props.isModalVisible}
        onCancel={() => props.setIsModalVisible(false)}
        onOk={onFinish}
        width={600}
        destroyOnClose
    >
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" form={form}>

        {props.freeFlow || employee == null ?
          <Form.Item rules={[REQUIRED]} label='Employee' name='employee_id'>
            <Select showSearch style={{ width: 280 }}
              options={allEmployees.map(x => ({ label: x.name, value: x.id, employee: x }))}
              placeholder="Search Employee" 
              onSearch={onSearch}
              onSelect={(_, option) => setEmployee(option.employee)}
              filterOption={false}
            />
          </Form.Item>
          :
          <Form.Item rules={[REQUIRED]} label='Employee' name='employee_id' initialValue={employee.id}>
            <Typography.Title level={5}>{employee.name}</Typography.Title>
          </Form.Item>
        }

        <Form.Item rules={[REQUIRED]} label='Select Leave Type' name='leave_type_id'>
          <Select options={leaveAccounts.map(x => ({ label: getLeaveAccount(x.leave_type_id).name, value: x.id, leave_account: x }))}
              placeholder="Select Type" 
              onSelect={(_, option) => setSelectedAccount(option.leave_account)}
          />
        </Form.Item>

        { selectedAccount &&
          <Form.Item wrapperCol={{ offset: 10 }} >
            <Typography.Text>Current Leave Balance: {selectedAccount.balance}</Typography.Text>
          </Form.Item>
        }

        <Form.Item label='Date' name='dateRange' rules={[REQUIRED]}>
          <DatePicker.RangePicker
            placeholder={['Start Date', 'End Date']}
            allowClear={false}
            
            disabledDate={(prev) => (prev < moment().startOf('day'))}
          // onCalendarChange={(values) => countRequestedDays(values)}
          />
        </Form.Item>

        <Form.Item label='Remarks' name='remarks'>
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default NewLeaveForm
