import useInitModel from '@/hooks/useInitModel';

export interface SoVanBang {
  id: string;
  n: number;
  idx: number;
}
export interface QuyetDinh {
  id: string;
  sqd: string;
  nbh: string;
  ty: string;
  idsvb: string;
}
export interface Truong {
  id: string;
  t: string;
  k: string;
}
export interface VanBang {
  id: string;
  svs: number;
  sh: string;
  msv: string;
  ht: string;
  ns: string;
  iqd: string;
  other: any;
}

export default () => {
  const m1 = useInitModel<SoVanBang>('a1');
  const m2 = useInitModel<QuyetDinh>('a2');
  const m3 = useInitModel<Truong>('a3');
  const m4 = useInitModel<VanBang>('a4');
  return {
    m1,
    m2,
    m3,
    m4
  }
}
