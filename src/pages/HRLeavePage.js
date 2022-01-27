import { Button, Modal } from 'antd'
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react'
import LeaveForm from '../components/leaveModule/LeaveForm'
import LeaveTable from '../components/leaveModule/LeaveTable'

const HRLeavePage = () => {
  const sampleLeaveData = [
    {
      startDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
      endDate: format(new Date(2022, 3, 3), 'yyyy-MM-dd'),
      leaveDays: 12,
      leaveType: 'Annual',
      leaveStatus: 'Pending'
    },
    {
      startDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
      endDate: format(new Date(2022, 3, 3), 'yyyy-MM-dd'),
      leaveDays: 12,
      leaveType: 'Annual',
      leaveStatus: 'Pending'
    }
  ]
  const [modalVisibility, setModalVisibility] = useState(false)
  const [leavesDataSource, setLeavesDataSource] = useState([])

  const submitLeaveForm = () => {
    // API call to submit leave form to DB
    setModalVisibility(false)
  }

  const getLeavesDataSource = () => {
    // Retrieve leaves data from DB
    let dataSrc = sampleLeaveData.map((value) => {
      return {
        ...value,
        duration: formatDuration(value.startDate, value.endDate)
      }
    })
    setLeavesDataSource(dataSrc)
  }

  const formatDuration = (startDate, endDate) => {
    return `From ${startDate} to ${endDate}`
  }

  useEffect(() => {
    getLeavesDataSource()
  }, []);

  return <div>
    <Button
      style={{ marginBottom: '20px' }}
      onClick={() => setModalVisibility(true)}
    >Create Leave Application</Button>
    <Modal
      title='Create Leave'
      visible={modalVisibility}
      onCancel={() => setModalVisibility(false)}
      footer={null}
      width={600}
    >
      <LeaveForm
        submitLeaveForm={submitLeaveForm}
      />
    </Modal>
    <LeaveTable
      leavesDataSource={leavesDataSource}
    />
  </div>
}

export default HRLeavePage
