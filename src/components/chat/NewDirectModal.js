import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Divider, Form, Input, List, message, Modal, Spin } from 'antd'
import debounce from 'lodash.debounce'
import React, { useState, useEffect, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ChatApiHelper } from '../../api/ChatApiHelper'
import { EmployeeApiHelper } from '../../api/EmployeeApiHelper'
import { getRole } from '../../enums/Role'
import { useApp } from '../../providers/AppProvider'

const LIMIT = 10;

export default function NewDirectModal({ channels, isModalVisible, setIsModalVisible, handleNewChannelEvent }) {

    return (
        <Modal width={600} bodyStyle={{ paddingTop: 0, paddingBottom: 0, height: '60vh' }}
          title='New Direct Message'
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose
        >
            <MyModalContent 
                channels={channels}
                setIsModalVisible={setIsModalVisible}
                handleNewChannelEvent={handleNewChannelEvent}
            />
        </Modal>
    )
}

function MyModalContent({ channels, setIsModalVisible, handleNewChannelEvent }) {

    const { user, handleHttpError } = useApp();

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [employees, setEmployees] = useState([])

    const getEmployees = useCallback((query) => {
        setLoading(true);
        EmployeeApiHelper.get({ ...query, status: true, order_by: 'name', limit: LIMIT })
            .then(results => {
                if (results.length < LIMIT) {
                    setHasMore(false);
                }
                setEmployees(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
      },
      [setHasMore, setLoading, handleHttpError],
    )

    useEffect(() => {
        getEmployees({});
    }, [getEmployees])

    function handleNext() {
        if (loading) return;

        const searchValues = form.getFieldsValue();

        let newPageNo = page + 1;
        setPage(newPageNo)

        setLoading(true);
        EmployeeApiHelper.get({ ...searchValues, status: true, order_by: 'name', limit: LIMIT, offset: (newPageNo-1)*LIMIT })
            .then(results => {
                if (results.length < 10) {
                    setHasMore(false);
                }
                setEmployees([...employees, ...results]);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function onValuesChange(_, form) {
        setPage(1);
        setHasMore(true);
        getEmployees(form);
    }

    function handleItemClick(employee) {
        if (user === null) return;
        if (loading === true) return;

        if (user.id === employee.id) {
            message.error('Cannot create chat with self!');
            return;
        }

        for (let channel of channels) {
            if (channel.title == null) { // Only those that are DMs
                for (let participant of channel.participants) {
                    if (participant.employee_id === employee.id) {
                        message.error(`Already have a direct message with ${employee.name}!`);
                        return;
                    }
                }
            }
        }

        const channel = {
            participants: [
                { employee_id: user.id }, 
                { employee_id: employee.id }
            ],
            owner_id: user.id,
        }

        setLoading(true);
        ChatApiHelper.createChannel(channel)
            .then(newChannel => {
                setLoading(false);
                handleNewChannelEvent(newChannel)
                setIsModalVisible(false);
                message.success("New chat successfully created!");
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <>
            <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                <Form.Item name="name" style={{ padding: '20px 0', width: '100%' }}>
                    <Input placeholder='Search Name' suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
            </Form>

            <div id="scrollableDiv"
                style={{
                  height: '80%',
                  overflow: 'auto',
                  padding: '0',
                  border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    dataLength={employees.length}
                    next={handleNext}
                    hasMore={hasMore}
                    loader={<div style={{ textAlign: 'center' }}><Spin /></div>}
                    endMessage={<Divider plain>End of results</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <List className="new-direct-modal"
                        itemLayout="horizontal"
                        dataSource={employees}
                        renderItem={item => (
                            <List.Item onClick={() => handleItemClick(item)}>
                                <List.Item.Meta
                                    avatar={(
                                        <Avatar style={{ marginTop: 5 }} size="large" icon={<UserOutlined />} />
                                    )}
                                    title={item.name}
                                    description={getRole(item.role_id).name}
                                />
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </>
    )

}
