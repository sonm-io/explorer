import * as React from 'react';
import { DropdownInput } from '../dropdown-input';
import { IDatePickerProps, DatePicker } from '../date-picker';
import Calendar from '../calendar';

interface IState {
    expanded: boolean;
}

export class DatepickerDropdown extends React.Component<IDatePickerProps, IState> {

    public state: IState = {
        expanded: false
    };

    private handleChangeExpanded = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    private handleRequireClose = () => {
        this.setState({
            expanded: false,
        });
    }

    private valueToString = () => {
        const p = this.props;
        return p.valueToString === undefined
            ? Calendar.shortFormat(p.value)
            : p.valueToString(p.value);
    }

    public render() {
        const p = this.props;
        return (
            <DropdownInput
                valueString={this.valueToString()}
                onRequireClose={this.handleRequireClose}
                onButtonClick={this.handleChangeExpanded}
                isExpanded={this.state.expanded}
                disabled={p.disabled}
            >
                <DatePicker {...this.props} />
            </DropdownInput>
        );
    }
}
