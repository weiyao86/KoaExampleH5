/**
 * global model
 */
const model = {
  namespace: 'global',
  state: {
    stateName: 'this is a global var',
  },

  //change state only there
  reducers: {
    set(state, { payload }) {
      return { ...state, ...payload };
    },

    reset(state) {
      return { ...state, ...model.state };
    },
  },

  effects: {
    *getGlobalData(state, { call, put, select }) {
      return yield call(() => {
        return new Promise((r, j) => {
          setTimeout(() => {
            r('success');
          }, 1000);
        });
      });
    },
  },
};

export default model;
