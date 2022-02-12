import { Form, InputNumber, message, Select } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { PurchaseOrderApiHelper } from '../../../api/purchaseOrder'
import { PaymentTerm } from '../../../enums/PaymentTerm';
import { PurchaseOrder } from '../../../models/PurchaseOrder';
import { useApp } from '../../../providers/AppProvider';

export default function NewPaymentModal({ purchaseOrder, setPurchaseOrder, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();

    const [form, setForm] = useState({
        amount: 0,
        payment_method_id: 1,
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (purchaseOrder != null) {
            const remaining_total = purchaseOrder.getOrderTotal() - purchaseOrder.getPaymentsTotal();
            setForm({ 
                amount: remaining_total > 0 ? remaining_total : 0, 
                payment_method_id: 1 
            })
        }
    }, [purchaseOrder])

    function renderTitle() {
        switch(isModalVisible) {
            case 1: return 'Create New Payment';
            case 2 : return 'Refund to Supplier';
            default: return '';
        }
    }

    function handleFormSubmit() {
        const payment = { ...form, purchase_order_id: purchaseOrder.id };

        // movement_type_id: 1 is purchase
        // movement_type_id: 3 is refund
        if (isModalVisible === 1) { // Make payment
            payment.movement_type_id = 1;
            payment.amount = -payment.amount;
        } else if (isModalVisible === 2) { // Make refund
            payment.movement_type_id = 3;
            payment.amount = +payment.amount;
        }

        if (purchaseOrder.isPaymentTerm(PaymentTerm.CREDIT)) {
            payment.accounting_type_id = 1; // Create as Account Payable
        }

        PurchaseOrderApiHelper.createPayment(payment)
            .then(newPayment => {
                const newPayments = [...purchaseOrder.payments];
                newPayments.push(newPayment);
                setLoading(false);
                setIsModalVisible(0);
                
                if (isModalVisible === 1) { // Make payment
                    message.success("Payment successfully registered!");
                } else if (isModalVisible === 2) { // Make refund
                    message.success("Refund successfully registered!");
                }
                
                setPurchaseOrder(new PurchaseOrder({...purchaseOrder, payments: newPayments}));

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
                        <Select.Option value={1}>Cash</Select.Option>
                        <Select.Option value={2}>PayNow</Select.Option>
                        <Select.Option value={3}>PayLah</Select.Option>
                        <Select.Option value={4}>Bank Transfer</Select.Option>
                        <Select.Option value={5}>Cheque</Select.Option>
                    </Select>
                </Form.Item>
            </Form>

        </Modal>
    )
}
