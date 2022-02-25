import { Tag } from "antd";

export const Role = {
    ADMIN: { id: 1, name: "Admin", color: "volcano" },
    STAFF: { id: 2, name: "Staff", color: "blue" },
    DRIVER: { id: 3, name: "Driver", color: "green" },
}
    
export function getRole(id) {
    const foundKey = Object.keys(Role).filter(key => Role[key].id === id);
    if (foundKey.length > 0) {
        return Role[foundKey];
    }
    return null;
}

export function getRoleTag(id) {
    const item = getRole(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}