# react
project: REACT-blog 

## ## ## ## lesson from www.udemy.com (chapter 14: Async Actions with Redux Thunk)

## добавляем возможность асинхронной обработки данных

## ## ## Instruction

# STEP 1:

	##  preparation of project (Подготовка проекта)
	##  Если проект новый - смотри `README.md` для `chapter 13: Integrating React with Redux` (# STEP 1, 2)

	## `redux-thunk` - это функция, которая, как правило, делает асинхронную операцию (чаще всего, это ajax-запрос) и несколько диспатчей обычных экшенов! 
	## прослойка (`middleware`), помогающая создавать запросы в redux-приложениях. Добавляет новые свойства в redux-приложение  
1. console 
	npm i --save redux-thunk


# STEP 2 (create redux side):
2. Add to `src/index.js`: 
	## обязательно в каждом проекте!!!
	## Компонент `Provider` дает знать приложению, как использовать react-redux 
    import { Provider } from 'react-redux';
	## `createStore` - хранилище данных 
    import { createStore } from 'redux';
    import reducers from './reducers';
	
	ReactDOM.render(
		<Provider store={createStore(reducers)}>
			<App />
		</Provider>, 
		document.querySelector("#root")
	);
	
# STEP 3 (work with react side components): 
3. Edit `src/reducers/index.js`
	## если нет данных для передачи, мы все-равно должны что-то передавать.
	## Поэтому или убираем `import reducers from './reducers';` или добавлем `dummy reducers`:
	export default combineReducers({
		dummyKey: 'replaceMe'
	});
	
4. Create `src/components/14/PostList.scss`, `src/components/14/PostList.js`
	import React from 'react';
	import './PostList.scss';

	class PostList extends React.Component{
		render(){
			return (
				<div>Post List</div>
			)
		}
	}

	export default PostList;
	
5. Edit `src/App.js`
    ## импортируем компонент `PostList`
	## Импортироваться должны все компоненты 
    import PostList from './14/PostList';
    ...
    // вставляем компонент в App-return
        <div>
            <PostList />
        </div>


# STEP 4. Получаем данные в приложении Redux

6. Edit `src/actions/index.js`:
	export const fetchPosts = () => {
		return {
			type: 'FETCH_POSTS'
		}
	};
	
	## можем подключать этот `action` в любой компонент, например в ...

7. Edit `src/components/14/PostList.js`:
	import React, { Component } from 'react';
	import { connect } from 'react-redux';
	import { fetchPosts } from '../../actions';
	
	## подключаем `connect()`:
	## первый аргумент - всегда функция `mapStateToProps` (или `null`)
	## второй аргумент  - `action Creator` 
	export default connect(null,{
		fetchPosts: fetchPosts
	})(PostList);

8. Edit `src/components/14/PostList.js`:
	## componentDidMount
	componentDidMount (){
		this.props.fetchPosts();
	}
	
	## теперь, когда наш компонент `PostList` отображается на экране, мы можем вызывать `action Creator`
	

# STEP 4.1. ASINC ACTION CREATORS

9. Create configuration file with pre-configuration `src/apis/jsonPlaceholder.js`:
	## данные не меняются (константы)
	import axios from 'axios';

	export default axios.create({
		baseURL: 'http://jsonplaceholder.typicode.com'
	});

10. Edit `src/actions/index.js`:
	## добавляем API в наш `action Creator`:
	import jsonPlaceholder from '../apis/jsonPlaceholder';
	
