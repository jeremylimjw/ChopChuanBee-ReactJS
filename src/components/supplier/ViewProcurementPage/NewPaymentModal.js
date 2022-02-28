import { Form, InputNumber, message, Select } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { PurchaseOrderApiHelper } from '../../../api/PurchaseOrderApiHelper';
import { AccountingType } from '../../../enums/AccountingType';
import { MovementType } from '../../../enums/MovementType';
import { PaymentMethod } from '../../../enums/PaymentMethod';
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

        if (isModalVisible === 1) { // Make payment
            // Validation
            const max = purchaseOrder.getOrderTotal() - purchaseOrder.getPaymentsTotal();
            if (payment.amount > max) {
                message.error('Cannot pay more than the balance amount.')
                return;
            }

            payment.movement_type_id = MovementType.PURCHASE.id;
            payment.amount = -payment.amount;
        } else if (isModalVisible === 2) { // Make refund
            // Validation
            const max = purchaseOrder.getPaymentsTotal();
            if (payment.amount > max) {
                message.error('Cannot refund more than amount paid.')
                return;
            }
            
            payment.movement_type_id = MovementType.REFUND.id;
            payment.amount = +payment.amount;
        }

        if (purchaseOrder.isPaymentTerm(PaymentTerm.CREDIT)) {
            payment.accounting_type_id = AccountingType.PAYABLE.id;
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
                        {Object.keys(PaymentMethod).map((key, idx) => <Select.Option key={idx} value={PaymentMethod[key].id}>{PaymentMethod[key].name}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>

        </Modal>
    )
}
