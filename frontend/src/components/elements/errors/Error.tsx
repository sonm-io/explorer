import * as React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";

interface ErrorProps extends WithStyles {
    error: string;
}

class ErrorForm extends React.Component<ErrorProps, any> {
    public render() {
        const error = this.props.error;
        const {classes} = this.props;
        return (
            <Typography className={classes.root} variant="headline" component="p">
                {error}
            </Typography>
        );
    }
}

const styles = (theme: Theme) => createStyles({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: theme.spacing.unit * 6,
        textAlign: "center",
        fontSize: "2.5rem",
    }
});

export default withStyles(styles)(ErrorForm);
