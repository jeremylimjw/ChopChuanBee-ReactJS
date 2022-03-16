import React, { useEffect, useState } from "react";
import { Form, Typography, Input, DatePicker, Divider, Modal, message, Radio, Button, Table } from "antd";
import { useApp } from "../../../providers/AppProvider";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import { AccountingAPIHelper } from "../../../api/AccountingAPIHelper";
import { REQUIRED } from "../../../utilities/form";
import moment from 'moment';
import {Link , useNavigate} from 'react-router-dom';
import { showTotal } from '../../../utilities/table';
import { RenderCell } from '../../common/TableCell/RenderCell';



const breadcrumbs = [
    { url: "/accounting/Taxes", name: "Accounting" },    
    { url: "/accounting/Taxes", name: "Taxes" },
];

export default function ManageTaxPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const onFinish = (form) => {
        let start_date, end_date;
        if (form.start_date && form.end_date) {
            start_date = moment(form.start_date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.end_date).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        if (form.type == 'input'){
        AccountingAPIHelper.getInPutTax(form , start_date, end_date)
        .then(results => {
            setItems(results)
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
        }
        else if (form.type == 'output'){
        AccountingAPIHelper.getOutPutTax(form, start_date, end_date)
        .then(results => {
            setItems(results);
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
        }
    
    }

    return (
        <>
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Taxes">
            <MyCard title="Create A Tax Statement">
                <Form {...layout} form={form} autoComplete="off" labelAlign="left">
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
                    <Form.Item
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
                        
                        <Button type="primary" onClick={onFinish(form)} loading={loading} style={{ width: 85 }}>Create</Button>
                    </Form.Item>
                </Form>
            </MyCard>
        </MyLayout>
        <Table dataSource={items} 
        columns={columns} 
        loading={loading} 
        rowKey={() => Math.random()} 
        components={{ body: { cell: RenderCell } }} 
        pagination={{ pageSize: 6, showTotal: showTotal }}
        />

</>  
    );
}
    const columns = [
     
        {
          title: 'Sales Order Id',
          dataIndex: 'sales_order_id',
          key: 'sales_order_id',
        //   sorter: (a, b) => sortByString(a.sales_order_id, b.sales_order_id),
        },
        {
          title: 'Customer Company Name',
          dataIndex: 'company_name',
          key: 'company_name',
          width: 280,
        //   sorter: (a, b) => sortByString(a.company_name, b.company_name),
        },
        {
          title: 'Charged Under',
          dataIndex: 'charged_under_name',
          key: 'charged_under_name',
          align: 'center',
          width: 120,
        //   sorter: (a, b) => sortByString(a.charged_under_name, b.charged_under_name),
        },
        {
            title: 'Transaction Date',
            dataIndex: 'transaction_date',
            key: 'transaction_date',
            align: 'center',
            width: 120,
          },
          {
            title: 'Total Amount',
            dataIndex: 'total_transaction_amount',
            key: 'total_transaction_amount',
            align: 'center',
            width: 120,
            // sorter: (a, b) => sortByString(a.total_transaction_amount, b.total_transaction_amount),
          },
          {
            title: 'GST Rate',
            dataIndex: 'gst_rate',
            key: 'gst_rate',
            align: 'center',
            width: 120,
          },
          {
            title: 'GST Amount',
            dataIndex: 'gst_amount',
            key: 'gst_amount',
            align: 'center',
            width: 120,
            // sorter: (a, b) => sortByString(a.gst_amount, b.gst_amount),
          },

        { 
          align: 'center', 
          width: 50,
        },
      ]


