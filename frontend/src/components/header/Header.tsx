import * as React from "react";

import AppBar from "../../../node_modules/@material-ui/core/AppBar/AppBar";
import Button from "../../../node_modules/@material-ui/core/Button/Button";
import Toolbar from "../../../node_modules/@material-ui/core/Toolbar/Toolbar";
import {NavLink} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Input from "@material-ui/core/Input/Input";
import {Theme} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import {fade} from "@material-ui/core/styles/colorManipulator";
import {WithStyles} from "@material-ui/core/es";
import SearchIcon from '@material-ui/icons/Search';

const NavButton = withStyles({
    root: {
        border: 0,
        color: '#848e92',
        padding: '0 30px',
        fontSize: "15px",
        fontWeight: 500,
    },
    label: {
        textTransform: 'capitalize',
        textDecoration: "none",
    },
})(Button);

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

class Header extends React.Component<WithStyles, any> {
    search() {
        console.log('sera');
    }


    render() {
        const {classes} = this.props;
        return (
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <NavLink to="/">
                            <NavButton>
                                Home
                            </NavButton>
                        </NavLink>
                        <NavLink to="/transactions">
                            <NavButton>
                                Transactions
                            </NavButton>
                        </NavLink>
                        <NavLink to="/blocks">
                            <NavButton>
                                Blocks
                            </NavButton>
                        </NavLink>
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
                    </Toolbar>
                </AppBar>
            </header>
        )
    }
}


export default withStyles(styles)(Header)
