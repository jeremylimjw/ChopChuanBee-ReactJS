import { Tag } from "antd";

export const PaymentTerm = {
    CASH: { id: 1, name: "Cash", color: "green" },
    CREDIT: { id: 2, name: "Credit", color: "blue" },
}
    
export function getPaymentTerm(id) {
    const foundKey = Object.keys(PaymentTerm).filter(key => PaymentTerm[key].id === id);
    if (foundKey.length > 0) {
        return PaymentTerm[foundKey];
    }
    return null;
}

export function getPaymentTermTag(id) {
    const item = getPaymentTerm(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}