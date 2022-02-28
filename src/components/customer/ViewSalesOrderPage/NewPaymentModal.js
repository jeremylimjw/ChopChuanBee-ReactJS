import { Form, InputNumber, message, Select } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { SalesOrderApiHelper } from '../../../api/SalesOrderApiHelper';
import { AccountingType } from '../../../enums/AccountingType';
import { MovementType } from '../../../enums/MovementType';
import { PaymentMethod } from '../../../enums/PaymentMethod';
import { PaymentTerm } from '../../../enums/PaymentTerm';
import { SalesOrder } from '../../../models/SalesOrder';
import { useApp } from '../../../providers/AppProvider';

export default function NewPaymentModal({ salesOrder, setSalesOrder, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();

    const [form, setForm] = useState({
        amount: 0,
        payment_method_id: 1,
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (salesOrder != null) {
            const remaining_total = salesOrder.getOrderTotal() - salesOrder.getPaymentsTotal();
            setForm({ 
                amount: remaining_total > 0 ? remaining_total : 0, 
                payment_method_id: 1 
            })
        }
    }, [salesOrder])

    function renderTitle() {
        switch(isModalVisible) {
            case 1: return 'Create New Payment';
            case 2 : return 'Register a Refund';
            default: return '';
        }
    }

    function handleFormSubmit() {
        const payment = { ...form, sales_order_id: salesOrder.id };

        if (isModalVisible === 1) { // Make payment
            // Validation
            const max = salesOrder.getOrderTotal() - salesOrder.getPaymentsTotal();
            if (payment.amount > max) {
                message.error('Cannot pay more than the balance amount.')
                return;
            }

            payment.movement_type_id = MovementType.SALE.id;
            payment.amount = +payment.amount;
        } else if (isModalVisible === 2) { // Make refund
            // Validation
            const max = salesOrder.getPaymentsTotal();
            if (payment.amount > max) {
                message.error('Cannot refund more than amount paid.')
                return;
            }

            payment.movement_type_id = MovementType.REFUND.id;
            payment.amount = -payment.amount;
        }

        if (salesOrder.isPaymentTerm(PaymentTerm.CREDIT)) {
            payment.accounting_type_id = AccountingType.RECEIVABLE.id;
        }

        SalesOrderApiHelper.createPayment(payment)
            .then(newPayment => {
                const newPayments = [...salesOrder.payments];
                newPayments.push(newPayment);
                setLoading(false);
                setIsModalVisible(0);
                
                if (isModalVisible === 1) { // Make payment
                    message.success("Payment successfully registered!");
                } else if (isModalVisible === 2) { // Make refund
                    message.success("Refund successfully registered!");
                }
                
                setSalesOrder(new SalesOrder({...salesOrder, payments: newPayments}));

            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <Modal title={renderTitle()} visible={isModalVisible !== 0} 
            onOk={handleFormSubmit} onCancel={() => setIsModalVisible(0)} width={400} 
            okButtonProps={{ disabled: (form.amount === 0 || loading) }}>

            <Form layout='horizontal' labelCol={{ span: 9 }} wrapperCol={{ span: 11 }}>
                <Form.Item label="Amount">
                    <InputNumber 
                        value={form.amount} min={0} addonBefore="$"
                        onChange={(value) => setForm({...form, amount: value })} 
                    />
                </Form.Item>
                <Form.Item label="Payment Method">
                    <Select
                        value={form.payment_method_id}
                        onChange={(value) => setForm({...form, payment_method_id: value }) }
                    >
                        {Object.keys(PaymentMethod).map((key, idx) => <Select.Option key={idx} value={PaymentMethod[key].id}>{PaymentMethod[key].name}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>

        </Modal>
    )
}
