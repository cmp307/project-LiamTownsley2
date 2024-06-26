import { Link } from 'react-router-dom';
import '../styles/TopBar.scss'
import { Component } from 'react';

class TopBar extends Component<{ linkToHomepage?: boolean }> {
    render() {
        const component = (
            <>
                <img src="https://i.imgur.com/ZIL6Yos.png" />
                <h1>Scottish Glen</h1>
                <h3 className="header-2" data-testid="page-title">Asset & Employee Management Panel</h3>
            </>
        )
        
        if(this.props.linkToHomepage == false) return <div id="header">{component}</div>;
        return <div id="header"><Link role='link' to={'/'} data-test-id="return-home">{component}</Link></div>
    }
}

export default TopBar;