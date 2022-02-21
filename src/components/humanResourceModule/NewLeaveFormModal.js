import { Form, Select, DatePicker, Modal, Input, Typography, message } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { EmployeeApiHelper } from '../../api/employees'
import { HRApiHelper } from '../../api/humanResource'
import { getLeaveAccount } from '../../enums/LeaveType'
import { useApp } from '../../providers/AppProvider'
import { REQUIRED } from '../../utilities/form'

export default function NewLeaveFormModal({ selectedEmployee, isModalVisible, setIsModalVisible, myCallback }) {

  const { handleHttpError } = useApp()
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState();
  const [allEmployees, setAllEmployees] = useState([]);
  const [leaveAccounts, setLeaveAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();

  // Init selected employee and employee search results
  useEffect(() => {
    if (isModalVisible && selectedEmployee) {
      setEmployee(selectedEmployee)
      form.setFieldsValue({ employee_id: selectedEmployee.id })
    }
    
    if (isModalVisible && !selectedEmployee) {
      onSearch('');
    }
  }, [isModalVisible, selectedEmployee, form, setEmployee])

  // Make sure leave account is binded to the selected employee
  useEffect(() => {
    if (employee) {
      setLeaveAccounts([]);
      setSelectedAccount(null);
      form.setFieldsValue({ leave_account_id: null })
      HRApiHelper.getLeaveAccountsById(employee.id)
        .then((results) => {
          setLeaveAccounts(results)
        })
        .catch(handleHttpError);
    }
  }, [employee, handleHttpError, setLeaveAccounts, form]);

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

  function onCancel() {
    setIsModalVisible(false);
    form.resetFields();
    setEmployee(null);
    setLeaveAccounts([]);
    setSelectedAccount(null);
  }

  async function onFinish() {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange

      const newApplication = {
        leave_account_id: values.leave_account_id,
        paid: true,
        start_date: startDate.format('YYYY-MM-DD HH:mm:ss'),
        end_date: endDate.format('YYYY-MM-DD HH:mm:ss'),
        remarks: values.remarks,
      }

      let numDays = endDate.diff(startDate, 'days')
      newApplication.num_days = calculateLeaveDays(startDate, numDays)

      setLoading(true);
      HRApiHelper.createNewLeaveApplication(newApplication)
        .then(result => {
          message.success('Application successfully created!')
          if (myCallback) {
            myCallback(result)
          }
          setLoading(false);
          onCancel();
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    } catch(err) { }
  }

  return (
    <Modal title='Create Leave Application'
        visible={isModalVisible}
        onCancel={onCancel}
        onOk={onFinish}
        width={600}
        okButtonProps={{ loading: loading }}
        destroyOnClose
    >
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" form={form}>

        {selectedEmployee == null ?
          <Form.Item rules={[REQUIRED]} label='Employee' name='employee_id'>
            <Select showSearch
              options={allEmployees.map(x => ({ label: x.name, value: x.id, employee: x }))}
              placeholder="Search Employee" 
              onSearch={onSearch}
              onSelect={(_, option) => setEmployee(option.employee)}
              filterOption={false}
            />
          </Form.Item>
          :
          <Form.Item rules={[REQUIRED]} label='Employee' name='employee_id'>
            <Typography.Title level={5}>{employee?.name}</Typography.Title>
          </Form.Item>
        }

        <Form.Item rules={[REQUIRED]} label='Select Leave Type' name='leave_account_id'>
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
          <DatePicker.RangePicker style={{ width: '100%' }} allowClear={false}
            placeholder={['Start Date', 'End Date']}
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
