import * as React from "react";

import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import NavButton from "./parts/nav-button";
import SearchCmp, { TSearchCss } from "../search/Search";
import { withStyles } from "@material-ui/core";
import { INavigationState, INavigationCmpActions } from "src/stores/navigation-store";

export interface IPageHeaderProps extends INavigationState, INavigationCmpActions {}

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

export class PageHeader extends React.Component<IPageHeaderProps> {

    public render() {
        const p = this.props;
        return (
            <header>
                <AppBar position="static">
                    <Toolbar>
                        <NavButton onClick={this.props.onNavigate} value="/" active={p.activeMenu==='home'}>
                            Home
                        </NavButton>
                        <NavButton onClick={this.props.onNavigate} value="/transactions" active={p.activeMenu==='transactions'}>
                            Transactions
                        </NavButton>
                        <NavButton onClick={this.props.onNavigate} value="/blocks" active={p.activeMenu==='blocks'}>
                            Blocks
                        </NavButton>
                        <NavButton onClick={this.props.onNavigate} value="/contracts" active={p.activeMenu==='contracts'}>
                            Contracts
                        </NavButton>
                        <Search onSubmit={this.props.onSearch}/>
                    </Toolbar>
                </AppBar>
            </header>
        );
    }
}
