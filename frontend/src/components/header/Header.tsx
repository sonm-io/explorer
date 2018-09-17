import * as React from "react";

import AppBar from "../../../node_modules/@material-ui/core/AppBar/AppBar";
import Toolbar from "../../../node_modules/@material-ui/core/Toolbar/Toolbar";
import {NavLink} from "react-router-dom";
import NavButton from "./parts/NavButton";
import SearchBar from "./parts/SearchBar";


class Header extends React.Component {
    render() {
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <NavLink to="/">
                            <NavButton>
                                Home
                            </NavButton>
                        </NavLink>
                        <NavLink to="/transactions">
                            <NavButton>
                                Transactions
                            </NavButton>
                        </NavLink>
                        <NavLink to="/blocks">
                            <NavButton>
                                Blocks
                            </NavButton>
                        </NavLink>
                        <SearchBar classes={{
                            search: "search",
                            searchIcon: "searchIcon",
                            inputRoot: "inputRoot",
                            inputInput: "inputInput"
                        }}/>
                    </Toolbar>
                </AppBar>
            </header>
        )
    }
}


export default Header;
