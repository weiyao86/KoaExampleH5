import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { Icon, TabBar, Cell, Button } from 'zarm';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import './style.less';

const TabIcon = Icon.createFromIconfont('//at.alicdn.com/t/font_1340918_lpsswvb7yv.js');

const Work = (props) => {
  const [visible, setVisible] = useState(true);
  const [person, setPerson] = useState({ name: 'test', age: 24 });

  return (
    <div className='page-content'>
      <div className='context'>me--</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    home: state.home,
  };
};

export default connect(mapStateToProps, null)(Work);
