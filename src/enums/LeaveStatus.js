import { Tag } from "antd";

export const LeaveStatus = {
    PENDING: { id: 1, name: "Pending", color: "blue" },
    APPROVED: { id: 2, name: "Approved", color: "green" },
    REJECTED: { id: 3, name: "Rejected", color: "red" },
    CANCELLED: { id: 4, name: "Cancelled", color: "volcano" }
}
    
export function getLeaveStatus(id) {
    const foundKey = Object.keys(LeaveStatus).filter(key => LeaveStatus[key].id === id);
    if (foundKey.length > 0) {
        return LeaveStatus[foundKey];
    }
    return null;
}

export function getLeaveStatusTag(id) {
    const item = getLeaveStatus(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}