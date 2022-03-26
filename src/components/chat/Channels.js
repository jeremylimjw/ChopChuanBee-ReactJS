import { UserAddOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Collapse, List, Spin } from 'antd'
import React from 'react'

export default function Channels({ loading, setLoading, channels, setChannels, chat, setChat, setIsDirectModalVisible, setIsNewGroupModalVisible }) {

    function handleChannelClick(clickedChat) {
        if (chat?.id === clickedChat.id) return;
        setChat(null);
        setChat(clickedChat);
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
                        renderItem={channel => (
                            <List.Item onClick={() => handleChannelClick(channel)}>
                                <List.Item.Meta
                                    avatar={(
                                        <Badge offset={[0,10]} count={1}>
                                            <Avatar style={{ marginTop: 5 }} size="large" icon={<UserOutlined />} />
                                        </Badge>
                                    )}
                                    title={channel.title}
                                    description="Ant Design, "
                                />
                            </List.Item>
                        )}
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
