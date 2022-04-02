import { CloseOutlined, MessageFilled, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Collapse, Comment, Divider, Form, Input, message, Space, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { REQUIRED } from '../../utilities/form';
import { useApp } from '../../providers/AppProvider';
import { ChatApiHelper } from '../../api/ChatApiHelper';
import { useChatProvider } from '../../providers/ChatProvider';
import { parseShortDateTime } from '../../utilities/datetime';

const LIMIT = 20;

export default function ChatBox({ chat, setChat, channels, setChannels, lastSeenStore, deleteChat }) {

    const { socket } = useChatProvider();
    const { user, handleHttpError } = useApp();

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)

    // Load the single channel
    useEffect(() => {
        // Reset values
        setPage(1);
        setHasMore(true);

        if (chat.texts.length < LIMIT) {
            setHasMore(false);
        }

    }, [chat.texts, setHasMore, setPage])
    

    useEffect(() => {
        if (!socket) return;
  
        // On a new user's changed last received timestamp
        socket.on("last_received", data => {
            const { channel_id, employee_id, timestamp } = data;

            if (channel_id !== chat.id) return;

            // Register his/her new timestamp
            const newParticipants = [...chat.participants];
            const index = newParticipants.findIndex(x => x.employee_id === employee_id);
            if (index > -1) {
                newParticipants[index] = {
                    ...newParticipants[index], 
                    last_received: timestamp 
                }
            }
            setChat({...chat, participants: newParticipants });
        })

        // On a new user's changed last read timestamp
        socket.on("last_read", data => {
            const { channel_id, employee_id, timestamp } = data;

            if (channel_id !== chat.id) return;
            
            // Register his/her new timestamp
            const newParticipants = [...chat.participants];
            const index = newParticipants.findIndex(x => x.employee_id === employee_id);
            if (index > -1) {
                newParticipants[index] = {
                    ...newParticipants[index], 
                    last_received: timestamp, 
                    last_read: timestamp 
                }
            }
            setChat({...chat, participants: newParticipants });
        })
  
        return () => {
            socket.off("last_received");
            socket.off("last_read");
        }
    
    }, [chat, setChat, socket])


    // TODO
    function handleNext() {
        if (loading) return;

        console.log('handleNext()')
        let newPageNo = page + 1;
        setPage(newPageNo)

        ChatApiHelper.getTexts({ channel_id: chat.id, limit: LIMIT, offset: newPageNo })
            .then(texts => {
                if (chat.texts.length < LIMIT) {
                    setHasMore(false);
                }

                const newTexts = [...chat.texts, ...texts];
                setChat({...chat, texts: newTexts });
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }


    function renderHeader() {
        if (chat.title == null) {
            const recipients = chat.participants.filter(x => x.employee_id !== user.id);

            return (
                <>
                    <Tooltip title={renderTooltip}>
                        <Badge status="success" offset={[0,20]} dot>
                            <Avatar size="small" icon={<UserOutlined />} />
                        </Badge>
                    </Tooltip>
                    <span style={{ marginLeft: 15 }}>{recipients[0]?.employee.name || 'Unknown'}</span>
                </>
            )
        } else {
            return (
                <>
                    <Tooltip title={renderTooltip}>
                        <Avatar size="small" icon={<MessageFilled />} />
                    </Tooltip>
                    <span style={{ marginLeft: 15 }}>{chat.title}</span>
                </>
            )
        }
    }

    function renderTooltip() {
        function getLastSeen(id) {
            if (!lastSeenStore[id]) return 'Offline';
            if (lastSeenStore[id] === 'Online') return 'Online';
            return parseShortDateTime(lastSeenStore[id]);
        }

        function isAdmin() {
            if (user.id === chat.owner_id) return true;
            return false;
        }

        function deleteChat(e) {
            if (e.stopPropagation) e.stopPropagation();
            
            setSubmitting(true);
            ChatApiHelper.deleteChannel(chat.id)
                .then(() => {
                    setSubmitting(false);
                    message.success('Chat successfully deleted!')

                    const newChannels = channels.filter(x => x.id !== chat.id);
                    setChannels(newChannels);
                    setChat(null);
                })
                .catch(handleHttpError)
                .catch(() => setSubmitting(false));
        }

        return (
            <Space direction='vertical' style={{ padding: 5 }}>
                { chat.participants.map((x, index) => 
                    <div key={index}>
                        { x.employee_id === user.id ? 
                            <Badge status="success" text={`${x.employee.name} - Online`} style={{ color: 'white'}} />
                            :
                            <Badge status={`${getLastSeen(x.employee_id) === 'Online' ? 'success' : 'default'}`} text={`${x.employee.name} - ${getLastSeen(x.employee_id)}`} style={{ color: 'white'}} />
                        }
                    </div>
                )}

                { chat.title != null &&
                    <>
                    { isAdmin() ? 
                        <Button type='danger' style={{ width: '100%' }} onClick={deleteChat}>Delete Chat</Button>
                        :
                        <Button type='danger' style={{ width: '100%' }}>Leave Chat</Button>
                    }
                    </>
                }
            </Space>
        )
    }


    function handleKeyDown(e) {
        // Submit on enter key, but ignore if shift+enter
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            onFinish(form.getFieldsValue());
            form.resetFields();
        }
    }

    async function onFinish(values) {
        try {
            await form.validateFields();

            const text = {
                text: values.text,
                employee_id: user.id,
                channel_id: chat.id,
            }

            setSubmitting(true);
            ChatApiHelper.createText(text)
                .then(newText => {
                    // Add new text in chatbox
                    const newTexts = [newText, ...chat.texts];
                    setChat({...chat, texts: newTexts });
                    
                    // Update last text in channel list
                    const newChannels = [...channels]
                    const index = newChannels.findIndex(x => x.id === newText.channel_id);
                    if (index > -1) {
                        newChannels[index] = {
                            ...newChannels[index], 
                            last_text: newText, 
                        }
                    }
                    
                    // Shift channel to first item of the array list
                    const channel = newChannels.splice(index, 1);
                    setChannels([...channel, ...newChannels])

                    setSubmitting(false);
                })
                .catch(handleHttpError)
                .catch(() => setSubmitting(false));

        } catch(err) { }
    }

    return (
        <>
            { chat != null && 
            <div className="chat-container" style={styles.chatWrapper}>
                <Collapse style={styles.collapse} defaultActiveKey={['first-panel']}>
                    <Collapse.Panel 
                        key="first-panel" 
                        extra={<Button type="text" style={styles.grey} shape="circle" icon={<CloseOutlined />}
                        onClick={() => setChat(null)} />}
                        header={renderHeader()}
                    >

                        { loading && 
                            <div style={{ textAlign: 'center', margin: 20 }}><Spin /></div>
                        }

                        <div id="scrollableDiv"
                            style={{
                                height: '100%',
                                overflow: 'auto',
                                padding: '8px 16px',
                                display: 'flex',
                                flexDirection: 'column-reverse',
                            }}
                        >
                            <InfiniteScroll
                                style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'hidden' }} //To put endMessage and loader to the top.
                                dataLength={chat.texts.length}
                                next={handleNext}
                                hasMore={hasMore}
                                inverse={true}
                                loader={<div style={{ textAlign: 'center' }}><Spin /></div>}
                                endMessage={<Divider plain>End of results</Divider>}
                                scrollableTarget="scrollableDiv"
                            >
                                { chat.texts.map((x, index) => (
                                    <Comment key={index}
                                        actions={[(
                                            <>
                                            { x.employee_id === user.id && 
                                            <span>
                                                { isRead(user, chat.participants, x) ?
                                                    "Seen"
                                                    :
                                                    <>
                                                    { isReceived(user, chat.participants, x) ?
                                                        "Received"
                                                        :
                                                        "Sent"
                                                    }
                                                    </>
                                                }
                                            </span>
                                            }
                                            </>
                                        )]}
                                        author={x.employee.name}
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        content={
                                            <p>{x.text}</p>
                                        }
                                        datetime={
                                            <span>{moment(x.created_at).fromNow()}</span>
                                        }
                                    />
                                )
                                )}
                            </InfiniteScroll>
                        </div>
                        
                        <Form form={form} onFinish={onFinish}>
                            <Form.Item style={{ margin: 0 }} name="text" rules={[REQUIRED]}>
                                <Input.TextArea onKeyDown={handleKeyDown} />
                            </Form.Item>
                            <Form.Item style={{ margin: 0 }}>
                                <Button htmlType='submit' style={{ width: '100%' }} type="primary" loading={submitting}>Send</Button>
                            </Form.Item>
                        </Form>

                    </Collapse.Panel>
                </Collapse>
            </div>
            }
        </>
    )
}


function isReceived(user, participants, text) {
    for (let participant of participants) {
        if (participant.employee_id !== user.id && participant.last_received < text.created_at) {
            return false;
        }

    }
    return true;
}


function isRead(user, participants, text) {
    for (let participant of participants) {
        if (participant.employee_id !== user.id && participant.last_read < text.created_at) {
            return false;
        }

    }
    return true;
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