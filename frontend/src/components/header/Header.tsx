import * as React from "react";

import {NavLink} from "react-router-dom";
import AppBar from "../../../node_modules/@material-ui/core/AppBar/AppBar";
import Toolbar from "../../../node_modules/@material-ui/core/Toolbar/Toolbar";
import navButton from "./parts/NavButton";
import SearchBar from "./parts/SearchBar";

class Header extends React.Component {
    public render() {
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <NavLink to="/" style={{textDecoration: 'none'}}>
                            <navButton>
                                Home
                            </navButton>
                        </NavLink>
                        <NavLink to="/transactions" style={{textDecoration: 'none'}}>
                            <navButton>
                                Transactions
                            </navButton>
                        </NavLink>
                        <NavLink to="/blocks" style={{textDecoration: 'none'}}>
                            <navButton>
                                Blocks
                            </navButton>
                        </NavLink>
                        <SearchBar classes={{
                            search: "search",
                            searchIcon: "searchIcon",
                            inputRoot: "inputRoot",
                            inputInput: "inputInput",
                        }}/>
                    </Toolbar>
                </AppBar>
            </header>
        );
    }
}

export default Header;
