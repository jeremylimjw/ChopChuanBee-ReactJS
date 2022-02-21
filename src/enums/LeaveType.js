import { Tag } from "antd";

export const LeaveType = {
    ANNUAL: { id: 1, name: "Annual", color: "volcano" },
    COMPASSIONATE: { id: 2, name: "Compassionate", color: "blue" },
    MATERNAL: { id: 3, name: "Maternity/Paternity", color: "green" },
    SICK: { id: 4, name: "Sick", color: "yellow" },
    CHILDCARE: { id: 5, name: "Childcare", color: "orange" },
}
    
export function getLeaveAccount(id) {
    const foundKey = Object.keys(LeaveType).filter(key => LeaveType[key].id === id);
    if (foundKey.length > 0) {
        return LeaveType[foundKey];
    }
    return null;
}

export function getLeaveAccountTag(id) {
    const item = getLeaveAccount(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}