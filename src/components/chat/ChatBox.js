import { CloseOutlined, CommentOutlined, MessageFilled, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Collapse, Comment, Divider, Form, Input, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { REQUIRED } from '../../utilities/form';

const LIMIT = 10;

const tempTexts = [
    {
        text: `We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.`
    },
    {
        text: `We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.`
    },
    {
        text: `We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.`
    },
    {
        text: `We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.`
    },
]

export default function ChatBox({ chat, setChat }) {

    const [form] = Form.useForm();

    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [texts, setTexts] = useState(tempTexts)

    useEffect(() => {
        console.log(chat.id)
        // Reset values
        setPage(1);
        setHasMore(true);
        // getEmployees(form);
        setTexts(tempTexts);

        // pull texts here
    }, [chat])

    function handleNext() {
        console.log('handleNext()')
        setTimeout(() => setHasMore(false), 1000);
    }

    function handleKeyDown(e) {
        // Submit on enter key, but ignore if shift+enter
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            onFinish(form.getFieldsValue());
            form.resetFields();
        }
    }

    function renderHeader() {
        return (
            <>
                <Tooltip title={renderTooltip}>
                    <Badge status="success" offset={[0,20]} dot>
                        {/* <Avatar size="small" icon={<UserOutlined />} /> */}
                        <Avatar size="small" icon={<MessageFilled />} />
                    </Badge>
                </Tooltip>
                <span style={{ marginLeft: 15 }}>{chat.title}</span>
            </>
        )
    }

    function renderTooltip() {
        return (
            <>
                <Badge status="success" text="Dave - Online" style={{ color: 'white'}} />
                <br />
                <Badge status="default" text="John - 23/3 8:00 AM" style={{ color: 'white'}} />
                <br />
            </>
        )
    }

    async function onFinish(values) {
        try {
            await form.validateFields();
            console.log(values)

        } catch(err) { }
    }

    return (
        <div className="chat-container" style={styles.chatWrapper}>
            <Collapse style={styles.collapse} defaultActiveKey={['first-panel']}>
                <Collapse.Panel 
                    key="first-panel" 
                    extra={<Button type="text" style={styles.grey} shape="circle" icon={<CloseOutlined />}
                    onClick={() => setChat(null)} />}
                    header={renderHeader()}
                >

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
                            dataLength={texts.length}
                            next={handleNext}
                            hasMore={hasMore}
                            inverse={true}
                            loader={<div style={{ textAlign: 'center' }}><Spin /></div>}
                            endMessage={<Divider plain>End of results</Divider>}
                            scrollableTarget="scrollableDiv"
                        >
                            { texts.map(x => (
                                <Comment
                                    actions={[<span>Seen</span>]}
                                    author={<a>Han Solo</a>}
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    content={
                                        <p>{x.text}</p>
                                    }
                                    datetime={
                                        <span>{moment().fromNow()}</span>
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
                            <Button htmlType='submit' style={{ width: '100%' }} type="primary">Send</Button>
                        </Form.Item>
                    </Form>

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