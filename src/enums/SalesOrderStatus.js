import { Tag } from "antd";

// IMPORTANT: This enums must be the same as POStatus as they share the same enum ids
export const SOStatus = {
    PENDING: { id: 1, name: "Pending", color: "orange" },
    COMPLETED: { id: 2, name: "Completed", color: "yellow" },
    CLOSED: { id: 3, name: "Closed", color: "green" },
    REJECTED: { id: 4, name: "Rejected", color: "red" },
    SENT: { id: 5, name: "Sent (Email)", color: "geekblue" },
    CANCELLED: { id: 6, name: "Cancelled", color: "red" },
    SENT_TEXT: { id: 7, name: "Sent (Text)", color: "geekblue" },
}
    
export function getSalesOrderStatus(id) {
    const foundKey = Object.keys(SOStatus).filter(key => SOStatus[key].id === id);
    if (foundKey.length > 0) {
        return SOStatus[foundKey];
    }
    return null;
}

export function getSalesOrderStatusTag(id) {
    const item = getSalesOrderStatus(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}