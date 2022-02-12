import { Tag } from "antd";

export const POStatus = {
    PENDING: { id: 1, name: "Pending", color: "orange" },
    ACCEPTED: { id: 2, name: "Accepted", color: "yellow" },
    CLOSED: { id: 3, name: "Closed", color: "green" },
    REJECTED: { id: 4, name: "Rejected", color: "red" },
    SENT: { id: 5, name: "Sent", color: "geekblue" },
    CANCELLED: { id: 6, name: "Cancelled", color: "red" },
}
    
export function getPurchaseOrderStatus(id) {
    const foundKey = Object.keys(POStatus).filter(key => POStatus[key].id === id);
    if (foundKey.length > 0) {
        return POStatus[foundKey];
    }
    return null;
}

export function getPurchaseOrderStatusTag(id) {
    const item = getPurchaseOrderStatus(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}