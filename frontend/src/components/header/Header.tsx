import * as React from "react";

import AppBar from "../../../node_modules/@material-ui/core/AppBar/AppBar";
import Button from "../../../node_modules/@material-ui/core/Button/Button";
import Toolbar from "../../../node_modules/@material-ui/core/Toolbar/Toolbar";
import Typography from "../../../node_modules/@material-ui/core/Typography/Typography";
import {NavLink} from "react-router-dom";

export class Header extends React.Component {
    public render() {
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <NavLink to="/">
                            <Typography variant="title" color="inherit">
                                SONM SE
                            </Typography>
                        </NavLink>
                        <NavLink to="/transactions">
                            <Button>
                                Transactions
                            </Button>
                        </NavLink>
                        <NavLink to="/blocks">
                            <Button>
                                Blocks
                            </Button>
                        </NavLink>
                    </Toolbar>
                </AppBar>
            </header>
        )
    }
}
