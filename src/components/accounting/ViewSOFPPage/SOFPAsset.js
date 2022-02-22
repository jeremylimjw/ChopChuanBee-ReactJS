import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Button, Form, Input, InputNumber, message, Typography } from 'antd'
import React, { useState } from 'react'
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function SOFPAsset({ SOFP, setSOFP }) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            AccountingAPIHelper.updateSOFP({...values, id: SOFP.id })
                .then(() => {
                    setLoading(false);
                    setSOFP({...SOFP, ...values });
                    message.success('SOFP successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <>
        { SOFP != null &&
            <>
                <MyToolbar title="Title">
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

                <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...SOFP}}>
                    <Form.Item label="Title" name="name">
                        <Typography>{SOFP.name || '-'}</Typography>
                    </Form.Item> as at
                    <Form.Item name="end_date">
                        <Typography>{SOFP.end_date || '-'}</Typography>
                    </Form.Item>
                    <Row>
                        <Col xl={10} xs={24}> 
                            <MyCard>
                                <Form.Item label="Cash (Sales of Goods)" name="cash_sales_of_goods" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.cash_sales_of_goods || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Cash (Others)" name="cash_others" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.cash_others || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Account Receivable" name="account_receivable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.account_receivable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Inventory" name="inventory" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.inventory || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Supplies" name="supplies" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.supplies || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Prepaid Insurance" name="prepaid_insurance" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.prepaid_insurance || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Prepaid Rent" name="prepaid_rent" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.prepaid_rent || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other current assets (1)" name="other_current_asset_1" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_current_asset_1 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other current assets (2)" name="other_current_asset_2" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_current_asset_2 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Land" name="land" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.land || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Less: Accumulated Depreciation" name="less_accumulated_depreciation_land" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.less_accumulated_depreciation || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Building" name="building" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.building || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Less:Accumulated Depreciation" name="less_accumulated_depreciation_building" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.less_accumulated_depreciation_building || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Equipments" name="equipments" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.equipments || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Less:Accumulated Depreciation" name="less_accumulated_depreciation_equipments" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.less_accumulated_depreciation_equipments || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-current Asset (1)" name="other_non_current_asset_1" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_non_current_asset_1 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-current Asset (2)" name="other_non_current_asset_2" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_non_current_asset_2 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Goodwill" name="goodwill" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.goodwill || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Trade names" name="trade_names" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.trade_names || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Intangible Asset (1)" name="other_intangible_asset_1" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_intangible_asset_1 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Intangible Asset (2)" name="other_intangible_asset_2" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_intangible_asset_2 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                            </MyCard>
                        </Col>
                        <Col xl={10} xs={24}>
                            <MyCard>
                                <Form.Item label="Account Payable" name="account_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.account_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Salary Payable" name="salary_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.salary_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Interest Payable" name="interest_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.interest_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Tax Payable" name="taxes_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.taxes_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Warranty Payable" name="warranty_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.warranty_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Rental Payable" name="rental_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.rental_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Notes Payable" name="notes_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.notes_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Bonds Payable" name="bonds_payable" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.bonds_payable || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Liability (1)" name="other_liability_1" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_liability_1 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Liability (2)" name="other_liability_2" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.other_liability_2 || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                            </MyCard>
                        </Col>
                    </Row>
                    <MyCard>
                        <Form.Item label="Share Capital" name="share_capital" rules={editing ? [REQUIRED] : []}>
                            {!editing ? 
                                <Typography>{SOFP.share_capital || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        <Form.Item label="Less Withdrawal" name="less_withdrawal" rules={editing ? [REQUIRED] : []}>
                            {!editing ? 
                                <Typography>{SOFP.less_withdrawal || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        <Form.Item label="Retained Earning" name="retained_earning" rules={editing ? [REQUIRED] : []}>
                            {!editing ? 
                                <Typography>{SOFP.retained_earning || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        <Form.Item label="Other Equity (1)" name="other_equity_1" rules={editing ? [REQUIRED] : []}>
                            {!editing ? 
                                <Typography>{SOFP.other_equity_1 || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        <Form.Item label="Other Equity (2)" name="other_equity_2" rules={editing ? [REQUIRED] : []}>
                            {!editing ? 
                                <Typography>{SOFP.other_equity_2 || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                    </MyCard>
                </Form>
            </>
        }
        </>
    )
}