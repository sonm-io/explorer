```js
class Container extends React.Component {
    constructor() {
        this.state = { value: new Date() };
    }
    
    handleChangeDate (value) {
        this.setState({ value });
    }

    render() {
        return (
            <div>
                <DatetimePicker
                    label="Date"
                    value={this.state.value}
                    onChange={(v) => this.handleChangeDate(v)}
                />
                Selected date: {this.state.value.toLocaleString()}
            </div>
        );
    }
}

<Container />
```


    