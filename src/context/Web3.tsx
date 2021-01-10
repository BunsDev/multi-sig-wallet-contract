import React, {useReducer, createContext, useContext, useEffect, useMemo} from 'react'
import Web3 from 'web3'
import { subscribeToAccount } from '../api/web3'

interface State {
    account: string;
    web3: Web3 | null;
}

const INITIAL_STATE: State = {
    account: '',
    web3: null,
};

const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

interface UpdateAccount {
    type: 'UPDATE_ACCOUNT';
    account: string;
    web3?: Web3;
}

type Action = UpdateAccount;

function reducer(state: State = INITIAL_STATE, action: Action) {
    switch (action.type) {
        case UPDATE_ACCOUNT: {
            const web3 = action.web3 || state.web3;
            const { account } = action;

            return {
                ...state,
                web3,
                account,
            };
        }
        default:
            return state;
    }
}