import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button, Tabs } from 'antd';
import { Line } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import debounce from 'lodash.debounce';
import moment from 'moment';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { useApp } from '../../../../providers/AppProvider';
import InvoiceChart from './InvoiceChart';
import A2AP from '../A2AP';

export default function PayableGraph() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const [form] = Form.useForm();
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const { TabPane } = Tabs;

    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }

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
        <MyCard>
            <MyToolbar title='10 Outstanding Accounts Payable'>
                {/* <Button type='link' onClick={handlePayableNavigation}>
                    View all payable
                </Button> */}
            </MyToolbar>
            <Tabs defaultActiveKey='1' tabPosition='left'>
                <TabPane tab='Invoice Level' key='1'>
                    <InvoiceChart />
                </TabPane>
                <TabPane tab='Supplier Level' key='2'>
                    <A2AP />
                </TabPane>
            </Tabs>
        </MyCard>
    )
}