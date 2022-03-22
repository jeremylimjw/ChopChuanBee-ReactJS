import { Tag } from "antd";

export const DeliveryStatus = {
    PENDING: { id: 1, name: "Pending", color: "blue" },
    ASSIGNED: { id: 2, name: "Assigned", color: "orange" },
    COMPLETED: { id: 3, name: "Completed", color: "green" },
}
    
export function getDeliveryStatus(id) {
    const foundKey = Object.keys(DeliveryStatus).filter(key => DeliveryStatus[key].id === id);
    if (foundKey.length > 0) {
        return DeliveryStatus[foundKey];
    }
    return null;
}

export function getDeliveryStatusTag(id) {
    const item = getDeliveryStatus(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}