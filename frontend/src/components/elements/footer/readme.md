Sample:

```js
const Footer = require('./Footer').Footer; // this is workaround for sg problem with name 'Footer'.
const navigation = require('./test/navigation.txt');
const socials = require('./test/socials.txt');

class Container extends React.Component {
    constructor () {
        this.state = {};
        const self = this;
        const p1 = fetch(navigation).then(res => res.text()).then(text => {
            self.setState({ navigation: text })
        });
        const p2 = fetch(socials).then(res => res.text()).then(text => {
            self.setState({ socials: text })
        });
        Promise.all([p1, p2]).then(values => {
            self.setState({ isReady: true });
        });
    }

    render() {
        const s = this.state;
        return (
            <Footer
                isReady={s.isReady}
                navigation={s.navigation}
                socials={s.socials}
            />
        );
    }
}

<Container/>

```
