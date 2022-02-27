import { Form, Input, DatePicker, Select, Button, Tabs } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
// import { LogApiHelper } from '../../api/LogApiHelper';
import { View } from '../../../enums/View';
import MyLayout from '../../common/MyLayout';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import A1Profits from './A1Profits';
import A2AP from './A2AP';
import A3AR from './A3AR';
import A4PO from './A4PO';
import A5Invoice from './A5Invoice';

export default function AnalyticsDashboard() {
    const [form] = Form.useForm();
    let navigate = useNavigate();

    const { TabPane } = Tabs;

    function callback(key) {
        console.log(key);
    }

    function handlePayableNavigation(e, link) {
        e.preventDefault();
        console.log(link);
        // navigate('/Accounting/Payable');
    }

    function handleReceivableNavigation(e, link) {
        e.preventDefault();
        console.log(link);
        // navigate('/Accounting/Receivable');
    }

    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        console.log(start_date);
        console.log(end_date);

        // LogApiHelper.get(form.name, start_date, end_date, form.view_id)
        //     .then((results) => {
        //         setLogs(results);
        //         setLoading(false);
        //     })
        //     .catch(handleHttpError)
        //     .catch(() => setLoading(false));
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    return (
        <MyLayout bannerTitle='Analytics Dashboard'>
            <MyCard>
                <MyToolbar title='Profits'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name='date'>
                            <DatePicker.RangePicker />
                        </Form.Item>

                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    {/* <Anchor affix={true} onClick={handleClick}>
                        <Link href='#components-anchor-demo-basic' title='View all payable' />
                    </Anchor> */}
                </MyToolbar>
                <A1Profits />
            </MyCard>

            <MyCard>
                <MyToolbar title='Top 10 Payable'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name='date'>
                            <DatePicker.RangePicker />
                        </Form.Item>

                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    <Button type='link' onClick={handlePayableNavigation}>
                        View all payable
                    </Button>
                </MyToolbar>
                <Tabs defaultActiveKey='1' onChange={callback} tabPosition='left'>
                    <TabPane tab='Invoice Level' key='1'>
                        <A5Invoice />
                    </TabPane>
                    <TabPane tab='Supplier Level' key='2'>
                        <A2AP />
                    </TabPane>
                </Tabs>
            </MyCard>

            <MyCard>
                <MyToolbar title='Top 10 Receivable'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name='date'>
                            <DatePicker.RangePicker />
                        </Form.Item>

                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    <Button type='link' onClick={handleReceivableNavigation}>
                        View all receivable
                    </Button>
                </MyToolbar>

                <Tabs defaultActiveKey='1' onChange={callback} tabPosition='left'>
                    <TabPane tab='PO Level' key='1'>
                        <A4PO />
                    </TabPane>
                    <TabPane tab='Customer Level' key='2'>
                        <A3AR />
                    </TabPane>
                </Tabs>
            </MyCard>
        </MyLayout>
    );
}
