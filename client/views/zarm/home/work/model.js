const model = {
  namespace: 'work',
  state: {
    isLoad: false,
  },
  reducers: {
    set(state, { payload }) {
      return { ...state, ...payload };
    },

    reset(state) {
      return { ...state, ...model.state };
    },
  },
  effects: {
    *getList({ payload }, { call, put, select }) {
      yield put({ type: 'set', payload: { isLoad: true } });
      const res = new Array(2).fill(1).map((r, i) => i + 1 + 'this is a number!');
      yield put({ type: 'set', payload: { data: res || [] } });
      return res;
    },
  },
};

export default model;
