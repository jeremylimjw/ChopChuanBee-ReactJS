import { Tag } from "antd";

export const View = {
    HR: { id: 1, name: "HR", color: "orange" },
    CRM: { id: 2, name: "CRM", color: "yellow" },
    SCM: { id: 3, name: "SCM", color: "green" },
    INVENTORY: { id: 4, name: "Inventory", color: "red" },
    SALES: { id: 5, name: "Sales", color: "geekblue" },
    ACCOUNTING: { id: 6, name: "Accounting", color: "magenta" },
    ADMIN: { id: 7, name: "Admin", color: "volcano" },
    GENERAL: { id: 8, name: "General", color: "purple" },
    DISPATCH: { id: 9, name: "Dispatch", color: "lime" },
    CATALOGUE: { id: 10, name: "Catalogue", color: "cyan" },
}
    
export function getView(id) {
    const foundKey = Object.keys(View).filter(key => View[key].id === id);
    if (foundKey.length > 0) {
        return View[foundKey];
    }
    return null;
}

export function getViewTag(id) {
    const item = getView(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}