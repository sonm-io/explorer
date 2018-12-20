## In header

```js
const AppBar = require('@material-ui/core/AppBar/AppBar').default;
const Toolbar = require('@material-ui/core/Toolbar/Toolbar').default;
const NavButton = require('../page-header/parts/nav-button').default;
<AppBar position="static">
    <Toolbar>
        <NavButton>Button</NavButton>
        <Search onSubmit={(v) => console.log(v)} />
    </Toolbar>
</AppBar>
```

## In body

```js
<Search
    onSubmit={(v) => console.log(v)}
    classes={{
        inputRoot: {
            backgroundColor: '#ffffff',
        }
    }}
/>
```
