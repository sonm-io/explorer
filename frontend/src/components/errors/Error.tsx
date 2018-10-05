import * as React from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import {Theme, WithStyles} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";

interface ErrorProps extends WithStyles {
    error: string,
}

class ErrorForm extends React.Component<ErrorProps, any> {
    render() {
        const error = this.props.error;
        const {classes} = this.props;
        return (
            <Paper className={classes.root} elevation={1}>
                <Typography variant="headline" component="h3">
                    Sorry about that, same error occurred :(
                </Typography>
                <Typography className={classes.text} variant="headline" component="p">
                    {error}
                </Typography>
            </Paper>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: theme.spacing.unit * 6,
        textAlign: "center"
    },
    text: {
        fontSize: "2.5rem"
    },
});

export default withStyles(styles)(ErrorForm);
