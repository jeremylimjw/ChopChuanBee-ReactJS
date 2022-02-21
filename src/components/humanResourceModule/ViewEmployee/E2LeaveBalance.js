import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, List } from 'antd';
import React, { useEffect, useState } from 'react'
import { HRApiHelper } from '../../../api/humanResource';
import { useApp } from '../../../providers/AppProvider';
import MyToolbar from '../../layout/MyToolbar';
import { View } from '../../../enums/View';
import EditLeaveAccountModal from './EditLeaveAccountModal';

export default function E2LeaveBalance({ employee, leaveAccounts, setLeaveAccounts }) {

    const { handleHttpError, hasWriteAccessTo } = useApp()

    const [isModalVisible, setIsModalVisible] = useState(false);
    
    return (
        <>
            <MyToolbar title="Leave Accounts">
                <Button onClick={() => setIsModalVisible(true)} icon={<EditOutlined/>} style={{ width: 85 }} disabled={!hasWriteAccessTo(View.HR.name)}>Edit</Button>
            </MyToolbar>
        
            <List itemLayout='horizontal' dataSource={leaveAccounts} renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta title={item.leave_type.name} description={`${item.balance} out of ${item.entitled_days} Days Remaining`}/>
                </List.Item>
                )}
            />
            
            <EditLeaveAccountModal 
                employee={employee}
                leaveAccounts={leaveAccounts} 
                setLeaveAccounts={setLeaveAccounts} 
                isModalVisible={isModalVisible} 
                setIsModalVisible={setIsModalVisible} 
            />
        </>
    )
}
