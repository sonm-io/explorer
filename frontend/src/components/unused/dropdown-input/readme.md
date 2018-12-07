Dropdown input:


```js
class Container extends React.Component {
    constructor () {
        super();
        this.state = {
            isExpanded: false,
            hasBalloon: false,
        };
    }
    
    handleToggle () {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    handleRequireClose () {
        this.setState({ isExpanded: false });
    }

    handleSwitchBalloon () {
        this.setState({ hasBalloon: !this.state.hasBalloon });
    }

    render () {
        return (
            <div>
                <label>
                    hasBaloon
                    <input type="checkbox" onChange={() => this.handleSwitchBalloon()} />
                </label>
                
                <DropdownInput
                    hasBalloon={this.state.hasBalloon}
                    valueString='Dropdown input'
                    isExpanded={this.state.isExpanded}
                    onButtonClick={() => this.handleToggle()}
                    onRequireClose={() => this.handleRequireClose()}
                >
                    <div>DROPDOWN CONTENT</div>
                </DropdownInput>
            </div>
        );
    }
}

<Container />
```

Disabled

        <DropdownInput
            valueString='Dropdown input'
            disabled
        >
            <div>DROPDOWN CONTENT</div>
        </DropdownInput>
