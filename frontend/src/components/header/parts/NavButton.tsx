import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button/Button";

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

export default NavButton;
