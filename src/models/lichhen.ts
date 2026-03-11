import { useState } from 'react';

export default () => {
    const [lh, slh] = useState<any[]>([
        { id: 1001, nv: 1, dv: 101, khach: "Nguyen Van C", sdt: "012345678", ngay: "2026-03-12", gio: "10:30", tt: "Chờ duyệt" }
    ]);
    const [modal, setModal] = useState(false);
    const [obj, setObj] = useState<any>(null);

    const them = (x: any) => {
        slh([...lh, { ...x, id: new Date().getTime(), tt: "Chờ duyệt" }]);
    };

    const capnhat = (id: any, val: any) => {
        const arr = [...lh];
        const i = arr.findIndex(q => q.id === id);
        if (i >= 0) {
            arr[i] = { ...arr[i], ...val };
            slh(arr);
        }
    };

    const xoa = (id: any) => {
        slh(lh.filter(q => q.id !== id));
    };

    return {
        lh, slh, modal, setModal, obj, setObj, them, capnhat, xoa
    };
};
