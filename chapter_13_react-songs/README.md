# react
project: REACT-songs 

## ## ## ## lesson from www.udemy.com (chapter 13: Integrating React with Redux)

## ## ## Instruction

# STEP 1:
##  preparation of project (Подготовка проекта)
	
1. console:
	npm create-react-app <name of project>
	cd <name of project>
	
## Подключаем библиотеки, используемые в проекте 
## зависимости можно увидеть в файле `package.json`
	npm i --save redux react-redux	
	npm i --save sass node-sass 			## css library, Node-sass is a library that provides binding for Node.js to LibSass
	npm i --save semantic-ui-css			## css library
	npm i --save axios@0.18.1				## Promise based HTTP client for the browser and node.js

    npm start

# STEP 2 (create react side):

2. Delete all from `src`  					## обязательно в каждом проекте!!!
3. Create `src/index.js`: 					## обязательно в каждом проекте!!!
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './components/App';
    import './index.scss';
	import 'semantic-ui-css/semantic.min.css';

    ReactDOM.render(<App />, document.querySelector("#root"));

4. Create `src/index.scss`, `src/components/scss/App.scss`, `src/components/App.js`:     
	## обязательно в каждом проекте!!!!!
    import React from 'react';
    import './scss/App.scss';
    const App = () =>{
        return( <div>App</div> )
    };
    export default App;

# STEP 3 (create redux side):
5. Create `src/actions/index.js` (Action creator): 
    ## Значения для ключей `type`,`payload`  - различные для разных приложений
    ## формат одинаковый для всех
    ## `export` - создаем возможность использовать функцию в любом компоненте, в котором будет соответсвующий `import`
	
	## экшен (`action`) — объект, описывающий, какие изменения необходимо сделать для изменения состояния.
	## `actions` передаются в `reducers`, которые и меняют состояние в хранилище
	export const selectItem = (item) =>{
		return{ 					//Return an action
			type: 'ITEM_SELECTED',
			payload: item
		};
	};

6. Create `src/reducers/index.js`:     
	## код разный для разных приложений
    ## `itemsReducer` - исходные данные, список песен
    const itemsReducer = () =>{
        return [
            { title: 'No Scrubs', duration: '4:05'},
            { title: 'Macarena', duration: '2:30'},
            { title: 'All Star', duration: '3:15'}
        ]
    };

    ## `selectedItemReducer` - возвращает полезную нагрузку (информорцию про выбранный объект из списка)
    ## возможные варианты `action.type` берутся из `src/actions/index.js`
	
	## Редьюсеры (reducers) — это функции, которые обрабатывают экшены (`actions`) и могут вносить изменения в состояние. 
    const selectedItemReducer = (selectedItem=null, action) => {
        if( action.type ==='ITEM_SELECTED'){
            return action.payload;
        }
        return selectedItem;
    };

7. Add to `src/reducers/index.js`: 
    ## обязательно в каждом проекте !!!!!!!!
    ## импортируем Redux-библиотеку в файл
    ## `combineReducers` Это метод, который позволяет вместо создания одного огромного `reducer` для всего состояния приложения сразу,
	## разбивать его на отдельные модули.
	
    import { combineReducers } from 'redux';
    ...
    export default combineReducers({ 
        ## содержимое - в зависимости от созданных const's
		items: itemsReducer,
		selectedItem: selectedItemReducer
    });

8. Add to `src/index.js`: 
	## обязательно в каждом проекте!!!
	## Компонент `Provider` дает знать приложению, как использовать react-redux 
    import { Provider } from 'react-redux';
	## `createStore` - хранилище данных 
    import { createStore } from 'redux';
    import reducers from './reducers';

9. Edit `src/index.js`: 
	## обязательно в каждом проекте!!!
    ## Новый код. `store` - состояния объектов, созданных в разных reducers (методах)
    ReactDOM.render(
        <Provider store={createStore(reducers)}>
            <App />
        </Provider>, 
        document.querySelector("#root")
    );

# STEP 4 (work with react side components): 


## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## 
## STEP 4.1. Создаем список элементов. Исходные данные, список песен 
10. Create `src/scss/ItemsList.scss`, `src/components/ItemsList.js`
	## создаем компонент `ItemList` - список песен, которые в данном проекте хранятся в `itemsReducer` (`src/reducers/index.js`)
    ## синтаксис одинаковый для различных приложений
    ## обязательно в каждом проекте!!! 
    import React, { Component } from 'react';
    import './scss/ItemsList.scss';

    class ItemsList extends Component{
        render(){
            return( //название разное для разных приложений
                <div>
                    Items List
                </div>
            );
        }
    }
    export default ItemsList;

	11. Edit `src/App.js`
		## импортируем компонент `ItemsList`
		## Импортироваться должны все компоненты
		import ItemsList from './ItemsList';
		...
		// вставляем компонент в App-return
			<div>
				<ItemsList />
			</div>

