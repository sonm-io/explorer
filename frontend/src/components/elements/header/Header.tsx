import * as React from "react";

import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import NavButton from "./parts/NavButton";
import SearchCmp, { TSearchCss } from "../search/Search";
import { withStyles } from "@material-ui/core";

export interface IHeaderProps {
    onNavigate: (path: string) => void;
    onSearch: (value: string) => void;
}

const Search = withStyles<TSearchCss>((theme) => ({
    root: {},
    input: {
        color: '#ffffff',
        opacity: 0.5,
        backgroundColor: '#102834',
    },
    magnifier: {
        color: '#ffffff',
        opacity: 0.5,
    },
}))(SearchCmp);

export class Header extends React.Component<IHeaderProps> {

    private handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onNavigate(e.currentTarget.value);
    }

    public render() {
        return (
            <header>
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
                        <Search onSubmit={this.props.onSearch}/>
                    </Toolbar>
                </AppBar>
            </header>
        );
    }
}
