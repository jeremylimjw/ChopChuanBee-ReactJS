import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, Form, Button, Input, DatePicker, Space, Select } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import CustomerAnalyticsTable from './CustomerAnalyticsTable';
import CustomerAnalyticsGraph from './CustomerAnalyticsGraph';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { CustomerApiHelper } from '../../../../api/CustomerApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import CustomerAnalyticsCard from './CustomerAnalyticsCard';

export default function CustomerAnalyticsData() {
    const { TabPane } = Tabs;
    const { handleHttpError } = useApp()
    const [searchInputForm] = Form.useForm();
    const [customerList, setCustomerList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [customerData, setCustomerData] = useState({})
    const [totals, setTotals] = useState()
    const [loading, setLoading] = useState(false)
    const [showComponent, setShowComponent] = useState(false)

    useEffect(() => {
        setLoading(true);
        CustomerApiHelper.get()
            .then(results => {
                setCustomerList(results);
                setFilteredList(results)
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])

    const handleFinish = async (values) => {
        // let start_date, end_date;
        // if (values.date && values.date[0] && values.date[1]) {
        //     start_date = moment(values.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
        //     end_date = moment(values.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        // }
        // setCustomerName(values.name);
        // setStartDate(start_date);
        // setEndDate(end_date);
        fetchData(values)
    }

    const fetchData = async (values) => {
        let [start, end] = values.date
        AnalyticsApiHelper.getCustomerProfits(values.id, start, end)
            .then((results) => {
                if (results) {
                    let consolidatedData = {
                        revenue: 0,
                        cogs: 0,
                        profits: 0
                    }
                    results.forEach((item) => {
                        consolidatedData.revenue += parseFloat(item.total_revenue)
                        consolidatedData.cogs += parseFloat(item.total_cogs)
                        consolidatedData.profits += parseFloat(item.total_profits)
                    })
                    setTotals(consolidatedData)
                    setCustomerData(results)
                    setShowComponent(true)
                }
            })
            .catch(handleHttpError)
    }

    const handleOnSearch = (input) => {
        if (input) {
            input = input.toLowerCase()
            let arr = customerList.filter((cust) =>
                cust.company_name.toLowerCase().includes(input)
            )
            setFilteredList(arr)
        } else {
            setFilteredList(customerList)
        }
    }


    return (
        <>

            <MyCard style={{ margin: '3px' }}>
                <MyToolbar title='Customer Analytics' />
                <Form form={searchInputForm} layout='inline' onFinish={handleFinish}>
                    <Form.Item name="id">
                        <Select
                            showSearch={true}
                            onSearch={handleOnSearch}
                            placeholder="Search Customer Name"
                            options={filteredList.map((customer) => {
                                return {
                                    label: customer.company_name,
                                    value: customer.id
                                }
                            })}
                            filterOption={false}
                        >
                            {customerList.map((customer) => {
                                return <Select.Option value={customer.id}>{customer.company_name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="date">
                        <DatePicker.RangePicker />
                    </Form.Item>

                    <Form.Item style={{ marginLeft: '20px' }}>
                        <Button type="primary" htmlType="submit"> Analyse </Button>
                    </Form.Item>
                </Form>
            </MyCard>
            {
                !showComponent ? <div />
                    :
                    <>
                        <Space direction='horizontal'>
                            <CustomerAnalyticsCard
                                title='Total Revenue'
                                title_2=' Revenue'
                                value={totals.revenue}
                            />
                            <CustomerAnalyticsCard
                                title='Total COGS'
                                title_2='Total COGS'
                                value={totals.cogs}
                            />
                            <CustomerAnalyticsCard
                                title='Total Profits'
                                title_2='Total Profits'
                                value={totals.profits}
                            />
                        </Space>
                        <MyCard style={{ marginLeft: '3px', marginRight: '3px' }}>
                            <MyToolbar title='Customer Profitability'></MyToolbar>
                            <Tabs defaultActiveKey='1'>
                                <TabPane tab='Graph' key='1'>
                                    <CustomerAnalyticsGraph data={customerData} />
                                </TabPane>
                                <TabPane tab='Table' key='2'>
                                    <CustomerAnalyticsTable data={customerData} />
                                </TabPane>
                            </Tabs>
                        </MyCard>
                    </>
            }

        </>
    )
}