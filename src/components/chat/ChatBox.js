import { CloseOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Collapse, Comment } from 'antd'
import React, { useEffect } from 'react'
import moment from 'moment';

export default function ChatBox({ chat, setChat }) {

    useEffect(() => {
        console.log(chat.id)
        // pull texts here
    }, [chat])
    

    function handleCloseChatBox() {
        setChat(null);
    }

    return (
        <div className="chat-container" style={styles.chatWrapper}>
            <Collapse style={styles.collapse} defaultActiveKey={[]}>
                <Collapse.Panel extra={<Button type="text" style={styles.grey} shape="circle" icon={<CloseOutlined />} onClick={handleCloseChatBox} />}
                    header={
                        <>
                            <Badge status="success" offset={[0,5]} dot>
                                <Avatar size="small" icon={<UserOutlined />} />
                            </Badge>
                            <span style={{ marginLeft: 15 }}>{chat.title}</span>
                        </>
                    }
                >

                    <Comment
                        actions={[<span>Seen</span>]}
                        author={<a>Han Solo</a>}
                        avatar={<Avatar icon={<UserOutlined />} />}
                        content={
                            <p>
                            We supply a series of design principles, practical patterns and high quality design
                            resources (Sketch and Axure), to help people create their product prototypes beautifully
                            and efficiently.
                            </p>
                        }
                        datetime={
                            <span>{moment().fromNow()}</span>
                        }
                    />

                    <Comment
                        actions={[<span>Seen</span>]}
                        author={<a>Han Solo</a>}
                        avatar={<Avatar icon={<UserOutlined />} />}
                        content={
                            <p>
                            We supply a series of design principles, practical patterns and high quality design
                            resources (Sketch and Axure), to help people create their product prototypes beautifully
                            and efficiently.
                            </p>
                        }
                        datetime={
                            <span>{moment().fromNow()}</span>
                        }
                    />

                </Collapse.Panel>
            </Collapse>
        </div>
    )
}


const styles = {
    chatWrapper: {
        width: 336,
        marginRight: 20,
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