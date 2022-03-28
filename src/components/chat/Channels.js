import { MessageFilled, UserAddOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Collapse, List, Spin } from 'antd'
import React from 'react'
import { useApp } from '../../providers/AppProvider';
import moment from 'moment';

export default function Channels({ loading, setLoading, channels, setChannels, selectedChatId, setSelectedChatId, setIsDirectModalVisible, setIsNewGroupModalVisible }) {

    const { user } = useApp();

    function handleChannelClick(clickedChat) {
        if (selectedChatId === clickedChat.id) return; // If chat already opened, do nothing
        setSelectedChatId(clickedChat.id);

        // Update unread_count
        const newChannels = [...channels]
        const index = newChannels.findIndex(x => x.id === clickedChat.id);
        if (index > -1) {
            newChannels[index] = {
                ...newChannels[index], 
                unread_count: 0, 
            }
            setChannels(newChannels);
        }
    }

    function renderChannel(channel) {
        if (channel.title == null) {
            const recipients = channel.participants.filter(x => x.employee_id !== user.id);
            
            return (
                <List.Item onClick={() => handleChannelClick(channel)}>
                    <List.Item.Meta
                        avatar={(
                            <Badge offset={[0,10]} count={channel.unread_count}>
                                <Avatar style={{ marginTop: 5 }} size="large" icon={<UserOutlined />} />
                            </Badge>
                        )}
                        title={<Badge status="success" text={recipients[0]?.employee.name || 'Unknown'} />}
                        description={channel.last_text && `${moment(channel.last_text).format('lll')} - ${channel.last_text.employee.name}: ${channel.last_text.text}`}
                    />
                </List.Item>
            )
        } else {
            return (
                <List.Item onClick={() => handleChannelClick(channel)}>
                    <List.Item.Meta
                        avatar={(
                            <Badge offset={[0,10]} count={channel.unread_count}>
                                <Avatar style={{ marginTop: 5 }} size="large" icon={<MessageFilled />} />
                            </Badge>
                        )}
                        title={channel.title}
                        description={channel.last_text && `${moment(channel.last_text).format('lll')} - ${channel.last_text.employee.name}: ${channel.last_text.text}`}
                    />
                </List.Item>
            )
        }
    }

    return (
        <div className="channels-container" style={styles.channelsWrapper}>
            <Collapse style={styles.collapse}>
                <Collapse.Panel header="Messaging" extra={
                    <>
                        <Button type="text" style={styles.grey} shape="circle" icon={<UserAddOutlined />} onClick={e => { e.stopPropagation(); setIsDirectModalVisible(true) }} />
                        <Button type="text" style={styles.grey} shape="circle" icon={<UsergroupAddOutlined />} onClick={e => { e.stopPropagation(); setIsNewGroupModalVisible(true) }} />
                    </>
                }>
                    { loading && 
                        <div style={{ textAlign: 'center', margin: 20 }}><Spin /></div>
                    }
                    <List
                        itemLayout="horizontal"
                        dataSource={channels}
                        renderItem={renderChannel}
                    />
                </Collapse.Panel>
            </Collapse>
        </div>
    )
}

const styles = {
    channelsWrapper: {
        width: 288,
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
    },
    collapse: {
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    },
    grey: {
        color: '#555',
    }
}
