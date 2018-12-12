import * as React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Tbg, { ToggleButtonGroupProps } from '@material-ui/lab/ToggleButtonGroup';
import './toggle-button-group.less';

interface IToggleButtonGroupProps extends ToggleButtonGroupProps {
    valueRequired: boolean;
    items: Array<[string, string]>;
}

class ToggleButtonGroup extends React.Component<IToggleButtonGroupProps, never> {

    public static defaultProps: Partial<IToggleButtonGroupProps> = {
        exclusive: true,
        valueRequired: true,
        selected: false,
    };

    private static rootClasses = {
        root: 'toggle-button-group',
    };

    private static itemClasses = {
        root: 'toggle-button-group__item',
        selected: 'toggle-button-group__item--selected',
        label: ''
    };

    private renderItem = (key: number, value: string, caption: string) => {
        return (
            <ToggleButton
                key={key}
                classes={ToggleButtonGroup.itemClasses}
                value={value}
                disableFocusRipple
                disableRipple
            >
                {caption}
            </ToggleButton>
        );
    }

    private handleChange = (e: React.MouseEvent<HTMLElement>, value: string) => {
        const p = this.props;
        if (p.onChange && (!p.valueRequired || value !== null)) {
            p.onChange(e, value);
        }
    }

    public render() {
        const { items, onChange, valueRequired, ...p } = this.props;
        return (
            <Tbg
                classes={ToggleButtonGroup.rootClasses}
                {...p}
                onChange={this.handleChange}
            >
                {items.map(([value, caption], i) => this.renderItem(i, value, caption))}
            </Tbg>
        );
    }
}

export default ToggleButtonGroup;
