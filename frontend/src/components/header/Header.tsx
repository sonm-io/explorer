import * as React from "react";

import AppBar from "../../../node_modules/@material-ui/core/AppBar/AppBar";
import Button from "../../../node_modules/@material-ui/core/Button/Button";
import Toolbar from "../../../node_modules/@material-ui/core/Toolbar/Toolbar";
import Typography from "../../../node_modules/@material-ui/core/Typography/Typography";
import {Link} from "react-router-dom";

export class Header extends React.Component {
    public render() {
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            <Link to="/">SONM SE</Link>
                        </Typography>

                        <Button>
                            <Link to="/">Home</Link>
                        </Button>

                        <Button>
                            <Link to="/transactions">Transactions</Link>
                        </Button>

                        <Button>
                            <Link to="/blocks">Blocks</Link>
                        </Button>
                    </Toolbar>
                </AppBar>
            </header>
        )
    }
}