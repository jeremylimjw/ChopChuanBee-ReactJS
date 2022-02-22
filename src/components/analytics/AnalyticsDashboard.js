import { Col, Row } from 'antd';
import React from 'react';
import MyLayout from '../common/MyLayout';
import MyCard from '../common/MyCard';
// import MyToolbar from '../../common/MyToolbar';
import A1ProfitsDashboard from './A1Profits';

export default function AnalyticsDashboard() {
    return (
        <MyLayout bannerTitle='Analytics Dashboard'>
            <Row>
                <Col xl={12} xs={24}>
                    <MyCard title='Profits'>
                        <A1ProfitsDashboard />
                    </MyCard>
                </Col>

                <Col xl={12} xs={24}>
                    <MyCard title='Inventory'></MyCard>
                </Col>
            </Row>

            <Row>
                <Col xl={12} xs={24}>
                    <MyCard title='Payments'></MyCard>
                </Col>

                <Col xl={12} xs={24}>
                    <MyCard title='General'></MyCard>
                </Col>
            </Row>
        </MyLayout>
    );
}
