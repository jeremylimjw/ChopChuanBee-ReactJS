import { EditOutlined, SaveOutlined, PrinterOutlined, FileExcelOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Button, Form, Input, Divider, message, Typography, Popconfirm, Tag } from 'antd'
import React, { useState } from 'react'
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import { parseDate } from '../../../utilities/datetime';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import { formatCurrency } from '../../../utilities/currency';

export default function BalanceSheetObject({ BalanceSheet, setBalanceSheet }) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopConfirmPDF, setShowPopConfirmPDF] = useState(false);
    const [showPopConfirmExcel, setShowPopConfirmExcel] = useState(false);
    const [form] = Form.useForm();
    const [balanceSheetPDF, setBalanceSheetPDF] = useState([]);

    const totalCurrentAssets = parseFloat(BalanceSheet.cash_sales_of_goods) + parseFloat(BalanceSheet.cash_others) + parseFloat(BalanceSheet.account_receivable) + parseFloat(BalanceSheet.inventory) + parseFloat(BalanceSheet.supplies) + parseFloat(BalanceSheet.prepaid_insurance) + parseFloat(BalanceSheet.prepaid_rent) + parseFloat(BalanceSheet.other_current_asset_1) + parseFloat(BalanceSheet.other_current_asset_2);

    const totalNonCurrentAssets = parseFloat(BalanceSheet.land) - parseFloat(BalanceSheet.less_accumulated_depreciation_land) + parseFloat(BalanceSheet.building) - parseFloat(BalanceSheet.less_accumulated_depreciation_building) + parseFloat(BalanceSheet.equipments) - parseFloat(BalanceSheet.less_accumulated_depreciation_equipments) + parseFloat(BalanceSheet.other_non_current_asset_1) + parseFloat(BalanceSheet.other_non_current_asset_2);

    const totalIntangibleAssets = parseFloat(BalanceSheet.goodwill) + parseFloat(BalanceSheet.trade_names) + parseFloat(BalanceSheet.other_intangible_asset_1) + parseFloat(BalanceSheet.other_intangible_asset_2);

    const totalAssets = parseFloat(totalCurrentAssets) + parseFloat(totalNonCurrentAssets) + parseFloat(totalIntangibleAssets);

    const totalCurrentLiabilities = parseFloat(BalanceSheet.account_payable) + parseFloat(BalanceSheet.salary_payable) + parseFloat(BalanceSheet.interest_payable) + parseFloat(BalanceSheet.taxes_payable) + parseFloat(BalanceSheet.warranty_payable) + parseFloat(BalanceSheet.rental_payable) + parseFloat(BalanceSheet.other_current_liability_1) + parseFloat(BalanceSheet.other_current_liability_2);

    const totalNonCurrentLiabilities = parseFloat(BalanceSheet.notes_payable) + parseFloat(BalanceSheet.bonds_payable) + parseFloat(BalanceSheet.other_non_current_liability_1) + parseFloat(BalanceSheet.other_non_current_liability_2);

    const totalLiabilities = parseFloat(totalCurrentLiabilities) + parseFloat(totalNonCurrentLiabilities);

    const totalEquities = parseFloat(BalanceSheet.share_capital) - parseFloat(BalanceSheet.less_withdrawal) + parseFloat(BalanceSheet.retained_earning) + parseFloat(BalanceSheet.other_equity_1) + parseFloat(BalanceSheet.other_equity_2);

    const totalLiabilitiesAndEquities = parseFloat(totalLiabilities) + parseFloat(totalEquities);

    const checkPopConfirmPDFVisibility = () => {
        if (totalAssets != totalLiabilitiesAndEquities) {
            setShowPopConfirmPDF(true);
        } else {
            setShowPopConfirmPDF(false);
        }
    }    

    const checkPopConfirmExcelVisibility = () => {
        if (totalAssets != totalLiabilitiesAndEquities) {
            setShowPopConfirmExcel(true);
        } else {
            setShowPopConfirmExcel(false);
        }
    }  

    const formatPDF = () => {
        balanceSheetPDF.end_date = BalanceSheet.end_date;
        balanceSheetPDF.remarks = BalanceSheet.remarks;

        balanceSheetPDF.cash_sales_of_goods = formatCurrency(BalanceSheet.cash_sales_of_goods);
        balanceSheetPDF.cash_others = formatCurrency(BalanceSheet.cash_others);
        balanceSheetPDF.account_receivable = formatCurrency(BalanceSheet.account_receivable);
        balanceSheetPDF.inventory = formatCurrency(BalanceSheet.inventory);
        balanceSheetPDF.supplies = formatCurrency(BalanceSheet.supplies);
        balanceSheetPDF.prepaid_insurance = formatCurrency(BalanceSheet.prepaid_insurance);
        balanceSheetPDF.prepaid_rent = formatCurrency(BalanceSheet.prepaid_rent);
        balanceSheetPDF.other_current_asset_1 = formatCurrency(BalanceSheet.other_current_asset_1);
        balanceSheetPDF.other_current_asset_2 = formatCurrency(BalanceSheet.other_current_asset_1);
        balanceSheetPDF.other_current_asset_2 = formatCurrency(BalanceSheet.other_current_asset_1);
        balanceSheetPDF.totalCurrentAssets = formatCurrency(totalCurrentAssets);

        balanceSheetPDF.land = formatCurrency(BalanceSheet.land);
        balanceSheetPDF.less_accumulated_depreciation_land = formatCurrency(BalanceSheet.less_accumulated_depreciation_land);
        balanceSheetPDF.building = formatCurrency(BalanceSheet.building);
        balanceSheetPDF.less_accumulated_depreciation_building = formatCurrency(BalanceSheet.less_accumulated_depreciation_building);
        balanceSheetPDF.equipments = formatCurrency(BalanceSheet.equipments);
        balanceSheetPDF.less_accumulated_depreciation_equipments = formatCurrency(BalanceSheet.less_accumulated_depreciation_equipments);
        balanceSheetPDF.other_non_current_asset_1 = formatCurrency(BalanceSheet.other_non_current_asset_1);
        balanceSheetPDF.other_non_current_asset_2 = formatCurrency(BalanceSheet.other_non_current_asset_2);
        balanceSheetPDF.totalNonCurrentAssets = formatCurrency(totalNonCurrentAssets);

        balanceSheetPDF.goodwill = formatCurrency(BalanceSheet.goodwill);
        balanceSheetPDF.trade_names = formatCurrency(BalanceSheet.trade_names);
        balanceSheetPDF.other_intangible_asset_1 = formatCurrency(BalanceSheet.other_intangible_asset_1);
        balanceSheetPDF.other_intangible_asset_2 = formatCurrency(BalanceSheet.other_intangible_asset_2);
        balanceSheetPDF.totalIntangibleAssets = formatCurrency(totalIntangibleAssets);

        balanceSheetPDF.totalAssets = formatCurrency(totalAssets);

        balanceSheetPDF.account_payable = formatCurrency(BalanceSheet.account_payable);
        balanceSheetPDF.salary_payable =  formatCurrency(BalanceSheet.salary_payable);
        balanceSheetPDF.interest_payable =  formatCurrency(BalanceSheet.interest_payable);
        balanceSheetPDF.taxes_payable =  formatCurrency(BalanceSheet.taxes_payable);
        balanceSheetPDF.warranty_payable =  formatCurrency(BalanceSheet.warranty_payable);
        balanceSheetPDF.rental_payable =  formatCurrency(BalanceSheet.rental_payable);
        balanceSheetPDF.other_current_liability_1 =  formatCurrency(BalanceSheet.other_current_liability_1);
        balanceSheetPDF.other_current_liability_2 =  formatCurrency(BalanceSheet.other_current_liability_2);
        balanceSheetPDF.totalCurrentLiabilities = formatCurrency(totalCurrentLiabilities);
        
        balanceSheetPDF.notes_payable =  formatCurrency(BalanceSheet.notes_payable);
        balanceSheetPDF.bonds_payable =  formatCurrency(BalanceSheet.bonds_payable);
        balanceSheetPDF.other_non_current_liability_1 =  formatCurrency(BalanceSheet.other_non_current_liability_1);
        balanceSheetPDF.other_non_current_liability_2 =  formatCurrency(BalanceSheet.other_non_current_liability_2);
        balanceSheetPDF.totalNonCurrentLiabilities = formatCurrency(totalNonCurrentLiabilities);

        balanceSheetPDF.totalLiabilities = formatCurrency(totalLiabilities);

        balanceSheetPDF.share_capital =  formatCurrency(BalanceSheet.share_capital);
        balanceSheetPDF.less_withdrawal =  formatCurrency(BalanceSheet.less_withdrawal);
        balanceSheetPDF.retained_earning =  formatCurrency(BalanceSheet.retained_earning);
        balanceSheetPDF.other_equity_1 =  formatCurrency(BalanceSheet.other_equity_1);
        balanceSheetPDF.other_equity_2 =  formatCurrency(BalanceSheet.other_equity_2);
        balanceSheetPDF.totalEquities = formatCurrency(totalEquities);

        balanceSheetPDF.totalLiabilitiesAndEquities = formatCurrency(totalLiabilitiesAndEquities);
    }

    const formatExcel = () => {
        BalanceSheet.cash_sales_of_goods = parseFloat(BalanceSheet.cash_sales_of_goods);
        BalanceSheet.cash_others = parseFloat(BalanceSheet.cash_others);
        BalanceSheet.account_receivable = parseFloat(BalanceSheet.account_receivable);
        BalanceSheet.inventory = parseFloat(BalanceSheet.inventory);
        BalanceSheet.supplies = parseFloat(BalanceSheet.supplies);
        BalanceSheet.prepaid_insurance = parseFloat(BalanceSheet.prepaid_insurance);
        BalanceSheet.prepaid_rent = parseFloat(BalanceSheet.prepaid_rent);
        BalanceSheet.other_current_asset_1 = parseFloat(BalanceSheet.other_current_asset_1);
        BalanceSheet.other_current_asset_2 = parseFloat(BalanceSheet.other_current_asset_1);
        BalanceSheet.other_current_asset_2 = parseFloat(BalanceSheet.other_current_asset_1);
        BalanceSheet.totalCurrentAssets = totalCurrentAssets;

        BalanceSheet.land = parseFloat(BalanceSheet.land);
        BalanceSheet.less_accumulated_depreciation_land = parseFloat(BalanceSheet.less_accumulated_depreciation_land);
        BalanceSheet.building = parseFloat(BalanceSheet.building);
        BalanceSheet.less_accumulated_depreciation_building = parseFloat(BalanceSheet.less_accumulated_depreciation_building);
        BalanceSheet.equipments = parseFloat(BalanceSheet.equipments);
        BalanceSheet.less_accumulated_depreciation_equipments = parseFloat(BalanceSheet.less_accumulated_depreciation_equipments);
        BalanceSheet.other_non_current_asset_1 = parseFloat(BalanceSheet.other_non_current_asset_1);
        BalanceSheet.other_non_current_asset_2 = parseFloat(BalanceSheet.other_non_current_asset_2);
        BalanceSheet.totalNonCurrentAssets = totalNonCurrentAssets;

        BalanceSheet.goodwill = parseFloat(BalanceSheet.goodwill);
        BalanceSheet.trade_names = parseFloat(BalanceSheet.trade_names);
        BalanceSheet.other_intangible_asset_1 = parseFloat(BalanceSheet.other_intangible_asset_1);
        BalanceSheet.other_intangible_asset_2 = parseFloat(BalanceSheet.other_intangible_asset_2);
        BalanceSheet.totalIntangibleAssets = totalIntangibleAssets;

        BalanceSheet.totalAssets = totalAssets;

        BalanceSheet.account_payable = parseFloat(BalanceSheet.account_payable);
        BalanceSheet.salary_payable =  parseFloat(BalanceSheet.salary_payable);
        BalanceSheet.interest_payable =  parseFloat(BalanceSheet.interest_payable);
        BalanceSheet.taxes_payable =  parseFloat(BalanceSheet.taxes_payable);
        BalanceSheet.warranty_payable =  parseFloat(BalanceSheet.warranty_payable);
        BalanceSheet.rental_payable =  parseFloat(BalanceSheet.rental_payable);
        BalanceSheet.other_current_liability_1 =  parseFloat(BalanceSheet.other_current_liability_1);
        BalanceSheet.other_current_liability_2 =  parseFloat(BalanceSheet.other_current_liability_2);
        BalanceSheet.totalCurrentLiabilities = totalCurrentLiabilities;
        
        BalanceSheet.notes_payable =  parseFloat(BalanceSheet.notes_payable);
        BalanceSheet.bonds_payable =  parseFloat(BalanceSheet.bonds_payable);
        BalanceSheet.other_non_current_liability_1 =  parseFloat(BalanceSheet.other_non_current_liability_1);
        BalanceSheet.other_non_current_liability_2 =  parseFloat(BalanceSheet.other_non_current_liability_2);
        BalanceSheet.totalNonCurrentLiabilities = totalNonCurrentLiabilities;

        BalanceSheet.totalLiabilities = totalLiabilities;

        BalanceSheet.share_capital =  parseFloat(BalanceSheet.share_capital);
        BalanceSheet.less_withdrawal =  parseFloat(BalanceSheet.less_withdrawal);
        BalanceSheet.retained_earning =  parseFloat(BalanceSheet.retained_earning);
        BalanceSheet.other_equity_1 =  parseFloat(BalanceSheet.other_equity_1);
        BalanceSheet.other_equity_2 =  parseFloat(BalanceSheet.other_equity_2);
        BalanceSheet.totalEquities = totalEquities;

        BalanceSheet.totalLiabilitiesAndEquities = totalLiabilitiesAndEquities;
    }

    const handleExportPDF = () => {
        setShowPopConfirmPDF(false);
        formatPDF();
        console.log(balanceSheetPDF);
    }

    const handleExportExcel = () => {
        setShowPopConfirmExcel(false);
        formatExcel();
        console.log(BalanceSheet);
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
                                            <Popconfirm title="The balance sheet is not balanced. Continue exporting?" placement='leftTop' visible={showPopConfirmPDF} onConfirm={handleExportPDF} disabled={loading}>
                                                <Button onClick={checkPopConfirmPDFVisibility} icon={<PrinterOutlined />} loading={loading} style={{ marginRight: '1rem' }}>Export as PDF</Button>
                                            </Popconfirm>

                                            <Popconfirm title="The balance sheet is not balanced. Continue exporting?" placement='leftTop' visible={showPopConfirmExcel} onConfirm={handleExportExcel} disabled={loading}>
                                                <Button onClick={checkPopConfirmExcelVisibility} icon={<FileExcelOutlined />} loading={loading} style={{ marginRight: '1rem' }}>Export as Excel</Button>
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
                                        <Typography>{formatCurrency(BalanceSheet.cash_sales_of_goods) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Cash (Others)" name="cash_others" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.cash_others) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Account Receivable" name="account_receivable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.account_receivable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Inventory" name="inventory" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.inventory) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Supplies" name="supplies" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.supplies) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Prepaid Insurance" name="prepaid_insurance" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.prepaid_insurance) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Prepaid Rent" name="prepaid_rent" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.prepaid_rent) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>

                                <Form.Item label="Other Current Asset (1)" name="other_current_asset_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_current_asset_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Current Asset (2)" name="other_current_asset_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}> 
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_current_asset_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>

                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{formatCurrency(totalCurrentAssets)}</span></Typography.Title>}

                                <Typography.Title level={5} style={{marginTop:'1rem'}}>Non-Current Assets</Typography.Title>
                                <Form.Item label="Land" name="land" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.land) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Accumulated Depreciation" name="less_accumulated_depreciation_land" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" + formatCurrency(BalanceSheet.less_accumulated_depreciation_land) || '-'}</Typography>
                                    :
                                        <Input prefix="-$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Building" name="building" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.building) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Accumulated Depreciation" name="less_accumulated_depreciation_building" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" + formatCurrency(BalanceSheet.less_accumulated_depreciation_building) || '-'}</Typography>
                                    :
                                        <Input prefix="-$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Equipment" name="equipments" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.equipments) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Accumulated Depreciation" name="less_accumulated_depreciation_equipments" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" +  formatCurrency(BalanceSheet.less_accumulated_depreciation_equipments) || '-'}</Typography>
                                    :
                                        <Input prefix="-$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Asset (1)" name="other_non_current_asset_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_non_current_asset_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Asset (2)" name="other_non_current_asset_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_non_current_asset_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{formatCurrency(totalNonCurrentAssets)}</span></Typography.Title>}

                                <Typography.Title level={5}>Intangible Assets</Typography.Title>
                                <Form.Item label="Goodwill" name="goodwill" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.goodwill) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Trade Names" name="trade_names" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.trade_names) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Intangible Asset (1)" name="other_intangible_asset_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_intangible_asset_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Intangible Asset (2)" name="other_intangible_asset_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_intangible_asset_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{formatCurrency(totalIntangibleAssets)}</span></Typography.Title>}
                            </Col>

                            <Col xl={11} xs={24} style={{marginLeft: 'auto'}}>
                                <Typography.Title level={5}>Liabilities</Typography.Title>
                                <Divider />
                                <Typography.Title level={5}>Current Liabilities</Typography.Title>
                                <Form.Item label="Account Payable" name="account_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.account_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Salary Payable" name="salary_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.salary_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Interest Payable" name="interest_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.interest_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Tax Payable" name="taxes_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.taxes_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Warranty Payable" name="warranty_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.warranty_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Rental Payable" name="rental_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.rental_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Current Liability (1)" name="other_current_liability_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_current_liability_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Current Liability (2)" name="other_current_liability_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_current_liability_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{formatCurrency(totalCurrentLiabilities)}</span></Typography.Title>}

                                <Typography.Title level={5} style={{marginTop:'1rem'}}>Non-Current Liabilities</Typography.Title>
                                <Form.Item label="Notes Payable" name="notes_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.notes_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Bonds Payable" name="bonds_payable" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.bonds_payable) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Liability (1)" name="other_non_current_liability_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_non_current_liability_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Non-Current Liability (2)" name="other_non_current_liability_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_non_current_liability_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{formatCurrency(totalNonCurrentLiabilities)}</span></Typography.Title>}
                                
                                <Row>                                    
                                    <Typography.Title level={5} style={{fontWeight: 'bold', marginTop:'2rem' }}>TOTAL LIABILITIES</Typography.Title>
                                    <Typography.Title level={5} style={{marginLeft:'auto', marginTop: '2rem'}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(totalLiabilities)}</Typography.Title>
                                </Row>

                                <Typography.Title level={5} style={{marginTop:'1rem' }}>Equity</Typography.Title>
                                <Divider />
                                <Form.Item label="Share Capital" name="share_capital" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.share_capital) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item labelCol={{ span: 12 , offset: 2 }} label="Less: Withdrawal" name="less_withdrawal" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{"-" + formatCurrency(BalanceSheet.less_withdrawal) || '-'}</Typography>
                                    :
                                        <Input prefix="-$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Retained Earning" name="retained_earning" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.retained_earning) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Equity (1)" name="other_equity_1" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_equity_1) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                <Form.Item label="Other Equity (2)" name="other_equity_2" rules={editing ? [REQUIRED] : []} style={{margin:0, textAlign: 'right'}}>
                                    {!editing ? 
                                        <Typography>{formatCurrency(BalanceSheet.other_equity_2) || '-'}</Typography>
                                    :
                                        <Input prefix="$"/>
                                    }
                                </Form.Item>
                                
                                { !editing && <Typography.Title level={5} style={{textAlign:'right', margin:0 }}><span style={{borderTopStyle:'solid', borderTopWidth:'thin'}}>{formatCurrency(totalEquities)}</span></Typography.Title>}
                            </Col>
                        </Row>

                        <Row>
                            <Col xl={11} xs={24} style={{marginRight: 'auto'}}>
                            <Divider/>
                            <Row>
                                <Typography.Title level={5} style={{fontWeight: 'bold' }}>TOTAL ASSETS</Typography.Title>
                                <Typography.Title level={5} style={{marginLeft:'auto', marginTop: 0}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(totalAssets)}</Typography.Title>
                            </Row>
                            </Col>

                            <Col xl={11} xs={24} style={{marginLeft: 'auto'}}>
                            <Divider/>
                            <Row>
                                <Typography.Title level={5} style={{fontWeight: 'bold' }}>TOTAL LIABILITIES AND EQUITIES</Typography.Title>
                                <Typography.Title level={5} style={{marginLeft:'auto', marginTop: 0}}>{editing && <Tag color='volcano'>BEFORE EDIT</Tag>}{formatCurrency(totalLiabilitiesAndEquities)}</Typography.Title>
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