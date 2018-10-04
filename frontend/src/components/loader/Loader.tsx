import * as React from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import {Theme, WithStyles} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import {purple} from "@material-ui/core/colors";


class Loader extends React.Component<WithStyles, any> {
    render() {
        const {classes} = this.props;
        return (
            <div style={{textAlign: "center"}}>
                <CircularProgress className={classes.progress}
                                  style={{color: purple[500], margin: "56px"}}
                                  thickness={7}/>
            </div>
        )
    }
}

const styles = (theme: Theme) => createStyles({});

export default withStyles(styles)(Loader);
