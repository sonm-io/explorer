import * as React from "react";

import {Theme} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import {default as ErrorForm} from "./Error";

class NotFound extends React.Component {
    public render() {
        return (
            <ErrorForm error={"Page not found"}/>
        );
    }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(NotFound);
