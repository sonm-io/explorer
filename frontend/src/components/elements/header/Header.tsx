import * as React from "react";

import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import NavButton from "./parts/NavButton";
import SearchBar from "./parts/SearchBar";
import { IHasNavigate } from "src/types";

class Header extends React.Component<IHasNavigate> {

    private handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onNavigate(e.currentTarget.value);
    }

    public render() {
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <NavButton onClick={this.handleNavigate} value="/">
                            Home
                        </NavButton>
                        <NavButton onClick={this.handleNavigate} value="/transactions">
                            Transactions
                        </NavButton>
                        <NavButton onClick={this.handleNavigate} value="/blocks">
                            Blocks
                        </NavButton>
                        <NavButton onClick={this.handleNavigate} value="/contracts">
                            Contracts
                        </NavButton>
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
