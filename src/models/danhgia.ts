import { useState } from 'react';

export default () => {
    const [dg, sdg] = useState<any[]>([
        { id: 2001, nv: 1, khach: "Nguyen Van C", diem: 4, cmt: "Tot", rep: "" }
    ]);
    const [modal, setModal] = useState(false);
    const [obj, setObj] = useState<any>(null);

    const gui = (x: any) => {
        sdg([...dg, { ...x, id: new Date().getTime(), nv: Number(x.nv), diem: Number(x.diem) }]);
    };

    const traphanhoi = (id: any, r: any) => {
        const arr = [...dg];
        const i = arr.findIndex(q => q.id === id);
        if (i >= 0) {
            arr[i] = { ...arr[i], rep: r };
            sdg(arr);
        }
    };

    return {
        dg, sdg, modal, setModal, obj, setObj, gui, traphanhoi
    };
};
