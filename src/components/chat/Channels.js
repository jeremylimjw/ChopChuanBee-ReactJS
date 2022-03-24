import { MoreOutlined, UserAddOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Collapse, Dropdown, List, Menu } from 'antd'
import React from 'react'

export default function Channels({ chat, setChat, setIsDirectModalVisible, setIsNewGroupModalVisible }) {

    function handleChannelClick(clickedChat) {
        if (chat?.id === clickedChat.id) return;
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
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item onClick={() => handleChannelClick(item)}>
                                <List.Item.Meta
                                    avatar={(
                                        <Badge offset={[0,10]} count={1}>
                                            <Avatar style={{ marginTop: 5 }} size="large" icon={<UserOutlined />} />
                                        </Badge>
                                    )}
                                    title={item.title}
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

const data = [
    {
        id: '1',
      title: 'Ant Design Title 1',
    },
    {
        id: '2',
      title: 'Ant Design Title 2',
    },
    {
        id: '3',
      title: 'Ant Design Title 3',
    },
    {
        id: '4',
      title: 'Ant Design Title 4',
    },
  ];