12. Edit created component (e.g. ItemsList) (`src/components/ItemsList.js`)
    ## импортируем компонент `connect`
    ## обязательно в каждом проекте!!!
	## функция connect() создает для нас компонент.
    import { connect } from 'react-redux';

    ## меняем текст. Вместо
    export default ItemsList;
    ## записываем 
    const mapStateToProps = (state) => {
        console.log("ItemsList->mapStateToProps: ",state);
        return {items: state.items};
    }
    export default connect(mapStateToProps)(ItemsList);
	
	## `mapStateToProps` - это функция, которая должна возвращать объект. Поля этого объекта станут свойствами компонента. Их значения берутся из состояния.
	
    ## в `src/reducers/index.js` описаны состояния объектов, которые записываются в `combineReducers` в виде `ключ:значение`.
    ## `state` - полный список состояний
    ## возвращаемое значение `return {items: state.items};`:
                                        ## `state.items` - значение состояния по ключу из `combineReducers`
                                        ## `items:`      - новый ключ, передаваемый в `export default connect(mapStateToProps,...`
                                        ## и из него в компонент `class ItemsList extends Component{...` как
                                        ## `this.props.items`


13.  Edit created component (e.g. ItemsList)
	## можно или создавать новй компонент или
    ## добавляем вспомогательную функцию `renderList` в `class ItemsList extends Component{...`:
    renderList(){
        return this.props.items.map((item, index)=>{
            return(
                <div className="item" key={index}>
                    <div className="right floated content">
                        <button>
                            Select
                        </button>
                    </div>
                    <div className="content">{item.title}</div>
                </div>
            );
        });
    }
    # и меняем 
	`<div>Items List</div>` на `<div>{this.renderList()}</div>`

14. Change `src/App.js`
    ## add css

15. Add to `src/component/ItemsList.js`:
    ## меняем состояние `state` объекта (`selectedSong`) в `redux store`
    ## каждый раз, когда мы хотим изменить данные с помощью `redux`, 
    ## мы должны вызывать `action creator` !!!
    ## т.е. функция `selectedItemReducer` `src/reducers/index.js` выбирает из `src/actions/index.js` (`selectItem` )
    ## `type` и возвращает `payload`

    import { selectItem } from '../actions'; 
	##	`selectItem` - функция из `src/actions/index.js`
    
16. Add to `src/component/ItemsList.js`:
    ##	второй аргумент в `connect`- функцию добавляется объект
    ##  ключ -  как и название `action creator`
    ##  значение - название `action creator`, который мы импортировали:

    export default connect(mapStateToProps, {selectItem : selectItem})(ItemsList);

17. Edit `src/component/ItemsList.js`:
    ##	навешиваем действие на кнопку
    ##  selectItem - `action creator`
    ##  после нажатия на кнопку - меняем `state` внутри нашего `store`
        <button 
            className="ui primary button"
            onClick={() => this.props.selectItem(item)}    
        >
            Select
        </button>

## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## 
## STEP 4.2. Создаем детальное описание элемента 

18. Create `ItemDetail Component` (`src/component/ItemDetail.js`):
	## создаем компонент `ItemDetail` - детальное описание элемента
    ## синтаксис одинаковый для различных приложений 
    ## обязательно в каждом проекте!!! 
		import React, { Component } from 'react';
		import { connect } from 'react-redux';
		import './scss/ItemDetail.scss';
		const ItemDetail=({item}) =>{
			return(
				<div>Item Detail</div>
			);
		}

		const mapStateToProps = (state) => {
			console.log("ItemDetail->mapStateToProps: ",state);
			return {item: state.selectedItem};
		}
		export default connect(mapStateToProps)(ItemDetail);
		
	## `mapStateToProps` - это функция, которая должна возвращать объект. Поля этого объекта станут свойствами компонента. Их значения берутся из состояния.
	
    ## в `src/reducers/index.js` описаны состояния объектов, которые записываются в `combineReducers` в виде `ключ:значение`.
    ## `state` - полный список состояний   
    ## возвращаемое значение `return {items: state.items};`:  
                                        ## `state.items` - значение состояния по ключу из `combineReducers` 
                                        ## `items:`      - новый ключ, передаваемый в `export default connect(mapStateToProps,...`  
                                        ## и из него в компонент `class ItemsList extends Component{...` как  
                                        ## `this.props.items`  


19. Change `src/App.js`
    ## добавляем компонент `ItemDetail`
    import ItemDetail from './ItemDetail';
    ...
    <div><ItemDetail /></div>

20. Edit `ItemDetail Component` (`src/component/ItemDetail.js`):
    ## если Item не выбран, то `ItemDetail()` - не имеет аргумента,и, как следствие, не может
    ## вернуть `{item.title}`,`{item.duration}`   
     
	## делаем заглушку в `const ItemDetail=(item) =>{...`
    if (!item){ return  <div>Select an Item...</div>}
	
	## выводи данные об выбранном объекте
	## вместо `<div>Item Detail</div>` записываем необходимые свойства объекта  
		<div>
            <h3>Details for:</h3>
            <p>Title: {item.title}</p>
            <p>Duration: {item.duration}</p>
        </div>

23. Change `ItemDetail Component` (`src/component/ItemDetail.js`):
    ## add css