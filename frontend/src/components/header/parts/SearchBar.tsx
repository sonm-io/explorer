import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Input from "@material-ui/core/Input/Input";
import * as React from "react";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import {fade} from "@material-ui/core/styles/colorManipulator";
import withStyles from "@material-ui/core/styles/withStyles";

class SearchBar extends React.Component<WithStyles, any> {
    search() {
        console.log("search bar action");
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.search}>
                <div className={classes.searchIcon} onClick={this.search}>
                    <SearchIcon/>
                </div>
                <Input
                    placeholder="Search by address/TxHash"
                    disableUnderline
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                />
            </div>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    search: {
        position: 'relative',
        cursor: 'pointer',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#fff", 0.15),
        '&:hover': {
            backgroundColor: fade("#fff", 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            backgroundColor: fade("#b3b3b3", 0.15),
        },
    },
    inputRoot: {
        color: 'inherit',
        width: '80%',
        marginLeft: theme.spacing.unit * 9
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
});

export default withStyles(styles)(SearchBar);
