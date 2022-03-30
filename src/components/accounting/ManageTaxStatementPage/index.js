import React, { useEffect, useState } from "react";
import { Form, Typography, DatePicker, Radio, Button, Table, Select, Upload } from "antd";
import { PrinterOutlined, FileExcelOutlined } from '@ant-design/icons/lib/icons';
import { useApp } from "../../../providers/AppProvider";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import { AccountingAPIHelper } from "../../../api/AccountingAPIHelper";
import { ChargedUnderApiHelper } from "../../../api/ChargedUnderApiHelper";
import { REQUIRED } from "../../../utilities/form";
import moment from 'moment';
import { parseDate } from '../../../utilities/datetime';
import { showTotal } from '../../../utilities/table';
import MyToolbar from "../../common/MyToolbar";
import { formatCurrency } from '../../../utilities/currency';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { Link } from "react-router-dom";
import { generatePdf } from "../../../utilities/Report/ReportExporter";
import { generateCSV } from "../../../utilities/Report/ExcelExporter";

const breadcrumbs = [
    { url: "/accounting/taxStatements", name: "Accounting" },
    { url: "/accounting/taxStatements", name: "Tax Statements" },
];

export default function ManageTaxStatementPage() {
    const { handleHttpError } = useApp();
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [totalAmt, setTotalAmt] = useState();
    const [totalTax, setTotalTax] = useState();
    const [loading, setLoading] = useState(false);
    const [chargedUnders, setChargedUnders] = useState([]);
    const [taxType, setTaxType] = useState()
    const [dateRange, setDateRange] = useState([])

    useEffect(() => {
        ChargedUnderApiHelper.getAvailable()
            .then(results => {
                setChargedUnders(results)
            })
            .catch(handleHttpError);
    }, [handleHttpError])

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
        if (form.type === 'input') {
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
        else if (form.type === 'output') {
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
        setTaxType(form.type)
        setDateRange([start_date, end_date])
    }

    function handleChargedUnderChange(id) {
        const index = chargedUnders.findIndex(x => x.id === id);
        form.setFieldsValue({ charged_under: (id == null ? null : { ...chargedUnders[index] }) });
    }

    function exportPDF() {
        let total_amount = parseFloat(totalAmt.total_amount).toFixed(2);
        let total_tax = parseFloat(totalTax.total_tax).toFixed(2)
        let data = items.map((item) => {
            return {
                ...item,
                total_transaction_amount: parseFloat(item.total_transaction_amount).toFixed(2),
                gst_amount: parseFloat(item.gst_amount).toFixed(2),
            }
        })
        let pdfData = {
            items: data,
            totalTax: total_tax,
            totalAmt: total_amount,
            dateRange,
            taxType
        }
        generatePdf(pdfData, 'TAX')
    }

    const exportExcel = () => {
        let tableHeaders
        let excelData
        if (taxType === 'input') {
            tableHeaders = ['Sales Order ID', 'Company Name', 'Charged Under', 'Transaction Date', 'Total Amount', 'GST Rate', 'GST Amount']
            excelData = formatExcelData(tableHeaders)
            generateCSV('Input Tax Statement', tableHeaders, excelData)
        } else {
            tableHeaders = ['Purchase Order ID', 'Company Name', 'Charged Under', 'Transaction Date', 'Total Amount', 'GST Rate', 'GST Amount']
            excelData = formatExcelData(tableHeaders)
            generateCSV('Output Tax Statement', tableHeaders, excelData)
        }
    }

    const formatExcelData = () => {
        let excelData = []
        excelData = items.map((item) => {
            let arr = []
            arr.push(item.order_id.toString())
            arr.push(item.company_name)
            arr.push(item.charged_under_name)
            arr.push(moment(item.transaction_date).format('L'))
            arr.push(item.total_transaction_amount)
            arr.push(item.gst_rate)
            arr.push(item.gst_amount)
            return arr
        })
        return excelData
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Tax Statements">
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
                    <Form.Item label='Date' name='dateRange' rules={[REQUIRED]}>
                        <DatePicker.RangePicker allowClear={false} placeholder={['Start Date', 'End Date']} />
                    </Form.Item>

                    <Form.Item name="charged_under_id" label="Charged Under" rules={[REQUIRED]}>

                        <Select style={{ width: 180 }} onSelect={handleChargedUnderChange} placeholder="Select a Company">

                            {chargedUnders.map((x, idx) => <Select.Option key={idx} value={x.id}>{x.name}</Select.Option>)}
                        </Select>

                    </Form.Item>

                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>

                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: 85 }}>Generate</Button>
                    </Form.Item>
                </Form>
            </MyCard>
            <MyCard>
                <MyToolbar title="Tax Statement Details">
                    <Button icon={<PrinterOutlined />} loading={loading} style={{ textAlign: 'right' }} onClick={() => exportPDF()}>Export as PDF</Button>
                    <Button icon={<FileExcelOutlined />} loading={loading} style={{ textAlign: 'right' }} onClick={() => exportExcel()}>Export as Excel</Button>
                </MyToolbar>
                <Table dataSource={items}
                    columns={columns}
                    loading={loading}
                    rowKey={() => Math.random()}
                    pagination={{ pageSize: 6, showTotal: showTotal }}
                />
                <div>
                    <Typography.Title level={5} style={{ display: 'inline-block' }}>Total Amount: </Typography.Title>&nbsp;

                    {totalAmt ? (<Typography.Title level={5} style={{ display: 'inline-block' }}>{formatCurrency(totalAmt.total_amount)}</Typography.Title>)
                        : (<Typography.Title level={5} style={{ display: 'inline-block' }}>$0.00</Typography.Title>)}

                    <br />

                    <Typography.Title level={5} style={{ display: 'inline-block' }}>Total GST: </Typography.Title>&nbsp;

                    {totalTax ? (<Typography.Title level={5} style={{ display: 'inline-block' }}>{formatCurrency(totalTax.total_tax)}</Typography.Title>)
                        : (<Typography.Title level={5} style={{ display: 'inline-block' }}>$0.00</Typography.Title>)}

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
        width: "11%",
        sorter: (a, b) => sortByNumber(a.order_id, b.order_id)
    },
    {
        title: 'Company Name',
        key: 'company_name',
        width: "34%",
        render: (_, record) => {
            if (record.customer_id) {
                return <Link to={`/customer/customers/${record.customer_id}`}>{record.company_name}</Link> || '-';
            } else if (record.supplier_id) {
                return <Link to={`/supplier/suppliers/${record.supplier_id}`}>{record.company_name}</Link> || '-';
            } else {
                return <></>;
            }
        },
        sorter: (a, b) => sortByString(a.company_name, b.company_name),
    },
    {
        title: 'Charged Under',
        dataIndex: 'charged_under_name',
        key: 'charged_under_name',
        align: 'center',
        width: "11%",
        sorter: (a, b) => sortByString(a.charged_under_name, b.charged_under_name),
    },
    {
        title: 'Transaction Date',
        dataIndex: 'transaction_date',
        key: 'transaction_date',
        align: 'center',
        width: "11%",
        render: (transaction_date) => parseDate(transaction_date),
        sorter: (a, b) => sortByDate(a.transaction_date, b.transaction_date),
    },
    {
        title: 'Total Amount',
        dataIndex: 'total_transaction_amount',
        key: 'total_transaction_amount',
        align: 'center',
        width: "11%",
        render: (total_transaction_amount) => formatCurrency(total_transaction_amount),
        sorter: (a, b) => sortByNumber(a.total_transaction_amount, b.total_transaction_amount),
    },
    {
        title: 'GST Rate',
        dataIndex: 'gst_rate',
        key: 'gst_rate',
        align: 'center',
        width: "11%",
        sorter: (a, b) => sortByNumber(a.gst_rate, b.gst_rate),
    },
    {
        title: 'GST Amount',
        dataIndex: 'gst_amount',
        key: 'gst_amount',
        align: 'center',
        width: "11%",
        render: (gst_amount) => formatCurrency(gst_amount),
        sorter: (a, b) => sortByNumber(a.gst_amount, b.gst_amount),
    },
];