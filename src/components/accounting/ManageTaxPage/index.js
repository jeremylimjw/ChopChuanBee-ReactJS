import React, { useEffect, useState } from "react";
import { Form, Typography, Input, DatePicker, Divider, Modal, message, Radio, Button, Table } from "antd";
import { useApp } from "../../../providers/AppProvider";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import { AccountingAPIHelper } from "../../../api/AccountingAPIHelper";
import { REQUIRED } from "../../../utilities/form";
import moment from 'moment';
import { parseDate } from '../../../utilities/datetime';
import { showTotal } from '../../../utilities/table';
import { RenderCell } from '../../common/TableCell/RenderCell';
import MyToolbar from "../../common/MyToolbar";
import { formatCurrency } from '../../../utilities/currency';

const breadcrumbs = [
    { url: "/accounting/Taxes", name: "Accounting" },    
    { url: "/accounting/Taxes", name: "Taxes" },
];

export default function ManageTaxPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [totalAmt, setTotalAmt] = useState();
    const [totalTax, setTotalTax] = useState();
    const [loading, setLoading] = useState(false);
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const onFinish = (form) => {
        setLoading(true);
        let start_date = form.dateRange[0];
        let end_date = form.dateRange[1];

        if (start_date && end_date) {
            start_date = moment(start_date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(end_date).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        
        if (form.type == 'input'){
        AccountingAPIHelper.getInputTax(form, start_date, end_date)
        .then(results => {
            let total_tax = results.pop();
            let total_amount = results.pop();
            setItems(results)
            setTotalTax(total_tax);
            setTotalAmt(total_amount);
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
        }
        else if (form.type == 'output'){
        AccountingAPIHelper.getOutputTax(form, start_date, end_date)
        .then(results => {
            let total_tax = results.pop();
            let total_amount = results.pop();
            setItems(results);
            setTotalTax(total_tax);
            setTotalAmt(total_amount);
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
        }
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Taxes">
            <MyCard title="Create A Tax Statement">
                <Form {...layout} form={form} onFinish={onFinish} autoComplete="off" labelAlign="left">
                    <Form.Item
                        rules={[REQUIRED]}
                        label="Type of Tax"
                        name="type"
                    >
                        <Radio.Group>
                            <Radio value={"input"}>Input Tax</Radio>
                            <Radio value={"output"}>Output Tax</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* <Form.Item
                        rules={[REQUIRED]}
                        label="Start Date"
                        name="start_date"
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        rules={[REQUIRED]}
                        label="End Date"
                        name="end_date"
                    >
                        <DatePicker />
                    </Form.Item> */}
                    <Form.Item label='Date' name='dateRange' rules={[REQUIRED]}>
                        <DatePicker.RangePicker allowClear={false} placeholder={['Start Date', 'End Date']}/>
                    </Form.Item>
                    <Form.Item
                        rules={[REQUIRED]} 
                        label="Company"
                        name="company"
                    >
                        <Radio.Group>
                            <Radio value={"CCB"}>CCB</Radio>
                            <Radio value={"CBFS"}>CBFS</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} style={{textAlign:'right'}}>
                        
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: 85 }}>Create</Button>
                    </Form.Item>
                </Form>
            </MyCard>
            <MyCard>
                <Table dataSource={items} 
                    columns={columns} 
                    loading={loading} 
                    rowKey={() => Math.random()} 
                    components={{ body: { cell: RenderCell } }} 
                    pagination={{ pageSize: 6, showTotal: showTotal }}
                />
                <div>
                    <Typography.Title level={5} style={{ display: 'inline-block'}}>Total Amount: </Typography.Title>&nbsp;

                    {totalAmt ? (<Typography.Title level={5} style={{ display: 'inline-block'}}>{formatCurrency(totalAmt.total_amount)}</Typography.Title>) 
                    : (<Typography.Title level={5} style={{ display: 'inline-block'}}>$0.00</Typography.Title>) }

                    <br />

                    <Typography.Title level={5} style={{ display: 'inline-block'}}>Total GST: </Typography.Title>&nbsp;

                    {totalTax ? (<Typography.Title level={5} style={{ display: 'inline-block'}}>{formatCurrency(totalTax.total_tax)}</Typography.Title>) 
                    : (<Typography.Title level={5} style={{ display: 'inline-block'}}>$0.00</Typography.Title>) }
                </div>
            </MyCard>
        </MyLayout>
    );
}

const columns = [
    {
        title: 'Order Id',
        dataIndex: 'order_id',
        key: 'order_id',
        width: "11%"
        //   sorter: (a, b) => sortByString(a.sales_order_id, b.sales_order_id),
    },
    {
        title: 'Customer Company Name',
        dataIndex: 'company_name',
        key: 'company_name',
        width: "34%"
        //   sorter: (a, b) => sortByString(a.company_name, b.company_name),
    },
    {
        title: 'Charged Under',
        dataIndex: 'charged_under_name',
        key: 'charged_under_name',
        align: 'center',
        width: "11%"
        //   sorter: (a, b) => sortByString(a.charged_under_name, b.charged_under_name),
    },
    {
        title: 'Transaction Date',
        dataIndex: 'transaction_date',
        key: 'transaction_date',
        align: 'center',
        width: "11%",
        render: (transaction_date) => parseDate(transaction_date),
    },
    {
        title: 'Total Amount',
        dataIndex: 'total_transaction_amount',
        key: 'total_transaction_amount',
        align: 'center',
        width: "11%",
        render: (total_transaction_amount) => formatCurrency(total_transaction_amount),
        // sorter: (a, b) => sortByString(a.total_transaction_amount, b.total_transaction_amount),
    },
    {
        title: 'GST Rate',
        dataIndex: 'gst_rate',
        key: 'gst_rate',
        align: 'center',
        width: "11%",
    },
    {
        title: 'GST Amount',
        dataIndex: 'gst_amount',
        key: 'gst_amount',
        align: 'center',
        width: "11%",
        render: (gst_amount) => formatCurrency(gst_amount),
        // sorter: (a, b) => sortByString(a.gst_amount, b.gst_amount),
    },
];