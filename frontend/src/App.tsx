import * as React from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import Footer from './components/footer/Footer';
import {Header} from './components/header/Header';


class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Header/>

                <div className={"body"}>
                    <p className="App-intro">
                        To get started, edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <Button variant={"contained"} color={"primary"}>
                        Hello material
                    </Button>
                </div>


                <Footer/>
            </div>
        );
    }
}

export default App;