11. Edit `src/actions/index.js`:	
	## используем конструкцию `async-await` для обработки асинхронных запросов:
	export const fetchPosts = () => async () =>{
		## заносим результаты запроса в переменную
		const responce = await jsonPlaceholder.get('/posts'); 
		
		## и возвращаем в виде `payload`:
		return {
			type: 'FETCH_POSTS',
			payload: responce
		};
	};

	## данный код выдает ошибку: Error: Actions must be plain objects. Use custom middleware for async actions.
	##    7 | class PostList extends React.Component{ 
    ##    8 |     componentDidMount (){ 
	## >  9 | 		this.props.fetchPosts(); 
	##    10 |     } 
	
	## поскольку
	## 1. `action Creator` должен возвращать простой JS объект - не возвращаем 
	## 2. мы не получили наши данные  (this.props.fetchPosts() = `undefined`) , посксольку `render` происходит быстрее, чем нам возвращаются внешние данные
	
	## данный код не работает в случае асинхронных запросов !!!!!!!
	
	## Исправляем п.1
	## `this.props.fetchPosts()` вместо простого объекта ( return {type: 'FETCH_POSTS',	payload: responce}) 
	## возвращает request object: return jsonPlaceholder.get('/posts'); 
	
	## мы должны обрабатывать не Redux Action, a случайный объект, который не обрабатывается Redux'ом.
	
	## Т.е. рабочий код будет:
	export const fetchPosts = () => async dispatch =>{
        const responce = await jsonPlaceholder.get('/posts');
        dispatch( {type: 'FETCH_POSTS', payload: responce.data } )
    };
	
	## Исправляем п.2	
	## Для этого используем `redux-thunk`
	
12. Edit `src/actions/index.js`:
	import { createStore, applyMiddleware } from 'redux';
    import thunk from 'redux-thunk';
	
	const store = createStore(reducers, applyMiddleware(thunk));

    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, 
        document.querySelector("#root")
    );
	
# STEP 4.2. Redux Store Design

13. ## Rules of Reducers - start
	
	## `reducers` хранятся в различных файлах. 
	## В `src/reducers/index.js` (`combineReducers`) будет импорт   
	
14. Create `src/reducers/postsReducer.js`
	##  ***** RULES #1 ***** 
	## `reducers` должны возвращать что-либо (число, строка, массив, объект, null. !='undefined')  
	export default () => {
		return 'replaceMe';
	}

15. Edit `src/reducers/index.js`
	## import
	import postsReducer from './postsReducer';
	...
	export default combineReducers({
		...
		posts:          postsReducer
	});

16. ##  ***** RULES #2 *****
	## `reducer` получает на вход два аргумента: данные (`previous state`) и `action` ({type:'MY_TYPE'}). На выходе - какой-то `new state`
	## Т.е. данным (первый аргумент) нужно присваивать дефолтные значения для первого вызова(например, const selectedItemReducer = (selectedItem=null, action) => {... )
	
17. ##  ***** RULES #3 *****
	## `pure reducers` - т.е. reducer получает два аргумента и выдает новое состояние. ВСЕ!
	## Никаких новых реквестов,функций, ссылок на элементы, ... `reducer` НЕ СОЗДАЕТ! 
	
18. ##  ***** RULES #4 *****
	## `reducer` не должен! изменять свой входной аргумент 'state' напрямую
	
	## Допустимые изменения:
	
	## remove el from array:	state.filter(element => element !== 'hi')				// BAD!!!: state.pop()
	## add to array: 			[...state, 'hi']										// BAD!!!: state.push('hi')
	## replace el array:		state.map(el=>el==='hi'?'bye':el)						// BAD!!!: state[0] = 'bye' 
	
	## update props:			{...state, name:'Sam'}									// BAD!!!: state.name = 'Sam'  
	## Adding props:			{...state, age:30}										// BAD!!!: state.age = 30
	## Remove props:			{...state, age: undefined} || _.omit(state, 'age')		// BAD!!!: delete state.age
	
	
	## Rules of Reducers - end
	
	
19. Edit `src/reducers/postsReducer.js`
	## Switch Statements in Reducers:
	export default (state=[], action) => {
		switch (action.type){ // see to `src/actions/index.js`
			case 'FETCH_POSTS':
				return action.payload;
			
			default: 
				return state;
		}
	}
	
