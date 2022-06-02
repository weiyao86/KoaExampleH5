import React from 'react';

export const GlobalData = {
    theme: 'dark',
    onChangeGlobal: () => { }
}

export const GlobalContext = React.createContext(GlobalData);
export const { Provider, Consumer } = GlobalContext;

let count = 1;
export default class Class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [{
                name: '张三',
                age: 26,
                sex: '男'
            }],
            addNewStudent: () => this.addNewStudent()
        }
    }

    addNewStudent = () => {
        const { students } = this.state;
        students.push({
            name: '张三' + count,
            age: 26 + count,
            sex: count % 2 == 0 ? '男' : '女'
        });
        this.setState({
            students
        })
        count++;
    }

    render() {
        const { children } = this.props;
        const { students, addNewStudent } = this.state;
        return (<Provider value={{ students, addNewStudent }}>
            {children}
        </Provider>)
    }
}