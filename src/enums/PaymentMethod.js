import { Tag } from "antd";

export const PaymentMethod = {
    CASH: { id: 1, name: "Cash", color: "green" },
    PAYNOW: { id: 2, name: "PayNow", color: "blue" },
    PAYLAH: { id: 3, name: "PayLah", color: "geekblue" },
    BANK_TRANSFER: { id: 4, name: "Bank Transfer", color: "yellow" },
    CHEQUE: { id: 5, name: "Cheque", color: "orange" },
}
    
export function getPaymentMethod(id) {
    const foundKey = Object.keys(PaymentMethod).filter(key => PaymentMethod[key].id === id);
    if (foundKey.length > 0) {
        return PaymentMethod[foundKey];
    }
    return null;
}

export function getPaymentMethodTag(id) {
    const item = getPaymentMethod(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}