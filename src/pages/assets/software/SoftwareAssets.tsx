import Breadcrumbs from "../../../components/Breadcrumbs.tsx";
import TopBar from "../../../components/TopBar.tsx";
import '../../../styles/Assets.scss';
import "react-placeholder/lib/reactPlaceholder.css";
import { Link } from "react-router-dom";
import { Component } from 'react';
import { IEmployee } from "../../../interfaces/Employee.ts";
import { SoftwareAsset } from "../../../components/assets/software/SoftwareAsset.ts";
import SoftwareAssetTable from "../../../components/assets/software/SoftwareAssetTable.tsx";

class SoftwareAssets extends Component<{ setUser: Function, user: IEmployee }, { data: SoftwareAsset[], user: IEmployee, setUser: Function }> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
            user: props.user,
            setUser: props.setUser
        }
        this.updateAssets = this.updateAssets.bind(this);
    }

    componentDidMount() { this.updateAssets() }

    updateAssets() {
        fetch('http://127.0.0.1:3001/api/assets/software/view-all')
            .then((res) => res.json())
            .then((res) => {
                const _state: any = this.state;
                _state.data = [...res.map((x: any) => new SoftwareAsset(x))];
                this.setState(_state)
            })
            .catch((err) => console.error(err))
    }

    deleteAllAssets() {
        fetch('http://127.0.0.1:3001/api/assets/software/', { method: 'DELETE' }).then(() => {
            this.refreshPage();
        })
    }

    refreshPage() {
        window.location.reload();
    }

    render() {
        return (
            <>
                <TopBar />
                <Breadcrumbs history={[
                    { name: 'Home', path: '/' },
                    { name: 'Software Assets', path: '/software' },
                ]} setUser={this.props.setUser} user={this.props.user} />

                <div className="hero">
                    <div id="spacer"></div>
                    <h2 className="text-centre"><i className="fa fa-terminal" /> Action Buttons</h2>
                    <hr />
                </div>

                <div id="action-buttons">
                    <Link to={'/software/create'} className="btn btn-outline-success"><i className="fa fa-plus" /> Create a Software Asset</Link>
                    <button onClick={this.refreshPage} className="btn btn-outline-primary"><i className="fa fa-refresh" /> Refresh List</button>
                    <button onClick={this.deleteAllAssets} className="btn btn-outline-danger"><i className="fa fa-trash" /> Delete <strong>All</strong> Software Assets</button>
                </div>

                <div className="hero">
                    <hr />
                    <h2 className="text-centre"><i className="fa fa-cloud-download" /> Software Asset List</h2>
                    <hr />
                </div>
                <p className="text-centre">There is currently <strong>{this.state.data.length}</strong> software {(this.state.data.length > 1 || this.state.data.length == 0) ? 'assets' : 'asset'} stored within the Database.</p>
                <SoftwareAssetTable assets={this.state.data} />
            </>
        )
    }
}

export default SoftwareAssets;