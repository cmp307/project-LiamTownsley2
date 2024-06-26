import { TextBlock } from "react-placeholder/lib/placeholders";
import PillButton from "../PillButton";
import { Link } from "react-router-dom";
import { Component } from 'react';
import { IEmployee } from "../../interfaces/Employee";

class EmployeeTable extends Component<{ assets: IEmployee[], logged_in_email: string }> {
    constructor(props: any) {
        super(props);
    }

    render() {
        if (!this.props.assets || this.props.assets.length == 0) {
            return <TextBlock rows={3} color='#CDCDCD' />
        }

        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Employee ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Department</th>
                            <th scope="col">E-Mail</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.assets.map((item: any) => (
                            <tr key={item._id}>
                                <td><code>{item._id}</code></td>
                                <td>{item.forename.split('')[0] + '. ' + item.surname}</td>
                                <td><PillButton label={item.department} /></td>
                                <td>{item.email}</td>
                                <td>
                                    <Link to={`/employees/${item._id}`} role="button" id="blue-button" className="btn btn-outline-primary"><i className="fa fa-eye" /> View Employee</Link>
                                    <Link to={`/employees/${item._id}/edit`} role="button" id="blue-button" className={"btn btn-outline-primary " + ((item._id == '655bf70f3ee93eb2c723dc9d' || item.email == this.props.logged_in_email) ? 'disabled' : '')}><i className="fa fa-edit" /> Edit Employee</Link>
                                    <button onClick={() => {
                                        fetch(`http://127.0.0.1:3001/api/employees/${item._id}`, { method: 'DELETE' }).then(() => {
                                            refreshPage();
                                        })
                                    }} className={"btn btn-outline-danger " + ((item._id == '655bf70f3ee93eb2c723dc9d' || item.email == this.props.logged_in_email) ? 'disabled' : '')} data-test-id={`delete-${item._id}`}><i className="fa fa-trash" /> Delete Employee</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        );

    }
}

function refreshPage() {
    window.location.reload();
}

export default EmployeeTable;