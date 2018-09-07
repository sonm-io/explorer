import * as React from "react";

import AppBar from "../../../node_modules/@material-ui/core/AppBar/AppBar";
import Button from "../../../node_modules/@material-ui/core/Button/Button";
import Toolbar from "../../../node_modules/@material-ui/core/Toolbar/Toolbar";
import Typography from "../../../node_modules/@material-ui/core/Typography/Typography";

export class Header extends React.Component {
    public render() {
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            SONM SE
                        </Typography>

                        <Button>
                            Home
                        </Button>

                        <Button>
                            Transactions
                        </Button>

                        <Button>
                            Blocks
                        </Button>
                    </Toolbar>
                </AppBar>
            </header>
        )
    }
}
