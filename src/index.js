import React from 'react';              // import nessesary libraries
import ReactDOM from 'react-dom';
import App from './components/App';     // import main component (wrapper for another components) 
import './index.scss';                  // import css 
import 'semantic-ui-css/semantic.min.css';

import { Provider } from 'react-redux'; // Компонент `Provider` дает знать приложению, как использовать react-redux
import { createStore } from 'redux';    // `createStore` - хранилище данных 
import reducers from './reducers';

ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <App />
    </Provider>, 
    document.querySelector("#root")
);