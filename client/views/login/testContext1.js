import React from 'react';
import { message, Button, Avatar, Divider } from 'antd';
import ProviderPage, { GlobalContext, Provider, Consumer } from '@Client/components/globalContext';
import Login from './index';
export default class Class extends React.Component {

    static contextType = GlobalContext;
    render() {
        const { children } = this.props;

        return <div>{children}{
            this.context.students.map(student => {
                return (<div key={student.age}>学生姓名:{student.name}<br />
                    学生年龄:{student.age}<br />
                    学生性别:{student.sex}<br /></div>)
            })
        } <Button type='danger' onClick={this.context.addNewStudent}>新增学生</Button></div>

    }
}