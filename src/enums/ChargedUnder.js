import { Tag } from "antd";

export const ChargedUnder = {
    CCB: { id: 1, name: "CCB", color: "green" },
    CBFS: { id: 2, name: "CBFS", color: "blue" },
}
    
export function getChargedUnder(id) {
    const foundKey = Object.keys(ChargedUnder).filter(key => ChargedUnder[key].id === id);
    if (foundKey.length > 0) {
        return ChargedUnder[foundKey];
    }
    return null;
}

export function getChargedUnderTag(id) {
    const item = getChargedUnder(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}