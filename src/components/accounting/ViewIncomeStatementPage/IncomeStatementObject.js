import { EditOutlined, SaveOutlined, PrinterOutlined, FileExcelOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Button, Form, Input, Divider, message, Typography, Tag } from 'antd'
import React, { useState } from 'react'
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import { formatCurrency } from '../../../utilities/currency';
import { generatePdf } from '../../../utilities/Report/ReportExporter';
import { generateCSV } from '../../../utilities/Report/ExcelExporter';
import moment from 'moment';

export default function IncomeStatementObject({ income, setIncome }) {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const totalRevenue = parseFloat(income.revenue) - parseFloat(income.less_cost_of_goods_sold) - parseFloat(income.less_customer_sales_return) + parseFloat(income.gain_on_sale_of_asset) + parseFloat(income.other_income_1) + parseFloat(income.other_income_2);

    const totalExpenses = parseFloat(income.damaged_inventory) + parseFloat(income.salary_expense) + parseFloat(income.interest_expense) + parseFloat(income.tax_expense) + parseFloat(income.warranty_expense) + parseFloat(income.rental_expense) + parseFloat(income.advertising_expense) + parseFloat(income.commissions_expense) + parseFloat(income.loss_on_sale_of_asset) + parseFloat(income.other_expense_1) + parseFloat(income.other_expense_2);

    const profit = parseFloat(totalRevenue) - parseFloat(totalExpenses);

    income.totalRevenue = totalRevenue.toString();
    income.totalExpenses = totalExpenses.toString();
    income.profit = profit.toString();

    const formatData = () => {
        income.revenue = parseFloat(income.revenue).toFixed('2');
        income.less_cost_of_goods_sold = parseFloat(income.less_cost_of_goods_sold).toFixed('2');
        income.less_customer_sales_return = parseFloat(income.less_customer_sales_return).toFixed('2');
        income.gain_on_sale_of_asset = parseFloat(income.gain_on_sale_of_asset).toFixed('2');
        income.other_income_1 = parseFloat(income.other_income_1).toFixed('2');
        income.other_income_2 = parseFloat(income.other_income_2).toFixed('2');

        income.totalRevenue = parseFloat(totalRevenue.toFixed('2'));;

        income.damaged_inventory = parseFloat(income.damaged_inventory).toFixed('2');
        income.salary_expense = parseFloat(income.salary_expense).toFixed('2');
        income.interest_expense = parseFloat(income.interest_expense).toFixed('2');
        income.tax_expense = parseFloat(income.tax_expense).toFixed('2');
        income.warranty_expense = parseFloat(income.warranty_expense).toFixed('2');
        income.rental_expense = parseFloat(income.rental_expense).toFixed('2');
        income.advertising_expense = parseFloat(income.advertising_expense).toFixed('2');
        income.commissions_expense = parseFloat(income.commissions_expense).toFixed('2');
        income.loss_on_sale_of_asset = parseFloat(income.loss_on_sale_of_asset).toFixed('2');
        income.other_expense_1 = parseFloat(income.other_expense_1).toFixed('2');
        income.other_expense_2 = parseFloat(income.other_expense_2).toFixed('2');

        income.totalExpenses = parseFloat(totalExpenses.toFixed('2'));

        income.profit = parseFloat(profit.toFixed('2'));
    }

    const handleExportPDF = () => {
        const incomeStatementPDF = {};

        incomeStatementPDF.start_date = income.start_date;
        incomeStatementPDF.end_date = income.end_date;
        incomeStatementPDF.remarks = income.remarks;

        incomeStatementPDF.revenue = formatCurrency(income.revenue);
        incomeStatementPDF.less_cost_of_goods_sold = formatCurrency(income.less_cost_of_goods_sold);
        incomeStatementPDF.less_customer_sales_return = formatCurrency(income.less_customer_sales_return);
        incomeStatementPDF.gain_on_sale_of_asset = formatCurrency(income.gain_on_sale_of_asset);
        incomeStatementPDF.other_income_1 = formatCurrency(income.other_income_1);
        incomeStatementPDF.other_income_2 = formatCurrency(income.other_income_2);

        incomeStatementPDF.totalRevenue = formatCurrency(totalRevenue);

        incomeStatementPDF.damaged_inventory = formatCurrency(income.damaged_inventory);
        incomeStatementPDF.salary_expense = formatCurrency(income.salary_expense);
        incomeStatementPDF.interest_expense = formatCurrency(income.interest_expense);
        incomeStatementPDF.tax_expense = formatCurrency(income.tax_expense);
        incomeStatementPDF.warranty_expense = formatCurrency(income.warranty_expense);
        incomeStatementPDF.rental_expense = formatCurrency(income.rental_expense);
        incomeStatementPDF.advertising_expense = formatCurrency(income.advertising_expense);
        incomeStatementPDF.commissions_expense = formatCurrency(income.commissions_expense);
        incomeStatementPDF.loss_on_sale_of_asset = formatCurrency(income.loss_on_sale_of_asset);
        incomeStatementPDF.other_expense_1 = formatCurrency(income.other_expense_1);
        incomeStatementPDF.other_expense_2 = formatCurrency(income.other_expense_2);

        incomeStatementPDF.totalExpenses = formatCurrency(totalExpenses);

        incomeStatementPDF.profit = formatCurrency(profit);

    }

    const exportReport = (action) => {
        formatData()
        let data = income
        if (action === 'EXCEL') {
            let headers = ['Income Statement', 'Chop Chuan Bee']
            let arr = []
            arr.push(['Period: ', moment(data.start_date).format('LL'), 'to', moment(data.end_date).format('LL')])
            arr.push([' ', ' '])
            arr.push(['Revenue', '$'])
            arr.push(['Revenue', data.revenue])
            arr.push(['Less:COGS', data.less_cost_of_goods_sold])
            arr.push(['Less: Customer Sales Return', data.less_customer_sales_return])
            arr.push(['Net Revenue', data.totalRevenue])
            arr.push([' ', ' '])
            arr.push(['Expenses', '$'])
            arr.push(['Damaged Inventory', data.damaged_inventory])
            arr.push(['Salary Expense', data.salary_expense])
            arr.push(['Interest Expense', data.interest_expense])
            arr.push(['Tax Expense', data.tax_expense])
            arr.push(['Warranty Expense', data.warranty_expense])
            arr.push(['Rental Expense', data.rental_expense])
            arr.push(['Advertising Expense', data.advertising_expense])
            arr.push(['Commission Expense', data.commissions_expense])
            arr.push([' ', ' '])
            arr.push(['Loss on Sale of Asset', data.loss_on_sale_of_asset])
            arr.push(['Other Expenses (1)', data.other_expense_1])
            arr.push(['Other Expenses (2)', data.other_expense_2])
            arr.push(['Total Expenses', data.totalExpenses])
            arr.push([' ', ' '])
            arr.push(['Profit', '$'])
            arr.push(['Profit for the Period', data.profit])
            arr.forEach((row) => row[1] = row[1].toString())
            generateCSV(arr, headers, 'Income Statement')
        } else {
            generatePdf(data, 'PNL_STATEMENT')
        }
    }

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            AccountingAPIHelper.updateIncomeStatement({ ...values, id: income.id })
                .then(() => {
                    setLoading(false);
                    setIncome({ ...income, ...values });
                    message.success('Income Statement successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <>
            {income != null &&
                <>
                    <Form form={form} labelCol={{ span: 14 }} wrapperCol={{ span: 24 }} autoComplete="off" labelAlign="left" initialValues={{ ...income }}>
                        <MyCard>
                            <MyToolbar title="Income Statement Details">
                                {hasWriteAccessTo(View.ACCOUNTING.name) &&
                                    <>
                                        <Form.Item>
                                            {editing ?
                                                <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                                                :
                                                <>
                                                    <Button onClick={() => exportReport('PDF')} icon={<PrinterOutlined />} loading={loading} style={{ marginRight: '1rem' }}>Export as PDF</Button>
                                                    <Button onClick={() => exportReport('EXCEL')} icon={<FileExcelOutlined />} loading={loading} style={{ marginRight: '1rem' }}>Export as Excel</Button>
                                                    <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }}>Edit</Button>
                                                </>
                                            }
                                        </Form.Item>
                                    </>
                                }
                            </MyToolbar>

                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="Name" name="name" rules={editing ? [REQUIRED] : []}>
                                {!editing ?
                                    <Typography>{income.name || '-'}</Typography>
                                    :
                                    <Input />
                                }
                            </Form.Item>

                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="Duration">
                                <Typography>{parseDate(income.start_date) || '-'} to {parseDate(income.end_date) || '-'}</Typography>
                            </Form.Item>

                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="Start Date" name="start_date" style={{ display: 'none' }}>
                                <Typography>{parseDate(income.start_date) || '-'}</Typography>
                            </Form.Item>

                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="End Date" name="end_date" style={{ display: 'none' }}>
                                <Typography>{parseDate(income.end_date) || '-'}</Typography>
                            </Form.Item>

                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="Remarks" name="remarks">
                                {!editing ?
                                    <Typography>{income.remarks || '-'}</Typography>
                                    :
                                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                                }
                            </Form.Item>
                        </MyCard>

                        <MyCard>
                            <Typography.Title level={5} style={{ textAlign: 'center', margin: '2rem 0 0' }}>Chop Chuan Bee</Typography.Title>
                            <Typography.Title level={5} style={{ textAlign: 'center', margin: 0 }}>Income Statement</Typography.Title>
                            <Typography.Title level={5} style={{ textAlign: 'center', margin: '0 0 2rem' }}>{"Period: " + parseDate(income.start_date) + " to " + parseDate(income.end_date)}</Typography.Title>

                            <Row>
                                <Col xs={24}>
                                    <Typography.Title level={5}>Revenue</Typography.Title>
                                    <Divider style={{ margin: 0 }} />
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Revenue" name="revenue" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.revenue) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 17, offset: 2 }} wrapperCol={{ span: 5 }} label="Less: Cost of Goods Sold" name="less_cost_of_goods_sold" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{'-' + formatCurrency(income.less_cost_of_goods_sold) || '-'}</Typography>
                                            :
                                            <Input prefix="-$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 17, offset: 2 }} wrapperCol={{ span: 5 }} label="Less: Customer Sales Return" name="less_customer_sales_return" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{'-' + formatCurrency(income.less_customer_sales_return) || '-'}</Typography>
                                            :
                                            <Input prefix="-$" />
                                        }
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Gain on Sale of Asset" name="gain_on_sale_of_asset" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.gain_on_sale_of_asset) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Income (1)" name="other_income_1" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.other_income_1) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Income (2)" name="other_income_2" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.other_income_2) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>

                                    <Row>
                                        <Typography.Title level={5} style={{ fontWeight: 'bold', marginTop: '1rem' }}>TOTAL REVENUE</Typography.Title>
                                        <Typography.Title level={5} style={{ marginLeft: 'auto', marginTop: '1rem', marginBottom: '1rem' }}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(totalRevenue)}</Typography.Title>
                                    </Row>

                                    <Typography.Title level={5} style={{ marginTop: '2rem' }}>Expenses</Typography.Title>
                                    <Divider style={{ margin: 0 }} />

                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Damaged Inventory" name="damaged_inventory" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.damaged_inventory) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Salary Expense" name="salary_expense" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.salary_expense) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Interest Expense" name="interest_expense" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.interest_expense) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Tax Expense" name="tax_expense" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.tax_expense) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Warranty Expense" name="warranty_expense" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.warranty_expense) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Rental Expense" name="rental_expense" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.rental_expense) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Advertising Expense" name="advertising_expense" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.advertising_expense) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Commissions Expense" name="commissions_expense" rules={editing ? [REQUIRED] : []} style={{ marginBottom: '1rem', textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.commissions_expense) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Loss on Sale of Asset" name="loss_on_sale_of_asset" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.loss_on_sale_of_asset) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Expense (1)" name="other_expense_1" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.other_expense_1) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Expense (2)" name="other_expense_2" rules={editing ? [REQUIRED] : []} style={{ margin: 0, textAlign: 'right' }}>
                                        {!editing ?
                                            <Typography>{formatCurrency(income.other_expense_2) || '-'}</Typography>
                                            :
                                            <Input prefix="$" />
                                        }
                                    </Form.Item>

                                    <Row>
                                        <Typography.Title level={5} style={{ fontWeight: 'bold', marginTop: '1rem' }}>TOTAL EXPENSES</Typography.Title>
                                        <Typography.Title level={5} style={{ marginLeft: 'auto', marginTop: '1rem', marginBottom: '1rem' }}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(totalExpenses)}</Typography.Title>
                                    </Row>

                                    <Divider style={{ margin: '2rem 0 0' }} />

                                    <Row>
                                        <Typography.Title level={5} style={{ fontWeight: 'bold', marginTop: '1rem' }}>PROFIT FOR THE PERIOD</Typography.Title>
                                        <Typography.Title level={5} style={{ marginLeft: 'auto', marginTop: '1rem', marginBottom: '1rem' }}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(profit)}</Typography.Title>
                                    </Row>
                                </Col>
                            </Row>
                        </MyCard>
                    </Form>
                </>
            }
        </>
    )
}
