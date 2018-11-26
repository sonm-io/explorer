import * as React from "react";

import {NavLink} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import NavButton from "./parts/NavButton";
import SearchBar from "./parts/SearchBar";

class Header extends React.Component {
    public render() {
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <NavLink to="/" style={{textDecoration: 'none'}}>
                            <NavButton>
                                Home
                            </NavButton>
                        </NavLink>
                        <NavLink to="/transactions" style={{textDecoration: 'none'}}>
                            <NavButton>
                                Transactions
                            </NavButton>
                        </NavLink>
                        <NavLink to="/blocks" style={{textDecoration: 'none'}}>
                            <NavButton>
                                Blocks
                            </NavButton>
                        </NavLink>
                        <NavLink to="/contracts" style={{textDecoration: 'none'}}>
                            <NavButton>
                                Contracts
                            </NavButton>
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
