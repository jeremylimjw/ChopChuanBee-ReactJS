import { Card, Col, Row, Typography } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../providers/AppProvider'
import MyLayout from './common/MyLayout'
import { menu } from './common/Sidebar'

const breadcrumbs = [{ url: '/', name: 'Home' }];

export default function Home() {

    const navigate = useNavigate();
    const { user } = useApp();

    return (
        <>
            { user &&
            <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Dashboard' style={{ padding: 50 }}>
                <div style={{ padding: '25px 35px' }}>
                    { menu.map(x => {
                        if (x.role in user.access_rights) {
                            return (
                                <>
                                    <Typography.Title level={4}>{x.icon} {x.title}</Typography.Title>
                                    <Row gutter={[16, 16]} style={{ marginBottom: 20}}>
                                        {x.items.map((item, index) => (
                                            <Col span={4} key={index}>
                                                <Card hoverable style={{ border: '1px solid rgb(99 99 99 / 20%)' }} onClick={() => navigate(item.route)}>
                                                    {item.name}
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            )
                        }
                        return <></>
                    })}
                </div>
            </MyLayout>
            }
        </>
    );
}
