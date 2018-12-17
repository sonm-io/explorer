import * as React from 'react';
import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import * as cn from 'classnames';
import './nav-button.less';

const StyledButton = withStyles({
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
    }
})(Button);

interface INavButtonProps {
    onClick?: (value?: string) => void;
    value?: string;
    active?: boolean;
}

class NavButton extends React.Component<INavButtonProps, never> {

    private handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onClick && this.props.onClick(e.currentTarget.value);
    }

    public render() {
        const { children, value, ...p } = this.props;
        return (
            <StyledButton
                className={cn(p.active === true ? 'nav-button--active' : null)}
                value={value}
                onClick={this.handleClick}
            >
                {children}
            </StyledButton>
        );
    }
}

export default NavButton;
