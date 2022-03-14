import { EditOutlined, SaveOutlined, ExportOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Button, Form, Input, Divider, message, Typography, Popconfirm, Tag } from 'antd'
import React, { useState } from 'react'
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function BalanceSheetAsset({ BalanceSheet, setBalanceSheet }) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopConfirm, setShowPopConfirm] = useState(false);
    const [form] = Form.useForm();

    const totalCurrentAssets = (parseFloat(BalanceSheet.cash_sales_of_goods) + parseFloat(BalanceSheet.cash_others) + parseFloat(BalanceSheet.account_receivable) + parseFloat(BalanceSheet.inventory) + parseFloat(BalanceSheet.supplies) + parseFloat(BalanceSheet.prepaid_insurance) + parseFloat(BalanceSheet.prepaid_rent) + parseFloat(BalanceSheet.other_current_asset_1) + parseFloat(BalanceSheet.other_current_asset_2)).toFixed(2);

    const totalNonCurrentAssets = (parseFloat(BalanceSheet.land) - parseFloat(BalanceSheet.less_accumulated_depreciation_land) + parseFloat(BalanceSheet.building) - parseFloat(BalanceSheet.less_accumulated_depreciation_building) + parseFloat(BalanceSheet.equipments) - parseFloat(BalanceSheet.less_accumulated_depreciation_equipments) + parseFloat(BalanceSheet.other_non_current_asset_1) + parseFloat(BalanceSheet.other_non_current_asset_2)).toFixed(2);

    const totalIntangibleAssets = (parseFloat(BalanceSheet.goodwill) + parseFloat(BalanceSheet.trade_names) + parseFloat(BalanceSheet.other_intangible_asset_1) + parseFloat(BalanceSheet.other_intangible_asset_2)).toFixed(2);

    const totalAssets = (parseFloat(totalCurrentAssets) + parseFloat(totalNonCurrentAssets) + parseFloat(totalIntangibleAssets)).toFixed(2);

    const totalCurrentLiabilities = (parseFloat(BalanceSheet.account_payable) + parseFloat(BalanceSheet.salary_payable) + parseFloat(BalanceSheet.interest_payable) + parseFloat(BalanceSheet.taxes_payable) + parseFloat(BalanceSheet.warranty_payable) + parseFloat(BalanceSheet.rental_payable) + parseFloat(BalanceSheet.other_current_liability_1) + parseFloat(BalanceSheet.other_current_liability_2) + parseFloat(BalanceSheet.other_non_current_liability_1) + parseFloat(BalanceSheet.other_non_current_liability_2)).toFixed(2);

    const totalNonCurrentLiabilities = (parseFloat(BalanceSheet.notes_payable) + parseFloat(BalanceSheet.bonds_payable)).toFixed(2);

    const totalLiabilities = (parseFloat(totalCurrentLiabilities) + parseFloat(totalNonCurrentLiabilities)).toFixed(2);

    const totalEquities = (parseFloat(BalanceSheet.share_capital) - parseFloat(BalanceSheet.less_withdrawal) + parseFloat(BalanceSheet.retained_earning) + parseFloat(BalanceSheet.other_equity_1) + parseFloat(BalanceSheet.other_equity_2)).toFixed(2);

    const totalLiabilitiesAndEquities = (parseFloat(totalLiabilities) + parseFloat(totalEquities)).toFixed(2);

    const checkPopConfirmVisibility = () => {
        if (totalAssets != totalLiabilitiesAndEquities) {
            setShowPopConfirm(true);
        } else {
            setShowPopConfirm(false);
        }
    }

    const handleExport = () => {
        setShowPopConfirm(false);
    }

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            AccountingAPIHelper.updateBalanceSheet({...values, id: BalanceSheet.id })
                .then(() => {
                    setLoading(false);
                    setBalanceSheet({...BalanceSheet, ...values });
                    message.success('Balance Sheet successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <>
        { BalanceSheet != null &&
            <>
                <Form form={form} labelCol={{ span: 14 }} wrapperCol={{ span: 24 }} autoComplete="off" labelAlign="left" initialValues={{...BalanceSheet}}>
                    <MyCard>
                        <MyToolbar title="Balance Sheet Details">
                            { hasWriteAccessTo(View.ACCOUNTING.name) && 
                            <>
                                <Form.Item>
                                    { editing ? 
                                        <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                                        :
                                        <>
                                            <Popconfirm title="The balance sheet is not balanced. Continue exporting?" placement='leftTop' visible={showPopConfirm} onConfirm={handleExport} disabled={loading}>
                                                <Button onClick={checkPopConfirmVisibility} icon={<ExportOutlined />} loading={loading} style={{ marginRight: '1rem' }}>Export as PDF</Button>
                                            </Popconfirm>
                                            <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }}>Edit</Button>
                                        </>
                                    }
                                </Form.Item>
                            </>
                            }
                        </MyToolbar>

                        <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="Name" name="name" rules={editing ? [REQUIRED] : []}>
                            {!editing ? 
                                <Typography>{BalanceSheet.name || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="End Date" name="end_date">
                            <Typography>{parseDate(BalanceSheet.end_date) || '-'}</Typography>
                        </Form.Item>
                        <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} label="Remarks" name="remarks">
                            {!editing ? 
                                <Typography>{BalanceSheet.remarks || '-'}</Typography>
                            :
                                <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                            }
                        </Form.Item>

                    </MyCard>

                    <MyCard>
                        <Typography.Title level={5} style={{ textAlign: 'center', margin: '2rem 0 0' }}>Chop Chuan Bee</Typography.Title>
                        <Typography.Title level={5} style={{ textAlign: 'center', margin: 0 }}>Balance Sheet</Typography.Title>
                        <Typography.Title level={5} style={{ textAlign: 'center', margin: '0 0 2rem' }}>As at {parseDate(BalanceSheet.end_date)}</Typography.Title>

                        <Row>
                            <Col xl={11} xs={24} style={{marginRight: 'auto'}}>
                                <Typography.Title level={5}>Assets</Typography.Title>
                                <Divider />
                                <Typography.Title level={5}>Current Assets</Typography.Title>
                                <Form.Item label="Cash (Sales of Goods)" name="cash_sales_of_goods" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.cash_sales_of_goods).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Cash (Others)" name="cash_others" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.cash_others).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Account Receivable" name="account_receivable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.account_receivable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Inventory" name="inventory" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.inventory).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Supplies" name="supplies" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.supplies).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Prepaid Insurance" name="prepaid_insurance" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.prepaid_insurance).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Prepaid Rent" name="prepaid_rent" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.prepaid_rent).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>

                                <Form.Item label="Other current assets (1)" name="other_current_asset_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_current_asset_1).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other current assets (2)" name="other_current_asset_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}> 
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_current_asset_2).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>

                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{totalCurrentAssets}</span></Typography.Title>}

                                <Typography.Title level={5} style={{marginTop:'1rem'}}>Non-Current Assets</Typography.Title>
                                <Form.Item label="Land" name="land" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.land).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Accumulated Depreciation" name="less_accumulated_depreciation_land" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" + parseFloat(BalanceSheet.less_accumulated_depreciation_land).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Building" name="building" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.building).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Accumulated Depreciation" name="less_accumulated_depreciation_building" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" + parseFloat(BalanceSheet.less_accumulated_depreciation_building).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Equipments" name="equipments" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.equipments).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Accumulated Depreciation" name="less_accumulated_depreciation_equipments" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" +  parseFloat(BalanceSheet.less_accumulated_depreciation_equipments).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Asset (1)" name="other_non_current_asset_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_non_current_asset_1).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Asset (2)" name="other_non_current_asset_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_non_current_asset_2).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{totalNonCurrentAssets}</span></Typography.Title>}

                                <Typography.Title level={5}>Intangible Assets</Typography.Title>
                                <Form.Item label="Goodwill" name="goodwill" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.goodwill).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Trade names" name="trade_names" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.trade_names).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Intangible Asset (1)" name="other_intangible_asset_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_intangible_asset_1).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Intangible Asset (2)" name="other_intangible_asset_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_intangible_asset_2).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{totalIntangibleAssets}</span></Typography.Title>}
                            </Col>

                            <Col xl={11} xs={24} style={{marginLeft: 'auto'}}>
                                <Typography.Title level={5}>Liabilities</Typography.Title>
                                <Divider />
                                <Typography.Title level={5}>Current Liabilities</Typography.Title>
                                <Form.Item label="Account Payable" name="account_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.account_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Salary Payable" name="salary_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.salary_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Interest Payable" name="interest_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.interest_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Tax Payable" name="taxes_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.taxes_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Warranty Payable" name="warranty_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.warranty_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Rental Payable" name="rental_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.rental_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Current Liability (1)" name="other_current_liability_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_current_liability_1).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Current Liability (2)" name="other_current_liability_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_current_liability_2).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{totalCurrentLiabilities}</span></Typography.Title>}

                                <Typography.Title level={5} style={{marginTop:'1rem'}}>Non-Current Liabilities</Typography.Title>
                                <Form.Item label="Notes Payable" name="notes_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.notes_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Bonds Payable" name="bonds_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.bonds_payable).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Liability (1)" name="other_non_current_liability_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_non_current_liability_1).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Liability (2)" name="other_non_current_liability_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_non_current_liability_2).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{totalNonCurrentLiabilities}</span></Typography.Title>}
                                
                                <Row>                                    
                                    <Typography.Title level={5} style={{fontWeight: 'bold', marginTop:'2rem' }}>TOTAL LIABILITIES</Typography.Title>
                                    <Typography.Title level={5} style={{marginLeft:'auto', marginTop: '2rem'}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{totalLiabilities}</Typography.Title>
                                </Row>

                                <Typography.Title level={5} style={{marginTop:'1rem' }}>Equity</Typography.Title>
                                <Divider />
                                <Form.Item label="Share Capital" name="share_capital" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.share_capital).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Withdrawal" name="less_withdrawal" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" + parseFloat(BalanceSheet.less_withdrawal).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Retained Earning" name="retained_earning" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.retained_earning).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Equity (1)" name="other_equity_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_equity_1).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                <Form.Item label="Other Equity (2)" name="other_equity_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{parseFloat(BalanceSheet.other_equity_2).toFixed(2) || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{totalEquities}</span></Typography.Title>}
                            </Col>
                        </Row>

                        <Row>
                            <Col xl={11} xs={24} style={{marginRight: 'auto'}}>
                            <Divider/>
                            <Row>
                                <Typography.Title level={5} style={{fontWeight: 'bold' }}>TOTAL ASSETS</Typography.Title>
                                <Typography.Title level={5} style={{marginLeft:'auto', marginTop: 0}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{totalAssets}</Typography.Title>
                            </Row>
                            </Col>

                            <Col xl={11} xs={24} style={{marginLeft: 'auto'}}>
                            <Divider/>
                            <Row>
                                <Typography.Title level={5} style={{fontWeight: 'bold' }}>TOTAL LIABILITIES AND EQUITIES</Typography.Title>
                                <Typography.Title level={5} style={{marginLeft:'auto', marginTop: 0}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{totalLiabilitiesAndEquities}</Typography.Title>
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