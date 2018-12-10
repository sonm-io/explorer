```js
const items = [
    ['transactions', 'Transactions'],
    ['token-trns', 'SONM token txns'],
];

class Component extends React.Component {
    
    constructor () {
        super();
        this.state = {
            value: 'transactions'
        };
    }
    
    handleChange(value) {
        console.log(value);
        this.setState({ value });
    }

    render() {
        return (
            <ToggleButtonGroup
                exclusive={true}
                items={items}
                value={this.state.value}
                onChange={(e, value) => this.handleChange(value)}
            />
        );
    }
}

<Component />
```

