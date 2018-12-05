import * as unistore from 'unistore/react';
import LoadMaskCmp, { ILoadMaskProps } from './view';
import { IPendingState } from 'src/stores/features/pending';
import { StateMapper } from 'unistore';

const stateMapper: StateMapper<ILoadMaskProps, IPendingState, Partial<ILoadMaskProps>> = (s: IPendingState) => ({
    white: true,
    visible: s.pendingSet.size > 0,
});

export const LoadMask = unistore.connect(stateMapper)(LoadMaskCmp);
