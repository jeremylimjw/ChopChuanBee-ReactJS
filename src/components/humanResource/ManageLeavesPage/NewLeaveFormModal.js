import { Form, Select, DatePicker, Modal, Input, Typography, message } from 'antd'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper'
import { HRApiHelper } from '../../../api/HRApiHelper'
import { getLeaveType } from '../../../enums/LeaveType'
import { useApp } from '../../../providers/AppProvider'
import { REQUIRED } from '../../../utilities/form'

export default function NewLeaveFormModal({ selectedEmployee, isModalVisible, setIsModalVisible, myCallback }) {

  const { handleHttpError } = useApp()
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState();
  const [allEmployees, setAllEmployees] = useState([]);
  const [leaveAccounts, setLeaveAccounts] = useState([]);

  const [selectedDays, setSelectedDays] = useState();
  
  const [publicHolidaysMap, setPublicHolidaysMap] = useState();

  useEffect(() => {
    HRApiHelper.getPublicHolidays()
      .then(results => {
        const map = results.records.reduce((prev, current) => ({ ...prev, [current.date]: 1 }), {})
        setPublicHolidaysMap(map)
      })
      .catch(handleHttpError)
      .catch(() => false)
  }, [handleHttpError, setPublicHolidaysMap])
  

  const onSearch = useCallback((name) => {
    EmployeeApiHelper.get({ name: name, limit: 10 })
      .then((results) => {
        setAllEmployees(results)
      })
      .catch(handleHttpError);
  },
  [handleHttpError, setAllEmployees])

  // Init selected employee and employee search results
  useEffect(() => {
    if (isModalVisible && selectedEmployee) {
      setEmployee(selectedEmployee)
      form.setFieldsValue({ employee_id: selectedEmployee.id })
    }
    
    if (isModalVisible && !selectedEmployee) {
      onSearch('');
    }
  }, [isModalVisible, selectedEmployee, form, setEmployee, onSearch])

  // Make sure leave account is binded to the selected employee
  useEffect(() => {
    if (employee) {
      setLeaveAccounts([]);
      form.setFieldsValue({ leave_account_id: null })
      HRApiHelper.getLeaveAccountsById(employee.id)
        .then((results) => {
          const options = results.map(x => ({ 
            label: `${getLeaveType(x.leave_type_id).name} (${x.balance} balance)`, 
            value: x.id, 
            leave_account: x 
          }))
          setLeaveAccounts(options)
        })
        .catch(handleHttpError);
    }
  }, [employee, handleHttpError, setLeaveAccounts, form]);

  function calculateDaysBetween(start, end) {
    const startDate = moment(start).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const endDate = moment(end).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const diff = {
      numDays: 0,
      weekends: 0,
      publicHolidays: 0,
    }

    while (startDate <= endDate) {
      if (startDate.day() === 6 || startDate.day() === 0) {
        diff.weekends++;
      } else if (publicHolidaysMap[startDate.format('YYYY-MM-DD')]) {
        diff.publicHolidays++;
      } else {
        diff.numDays++;
      }
      startDate.add(1, 'days');
    }
    return diff;
  }

  function onCalendarChange(dates) {
    if (dates[0] && dates[1]) {
      const diff = calculateDaysBetween(dates[0], dates[1]);
      setSelectedDays(diff)
      form.setFieldsValue({ num_days: diff.numDays });
    }
  }

  function onCancel() {
    setIsModalVisible(false);
    form.resetFields();
    setEmployee(null);
    setLeaveAccounts([]);
    setSelectedDays(null);
  }

  async function onFinish() {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange

      const newApplication = {
        leave_account_id: values.leave_account_id,
        paid: true,
        start_date: startDate.toDate(),
        end_date: endDate.toDate(),
        remarks: values.remarks,
        num_days: values.num_days,
      }

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
          <Select options={leaveAccounts}
              placeholder="Select Type" 
          />
        </Form.Item>

        <Form.Item label='Select Dates (Inclusive)' name='dateRange' rules={[REQUIRED]}>
          <DatePicker.RangePicker style={{ width: '100%' }} allowClear={false} loading={true}
            placeholder={['Start Date', 'End Date']}
            disabledDate={(prev) => (prev < moment().startOf('day'))}
            onCalendarChange={onCalendarChange}
          />
        </Form.Item>

        { selectedDays &&
          <Form.Item name="num_days" label="Selected Days" rules={[({ getFieldValue }) => 
            ({ validator(_, value) {
                if (value > 0) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Selected days must be more than 0.'));
              },
            })]}>
            <Typography.Text>
              {selectedDays.numDays} days
            </Typography.Text>
            <Typography.Text type='secondary'>
              {selectedDays.weekends > 0 && ` (Weekends: -${selectedDays.weekends})`}
              {selectedDays.publicHolidays > 0 && ` (Public holidays: -${selectedDays.publicHolidays} )`}
            </Typography.Text>
          </Form.Item>
        }

        <Form.Item label='Remarks' name='remarks'>
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>

      </Form>
    </Modal>
  )
}
