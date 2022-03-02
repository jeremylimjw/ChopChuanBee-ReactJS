import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Button, Form, Input, Divider, InputNumber, message, Typography } from 'antd'
import React, { useState } from 'react'
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function SOFPAsset({income, setIncome}) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

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
                        <MyToolbar title="Statement Details">
                            { hasWriteAccessTo(View.ACCOUNTING.name) && 
                            <>
                                <Form.Item>
                                    { editing ? 
                                        <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                                        :
                                        <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }}>Edit</Button>
                                    }
                                </Form.Item>
                            </>
                            }
                        </MyToolbar>
                        <Row>
                            <Form.Item name="name" rules={editing ? [REQUIRED] : []}>
                                {!editing ? 
                                    <Typography>{income.name || '-'}&nbsp;between&nbsp;</Typography>
                                :
                                    <Input />
                                }
                            </Form.Item>
                            <Form.Item name="start_date">
                                <Typography>{parseDate(income.start_date) || '-'} &nbsp;and&nbsp;</Typography>
                            </Form.Item>

                            <Form.Item name="end_date">
                                <Typography>{parseDate(income.end_date) || '-'}</Typography>
                            </Form.Item>
                        </Row>
                    </MyCard>
                    <Row>
                        <Col xl={10} xs={24}> 
                            <MyCard title="Assets">
                                <Typography.Title level={5}>Revenue</Typography.Title>
                                <Form.Item label="Revenue" name="revenue" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.revenue || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Less: Cost of Goods Sold" name="less_cost_of_goods_sold" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.less_cost_of_goods_sold || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Less: Customer Sales Return" name="less_customer_sales_return" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.less_customer_sales_return || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Gain on Sale of asset" name="gain_on_sale_of_asset" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.gain_on_sale_of_asset || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Income (1)" name="other_income_1" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.other_income_1 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Income (2)" name="other_income_2" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.other_income_2 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Divider />
                                <Typography.Title level={5}>Expenses</Typography.Title>
                                <Form.Item label="Damage Inventory" name="damaged_inventory" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.damaged_inventory || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Salary Expense" name="salary_expense" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.salary_expense || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Interest Expense" name="interest_expense" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.interest_expense || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Tax Expense" name="tax_expense" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.tax_expense || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Warranty Expense" name="warranty_expense" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.warranty_expense || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Rental Expense" name="rental_expense" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.rental_expense || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Advertising Expense" name="advertising_expense" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.advertising_expense || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Commissions Expense" name="commissions_expense" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.commissions_expense || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Loss on sale of asset" name="loss_on_sale_of_asset" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.loss_on_sale_of_asset || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Expense (1)" name="other_expense_1" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.other_expense_1 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Expense (2)" name="other_expense_2" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{income.other_expense_2 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                            </MyCard>
                        </Col>
                    </Row>
                </Form>
            </>
        }
        </>
    )
}
