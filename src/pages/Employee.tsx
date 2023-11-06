import Breadcrumbs from "../components/Breadcrumbs";
import TopBar from "../components/TopBar";
import '../styles/Assets.scss';
import "react-placeholder/lib/reactPlaceholder.css";
import Table from '../components/AssetTable.tsx';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

/*
import { useParams } from "react-router-dom";

function Asset() {
    const { id } = useParams();
    
    return (
        <div>
            <p>{id}</p>
        </div>
    )
}

export default Asset;
*/

function Employee() {
    // const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState([] as any);

    useEffect(() => {
        fetch(`http://127.0.0.1:3001/api/employee/${id}`)
            .then((res) => res.json())
            .then((_) => setData({
                forename: 'Jo',
                surname: 'Davis',
                email: 'jo.davis@scottishglenshire.co.uk',
                department: 1
            } as any))
            .catch((err) => {
                console.error(err)
            })
    }, []);

    return (
        <>
            <TopBar subtext="Employee Management Panel" />
            <Breadcrumbs history={[
                { name: 'Home', path: '/' },
                { name: 'Employees', path: '/employees' },
                { name: id ?? '-', path: `/employees/${id}` },
            ]} />
            <h2 className="text-centre">Action Buttons</h2>
            <div id="action-buttons">
                <Link to={'/assets/create'} className="btn btn-outline-primary"><i className="fa fa-edit" /> Edit Employee</Link>
                <button onClick={refreshPage} className="btn btn-outline-primary"><i className="fa fa-refresh" /> Refresh Employee</button>
                <button onClick={deleteAllAssets} className="btn btn-outline-danger"><i className="fa fa-trash" /> Delete <strong>All</strong> Employee Assets</button>
            </div>
            <hr />
            <div className="text-centre">
                <h2 className="text-centre">${data.forename}'s Personal Data</h2>
                <p>First Name: <code>Jo</code></p>
                <p>Last Name: <code>Davis</code></p>
                <p>E-Mail: <code>jo.davis@scottishglen.co.uk</code></p>
                <p>Department: <code>Finance</code></p>
            </div>
            <hr />
            <h2 className="text-centre">Asset List</h2>
            {/* <p className="text-centre">This employee currently has <strong>{data.length} {(data.length > 1 || data.length == 0) ? 'assets' : 'asset'}</strong> assigned to them.</p> */}
            <Table assets={data} />
        </>
    )
}

function deleteAllAssets() {
    fetch('http://127.0.0.1:3001/api/delete-all-assets', { method: 'DELETE' }).then(() => {
        refreshPage();
    })
}

function refreshPage() {
    window.location.reload();
}

export default Employee;