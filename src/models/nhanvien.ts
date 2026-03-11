import { useState } from 'react';

export default () => {
    const [d, setD] = useState<any[]>([
        { id: 1, ten: "Nguyen Van A", max: 5, ca: "9h-17h" },
        { id: 2, ten: "Tran Thi B", max: 3, ca: "10h-18h" }
    ]);
    const [v, setV] = useState(false);
    const [e, setE] = useState(false);
    const [r, setR] = useState<any>(null);

    const f1 = (newOne: any) => {
        setD([...d, { ...newOne, id: new Date().getTime() }]);
    };

    const f2 = (id: any, val: any) => {
        const x = [...d];
        const idx = x.findIndex(q => q.id === id);
        if (idx >= 0) {
            x[idx] = { ...x[idx], ...val };
            setD(x);
        }
    };

    const f3 = (id: any) => {
        const x = d.filter(q => q.id !== id);
        setD(x);
    };

    return {
        d, setD, v, setV, e, setE, r, setR, f1, f2, f3
    };
};
