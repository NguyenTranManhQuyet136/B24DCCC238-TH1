import { useState } from 'react';

export default () => {
    const [a1, b1] = useState<any[]>([
        { id: 101, ten: "Cat toc", gia: 50000, tg: 30 },
        { id: 102, ten: "Goi dau", gia: 40000, tg: 20 },
        { id: 103, ten: "Nhuom toc", gia: 250000, tg: 120 }
    ]);
    const [a2, b2] = useState(false);
    const [a3, b3] = useState(false);
    const [a4, b4] = useState<any>(null);

    const c1 = (o: any) => {
        b1([...a1, { ...o, id: new Date().getTime() }]);
    };

    const c2 = (id: any, val: any) => {
        const x = [...a1];
        const idx = x.findIndex(q => q.id === id);
        if (idx >= 0) {
            x[idx] = { ...x[idx], ...val };
            b1(x);
        }
    };

    const c3 = (id: any) => {
        b1(a1.filter(q => q.id !== id));
    };

    return {
        a1, b1, a2, b2, a3, b3, a4, b4, c1, c2, c3
    };
};
