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

export default function IncomeStatementAsset({ income, setIncome }) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const totalRevenue = parseFloat(income.revenue) - parseFloat(income.less_cost_of_goods_sold) - parseFloat(income.less_customer_sales_return) + parseFloat(income.gain_on_sale_of_asset) + parseFloat(income.other_income_1) + parseFloat(income.other_income_2);

    const totalExpenses = parseFloat(income.damaged_inventory) + parseFloat(income.salary_expense) + parseFloat(income.interest_expense) + parseFloat(income.tax_expense) + parseFloat(income.warranty_expense) + parseFloat(income.rental_expense) + parseFloat(income.advertising_expense) + parseFloat(income.commissions_expense) + parseFloat(income.loss_on_sale_of_asset) + parseFloat(income.other_expense_1) + parseFloat(income.other_expense_2);

    const profit = parseFloat(totalRevenue) - parseFloat(totalExpenses);

    const handleExportPDF = () => {

    }

    const handleExportExcel = () => {

    }

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            AccountingAPIHelper.updateIncomeStatement({...values, id: income.id })
                .then(() => {
                    setLoading(false);
                    setIncome({...income, ...values });
                    message.success('Income Statement successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <>
        { income != null &&
            <>
                <Form form={form} labelCol={{ span: 14 }} wrapperCol={{ span: 24 }} autoComplete="off" labelAlign="left" initialValues={{...income}}>
                    <MyCard>
                        <MyToolbar title="Income Statement Details">
                            {hasWriteAccessTo(View.ACCOUNTING.name) && 
                            <>
                                <Form.Item>
                                    { editing ? 
                                        <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                                        :
                                        <>
                                        <Button onClick={handleExportPDF} icon={<PrinterOutlined />} loading={loading} style={{ marginRight: '1rem' }}>Export as PDF</Button>
                                        <Button onClick={handleExportExcel} icon={<FileExcelOutlined />} loading={loading} style={{ marginRight: '1rem' }}>Export as Excel</Button>
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
                                <Divider style={{margin:0}}/>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Revenue" name="revenue" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.revenue) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>

                                <Form.Item labelCol={{ span: 17, offset: 2 }} wrapperCol={{ span: 5 }} label="Less: Cost of Goods Sold" name="less_cost_of_goods_sold" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{'-' + formatCurrency(income.less_cost_of_goods_sold) || '-'}</Typography>
                                    :
                                        <Input prefix="-$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 17, offset: 2 }} wrapperCol={{ span: 5 }} label="Less: Customer Sales Return" name="less_customer_sales_return" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{'-' + formatCurrency(income.less_customer_sales_return) || '-'}</Typography>
                                    :
                                        <Input prefix="-$"/>
                                    }
                                </Form.Item>

                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Gain on Sale of asset" name="gain_on_sale_of_asset" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.gain_on_sale_of_asset) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Income (1)" name="other_income_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.other_income_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Income (2)" name="other_income_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}> 
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.other_income_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>

                                <Row>                                    
                                    <Typography.Title level={5} style={{fontWeight: 'bold', marginTop:'1rem' }}>TOTAL REVENUE</Typography.Title>
                                    <Typography.Title level={5} style={{marginLeft:'auto', marginTop: '1rem', marginBottom: '1rem'}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(totalRevenue)}</Typography.Title>
                                </Row>
                                
                                <Typography.Title level={5} style={{marginTop: '2rem'}}>Expenses</Typography.Title>
                                <Divider style={{margin:0}}/>

                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Damage Inventory" name="damaged_inventory" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.damaged_inventory) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Salary Expense" name="salary_expense" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.salary_expense) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Interest Expense" name="interest_expense" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.interest_expense) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Tax Expense" name="tax_expense" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.tax_expense) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Warranty Expense" name="warranty_expense" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.warranty_expense) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Rental Expense" name="rental_expense" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.rental_expense) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Advertising Expense" name="advertising_expense" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.advertising_expense) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Commissions Expense" name="commissions_expense" rules={editing ? [REQUIRED] : []} style={{marginBottom: '1rem', textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.commissions_expense) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Loss on sale of asset" name="loss_on_sale_of_asset" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.loss_on_sale_of_asset) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Expense (1)" name="other_expense_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.other_expense_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 19 }} wrapperCol={{ span: 5 }} label="Other Expense (2)" name="other_expense_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(income.other_expense_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>

                                <Row>                                    
                                    <Typography.Title level={5} style={{fontWeight: 'bold', marginTop:'1rem' }}>TOTAL EXPENSES</Typography.Title>
                                    <Typography.Title level={5} style={{marginLeft:'auto', marginTop: '1rem', marginBottom: '1rem'}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(totalExpenses)}</Typography.Title>
                                </Row>

                                <Divider style={{margin: '2rem 0 0'}}/>

                                <Row>                                    
                                    <Typography.Title level={5} style={{fontWeight: 'bold', marginTop:'1rem' }}>PROFIT FOR THE PERIOD</Typography.Title>
                                    <Typography.Title level={5} style={{marginLeft:'auto', marginTop: '1rem', marginBottom: '1rem'}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(profit)}</Typography.Title>
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