20. Edit `src/components/14/PostList.js`:
	## dispatching correct values - получаем значения
	const mapStateToProps = (state) =>{ // see to `src/reducers/index.js`
		return { 
			posts: state.posts
		};
	}

	export default connect(mapStateToProps,{
		fetchPosts: fetchPosts
	})(PostList);
	
	## просмотр переменной:
		...
	    render(){
			console.log ("render()",this.props.posts);
		...
	## список постов мы получили
	
21. Edit `src/components/14/PostList.js`:
	## вывод данных на экран
	## создаем функцию, которая перебирает элементы масасива, который мы получили в `this.props.posts`
	## добавляем css:
	renderList(){
        return this.props.posts.map(post =>{
            return (
                <div className="ui item" key={post.id} >
                    <i className="large middle  aligned icon user" />
                    <div className="content">
                        <div className="desciption">
                            <h4>{post.title}</h4>
                            <p>{post.body}</p>
							<p>{post.userId}</p>
                        </div>
                    </div>
                </div>
            );
        });
    }
	
	## выводим на экран результат выполнения функции:
	return( 
        <div className="ui relaxed divided list">
            {this.renderList()}
        </div>
    );
	
22. Edit `src/components/14/PostList.js`	
	## извлечение данных из второго JSON по ключу в первом 
	## (1: [{title:"Nice blog", userId:1}])
	## (2: [{id:1, name:"Sam"},{id:2, name:"Mike"}]) 
	
	## Для отображения имени автора (данные из второго JSON), создаем компонент `UserHeader`, 
	## в который будем передавать `userId` в виде `props`. 
	<div className="desciption">
        <h4>{post.title}</h4>
        <p>{post.body}</p>
		<UserHeader userId={post.userId} />
	</div>

## **************************************************************************************************** ##
##  ***** НОВЫЙ КОМПОНЕНТ *****   
	## - Create `Action Creator` 
	## - Create `Action` 
	## - Create `Component` 
	## - Create `Reducer` (for Edit `Store`)   
	
23. Create `Action Creator` (`src/actions/index.js`):
	export const fetchUser = id => async dispatch => {
		const responce = await jsonPlaceholder.get(`/users/${id}`);
		## Create `Action`: { type: 'FETCH_USER', payload: responce.data}
		dispatch ( { type: 'FETCH_USER', payload: responce.data} );
	};
	
24. Create `src/components/14/scss/UserHeader.scss`, `src/components/14/UserHeader.js`:
	## - Create `Component`
	import React, { Component } from 'react';
	import './UserHeader.scss';

	class UserHeader extends Component{
		render(){
			return (
				<div className="header">
					UserHeader
				</div>
			)
		}
	}

	export default UserHeader;
	
25. Edit `src/components/14/PostList.js`:
	## import
	import UserHeader from './UserHeader';

26. Edit `src/components/14/UserHeader.js`:
	## функция connect() создает для нас компонент.
	import { connect } from 'react-redux';
	import { fetchUser } from '../../actions';
	...
	## where function `mapStateToProps()` not created, call `null`
	export default connect (null, {fetchUser})(UserHeader);

27. Edit `src/components/14/UserHeader.js`:
	## componentDidMount
    componentDidMount(){
        this.props.fetchUser(this.props.userId);
    }
	## теперь, когда наш компонент `UserHeader` отображается на экране, мы можем вызывать `action Creator`

28. Create `src/reducers/usersReducer.js`:
	## - Create `Reducer`. 
	## ***** DEFAULT SYNTAXIS ***** 
	export default (state=[], action) =>{
		switch (action.type){ // see to `src/actions/index.js`
			case 'FETCH_USER':
				return [...state,action.payload];
			default: 
				return state;
		}
	};

29. Create `src/reducers/index.js`:
	## import
	import usersReducer from './usersReducer';
	...
	export default combineReducers({ 
		posts: postsReducer,
		users: usersReducer		// add this string
	});
	
30. Edit `src/components/14/UserHeader.js`:
	## добавляем функцию `mapStateToProps`
	## функция `mapStateToProps` - функция, которая возвращает либо обычный объект, либо другую функцию 
	## функция `mapStateToProps` будет вызываться каждый раз, когда состояние хранилища изменяется.
	## Функция `mapStateToProps` объявляется с двумя параметрами, второй из которых является необязательным. 
	## Первый параметр представляет собой текущее состояние хранилища Redux. 
	## Второй параметр, если его передают, представляет собой объект свойств, переданных компоненту
	
	const mapStateToProps = (state) =>{
		return {users: state.users}
	};
		
	export default connect (mapStateToProps, {fetchUser})(UserHeader);
	
31. Edit `src/components/14/UserHeader.js` в `render()`:	
	## возвращаем имя (`name`) из объекта, в котором `id`== props.userId
	render(){
	const user = this.props.users.find((user) => user.id === this.props.userId);
        if (!user){
            return null;
        }
		...
## **************************************************************************************************** ##

	## Имя автора (и остальные поля из второго JSON) мы получили. Но есть вопрос к производительности.
	## При отрисовке каждого поста, идет запрос на имя автора.  (вызов `render` в `UserHeader.js`)
	## Т.е. при отображении 100 постов, мы 100 раз отправляем запрос на получение имени  (XHR-request - see to console)
	## если авторов - 100, уменьшить количество запросов не получится, а если авторов - 10, это делать необходимо. 
	
	## Для уменьшения количества запросов - переносим логику в `mapStateToProps` (Extracting Logic to MapStateToProps):
	
32. Edit `src/components/14/UserHeader.js`:
	## переносим функцию фильтра из `render` в `mapSteteToProps`:
        
	// const user = this.props.users.find((user) => user.id === this.props.userId);
	if (!user){ return null;}	
	...
	
	const mapStateToProps = (state, ownProps) =>{				// не окончательный код
		return {users: state.users.find((user) => user.id === this.props.userId)}
	};
	## Но `this.props.userId` не относится к общему `state`. Это перемнная из компонента
	## Поэтому, как второй аргумент, вносим в функцию `mapStateToProps` собственное состояние (доступное в Компоненте `UserHeader` ): 
	const mapStateToProps = (state, ownProps) =>{
		## вместо `users` - `user` , поскольку выдаем одного пользователя по фильтру
		return {user: state.users.find((user) => user.id === ownProps.userId)}
	};	
	
	## изменения в `render`:
	render(){
		const { user } = 	this.props;
	
	## Уменьшение количества запросов - это устранение дублирующих запросов
	## т.е., если данные про автора с userId=5 мы получили, то второй,... раз про этого автора мы данные не запрашиваем
	
	
	## ***************  ДВА ПУТИ РЕШЕНЕНИЯ УСТРАНЕНИЯ ДУБЛИРУЮЩИХ ЗАПРОСОВ ***************************
	
	## ******* SOLUTION #1  start ***************
	## Memoizing Functions
	
	## `memoize` - Возвращает функцию, которая кэширует результаты своего выполнения, и не выполняется, если результат есть в кэше. 

33. console `npm install --save lodash`
	## - Lodash - это библиотека, с набором полезных функций, для работы с данными, для конвертирования их из одного формата в другой, фильтрации, маппинга и других вещей.
	
34. Edit `src/actions/index.js`:
	## import библиотеки:
	import _ from 'lodash';
	
35. Edit `src/actions/index.js`:
	## `memoize` нашего `action creator` (fetchUser):
	
	## Создаем функцию `_fetchUser` с использованием функции `memoize`
	## `_fetchUser` - `_...` говорит о том, что функция является `private` 
	## переносим в нее содержимое функции `fetchUser`: 
	const _fetchUser = _.memoize(async(id, dispatch) => {
		const responce = await jsonPlaceholder.get(`/users/${id}`);
		dispatch ( { type: 'FETCH_USER', payload: responce.data} )
	});
	
	## а в фнкции `fetchUser` использум memoize-версию функции `_fetchUser` (без дублирущих записей)
	export const fetchUser = (id) => dispatch =>{
		_fetchUser(id, dispatch);
	}
	
	## ******* SOLUTION #1  end ***************
	## ******* SOLUTION #2  start ***************  

	## Описание решения: 
	## создаем новый `action creator` (`fetchPostsAndUsers()`). В нем: 
	## вызываем `fetchPosts()`
	## получаем список постов (get list of posts). 
	## В этом списке находим все уникальные `userId`.  
	## Перебираем все уникальные `userId`. 
	## вызываем метод `fetchUser` с каждым `userId`. 
36. Edit `src/actions/index.js`:
	## возвращаем к состоянию п.33:
	/* solution #1 - memoize
	export const fetchUser = (id) => dispatch =>{
		_fetchUser(id, dispatch);
	}

	const _fetchUser = _.memoize(async(id, dispatch) => {
		const responce = await jsonPlaceholder.get(`/users/${id}`);
		dispatch ( { type: 'FETCH_USER', payload: responce.data} )
	});
	*/
	export const fetchUser = id => async dispatch => {
		const responce = await jsonPlaceholder.get(`/users/${id}`);
		dispatch ( { type: 'FETCH_USER', payload: responce.data} )
	};

37. Edit `src/actions/index.js`:
	## Создаем новый `action creator` `fetchPostsAndUsers()`:
	export const fetchPostsAndUsers = () => async dispatch => {
		## вызываем `fetchPosts()`
		dispatch(fetchPosts());
	};

38. Edit `src/actions/index.js`:
	export const fetchPostsAndUsers = () => async dispatch => {
		## получаем список постов (get list of posts)
		await dispatch(fetchPosts());
	};	

39. Edit `src/components/14/PostList.js`:
	## import
	import { fetchPosts, fetchPostsAndUsers } from '../../actions';
	...
	componentDidMount (){
		this.props.fetchPostsAndUsers();
    }
	...
	export default connect(mapStateToProps,{
		fetchPostsAndUsers: fetchPostsAndUsers
	})(PostList);

40. Edit `src/actions/index.js`:
	## В этом списке находим все уникальные `userId`.  
	export const fetchPostsAndUsers = () => async (dispatch, getState) => {
		await dispatch(fetchPosts());
		//console.log("fetchPostsAndUsers: ", getState().posts);
		## lodash -map() выдает список уникальных значений:
		const userIds = _.uniq(_.map(getState().posts, 'userId'));
	};	
	
41. Edit `src/actions/index.js`:
	## вызываем метод `fetchUser` с каждым `userId`
	const userIds = _.uniq(_.map(getState().posts, 'userId')); // add next string
	userIds.forEach(id => dispatch(fetchUser(id)));
	
42. Edit `src/components/14/UserHeader.js`:
	## поскольку мы вызываем метод `fetchUser` в `userIds.forEach(id => dispatch(fetchUser(id)))`
	## убираем вызовы этого метода:
    //componentDidMount(){
    //    this.props.fetchUser(this.props.userId);
    //}
	...
	//import { fetchUser } from '../../actions';
	...
	## меняем 
	export default connect (mapStateToProps, {fetchUser})(UserHeader);
	## на
	export default connect (mapStateToProps)(UserHeader);
	
	## ******* SOLUTION #2  end ***************

## Chaining — приём, при котором после вызова каждого метода возвращается исходный объект.
## таким образом, появляется возможность выполнять несколько методов последовательно, а не вызывать их по отдельности. 

43. Edit `src/actions/index.js`:	
	## т.е. код :
	const userIds = _.uniq(_.map(getState().posts, 'userId')); // add next string
	userIds.forEach(id => dispatch(fetchUser(id)));
	
	## можно поменять на:
	_.chain(getState().posts)
		.map('userId')
		.uniq()
		.forEach(id => dispatch(fetchUser(id)))
		.value();
	
	
