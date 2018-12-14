import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";

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

// TODO: fix naming
export default NavButton;
