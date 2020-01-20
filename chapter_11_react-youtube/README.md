# react
project: REACT-youtube 

## ## ## ## lesson from www.udemy.com (chapter 11: Let's Test Your React Mastery!)

## ## ## Instruction

# STEP 1:

##  preparation of project (Подготовка проекта)
##  Если проект новый - смотри `README.md` для `chapter 13: Integrating React with Redux`


# STEP 2 (work with react side components): 

## STEP 2.1. Создаем строку поиска. `SearchBar Component` (`src/component/11/SearchBar.js`)
1. Create `src/components/11/SearchBar.scss`, `src/components/11/SearchBar.js`
	import React from 'react';
	import './SearchBar.scss';

	class SearchBar extends React.Component{
		render(){
			return (
				<div>Search Bar</div>
			)
		}
	}

	export default SearchBar;

2. Edit `src/App.js`
    ## импортируем компонент `SearchBar`
	## Импортироваться должны все компоненты
    import SearchBar from './11/SearchBar';
    ...
    // вставляем компонент в App-return
        <div>
            <SearchBar />
        </div>

3. Edit `src/components/11/SearchBar.js`
	## добавляем css и форму в `return`:
	    <div className="search-bar ui segment">
            <form className="ui form">
                <div className="field">
                    <label>Video Search</label>
                    <input type="text" />
				</div>
            </form>
        </div>

4. Edit `src/components/11/SearchBar.js`
	## изменение состояния переменной используя действие `onChange`
	## инициализируем начальное состояние ( add in `class SearchBar extends React.Component{...` ):
	## имя переменной может быть любым
	state = { term:'' };

	## значение input=text должно быть привязано к `onChange`:
		<input type="text"
            value={this.state.term}
			onChange={this.onInputChange}			
        />
		
	## `onInputChange` -  функция, которая меняет состояние переменной `term`
	## add add in `class SearchBar extends React.Component{...` 
	    onInputChange = (event) => {
        this.setState({ term: event.target.value });
    }
	
5. Edit `src/components/11/SearchBar.js`
	## отработка события формы `onSubmit`:
	## edit element:
	<form className="ui form" onSubmit={this.onFormSubmit}>
	
	## add function `onFormSubmit` ( add in `class SearchBar extends React.Component{...` ):
	    onFormSubmit = (event) => {
			## event.preventDefault() - функция, благодаря которой не происходит отправка данных. Т.е. страница не перегружается
			event.preventDefault();
			
			## после этого можем добавлять любой `callback` из родительского компонента
		}
	
## STEP 2.2. Добавление внешних данных в проект

6.	## доступ к `youtube API`
	## API для `youtube` берутся из `console.developers.google.com`
	
	## Create `src/apis/youtube.js`
	## `axios` - Promise based HTTP client for the browser and node.js
	import axios from 'axios';

	const KEY = 'AIzaSyAstb3K0wRxG-15_bfjoaHpDPNTvuQ093c';

	export default axios.create({
		baseURL:'https://www.googleapis.com/youtube/v3',
		## параметры на сайте поставщика `API` 
		params:{
			part: 'snippet', 
			type: 'video',
			maxResults: 10,
			key: `${KEY}`
		}
	});

7. Edit `src/App.js`
	## создаем функцию `onTermSubmit`, чтобы вернуть callback как props в компонент `SearchBar`:
	onTermSubmit = (term) => {
        console.log(term);
    };
	
	## добавляем `props` в `SearchBar`:
	<SearchBar onFormSubmit = {this.onTermSubmit} />
	
8. Edit `src/components/11/SearchBar.js`
    onFormSubmit = (event) => {
        event.preventDefault();
        
        this.props.onFormSubmit(this.state.term);
    }
	
9. Edit `src/App.js`
	## import youtube API:
	import youtube from '../apis/youtube';
	
	## добавляем конфигурированный ранее в `src/apis/youtube.js` экземпляр `axios` в `onTermSubmit`.
	## `onTermSubmit` - функция, отрабатывающая после события `onSubmit`:
	youtube.get('/search',{
		params: {
			q: term
		}
	});
	
	## youtube.get() - асинхронный API-request, т.е. формирование страницы может быть быстрее, чем будут получены данные
	
## STEP 2.3. Обновление состояния с извлеченными данными
10. Edit `src/App.js`
    onTermSubmit = async (term) => {
        const response = await youtube.get('/search', {
            params:{
                q: term
            }
        });
        console.log(response);
		## response.data.items - список полученных видео
    };
		
11. Инициализируем начальные данные (Edit `src/App.js`):
	## add to `class App extends React.Component{...` 
	state= { videos: []};
	
12. Изменяем состояние переменной (Edit `src/App.js`):
	## менять состояние можно ТОЛЬКО через `this.setState()`
	## add to `onTermSubmit = async (term) => {...`
	this.setState({
        videos: response.data.items
    });
		
## STEP 2.4. Использование состояния `State` как `Props`
13. Создаем компонент: `VideoList`:
	import React from 'react';
	import './VideoList.scss';

	const VideoList = (props) =>{
		return(
			<div className="ui relaxed divided list">VideoList</div>
		);
	}

	export default VideoList;
		
14. Edit `src/App.js`
	## import `VideoList`
	import VideoList from './11/VideoList';
	
	## add to `return` - `<VideoList />` + css:
	<div className="column eight wide VideoList">
         <div className="ui top left green attached label">VideoList</div>
        <VideoList />
    </div>
	
14. Edit `src/App.js`
	## передаем `state` как `props`
	<VideoList videos={this.state.videos} />
	
15. Edit `VideoList` (`src/components/11/VideoList`):
	## возвращаем количество полученных видео после `Submit` (`onTermSubmit`)
	## сами виде вывести мы не можем, поскольку получаем массив объектов,
	## а видео выводится по одному. Поэтому нужно передавать массив в новый компонент
	## и выводить, перебирая массив `videos.map((video)=>{...}`
	<div className="ui relaxed divided list">{props.videos.length}</div>
	
## Step 2.5. Визуализация списка видео
16.  Создаем компонент: `VideoItem` (`src/components/11/VideoItem`):
	import React from 'react';
	import './VideoItem.scss';

	const VideoItem = (props) =>{
		return(
			<div>VideoItem</div>
		);
	}

	export default VideoItem;
	
17. Edit `VideoList` (`src/components/11/VideoList`):
	## import `VideoItem` to `VideoList`:
	import VideoItem from './VideoItem';
	
	## insert Component `VideoItem`:
	<div className="ui relaxed divided list">
        {props.videos}
         <VideoItem />
    </div>
	
18. Edit `VideoList` (`src/components/11/VideoList`):
	## Передаем массив видео поэлементно в компонент `VideoItem` и
	## и выводим на экран как массив экземпляров компонента `VideoItem`
	const VideoList = ({videos}) =>{
		const renderedList = videos.map((video)=>{
			return(
				<VideoItem 
					key={video.id.videoId} 
					video={video}
				/>
			) 
		});

		return(
			<div className="ui relaxed divided list">
				{renderedList}
			</div>
		);
	}

19. Edit `VideoItem` (`src/components/11/VideoItem`):
	## у передаваемого объекта `video` (<VideoItem key={video.id.videoId} video={video} />) есть свойства
	## выводим необходимые на экран. (Свойства можно увидеть в консоле):
	const VideoItem = ({video}) => {
		return(
			<div className="video-item item">
				<img src={video.snippet.thumbnails.medium.url} className="ui image" alt="" />
				<div className="content">
					<span className="header">{video.snippet.title}</span>
				</div>
			</div>
		)    
	}
	
## Step 2.6. Communicating from Child to Parent
## передача данных из `VideoItem` в `VideoDetail`
20. Edit `src/App.js`
	## add new `property` to `state`
	state= { videos: [], selectedVideo: null };
	
	## добавляем callback-функцию, меняем состояние переменной `selectedVideo`:
	onVideoSelect = (video) =>{
        this.setState({ selectedVideo: video });
    };
	
	## и передаем ее в виде `props` компонента `VideoList`:
	<VideoList onVideoSelect = {this.onVideoSelect} videos={this.state.videos} />
	
21. Edit `VideoList` (`src/components/11/VideoList`):
	## поскольку мы передали второй параметр, добавляем его и в сам компонент в виде `props`:
	const VideoList = ({videos, onVideoSelect}) =>{ ...
	
22. Edit `VideoList` (`src/components/11/VideoList`):
	## и далее передаем как `props` в коспонент `VideoItem`:
	<VideoItem 
        key={video.id.videoId} 
        video={video} 
        onVideoSelect ={onVideoSelect}    
	/>

23. Edit `VideoItem` (`src/components/11/VideoItem`):	
	## поскольку мы передали второй параметр, добавляем его и в сам компонент в виде `props`:
	const VideoItem = ({video, onVideoSelect}) => {...
	
23. Edit `VideoItem` (`src/components/11/VideoItem`):	
	## добавляем собітие на `OnClick`:
	<div onClick={ () => onVideoSelect(video) } className="video-item item">
	
24. Создаем компонент: `VideoDetail` (`src/components/11/VideoDetail`):
	import React from 'react';
	import './VideoDetail.scss';

	const VideoDetail = ({video}) =>{
		return(
			<div>
				{video.snippet.title}
			</div>
		);
	}

	export default VideoDetail;
	
25. Edit `src/App.js`
	## import Component `VideoDetail`
	import VideoDetail from './11/VideoDetail';
	
	## отображаем его на странице (в середине render-метода)
	<div className="column eight wide VideoDetail">
		<div className="ui top left blue attached label">VideoDetail</div>
		<VideoDetail video={this.state.selectedVideo} />
	</div>


## Step 2.7. Styling
26. Edit `VideoDetail (`src/components/11/VideoDetail`):
	## изначально видео не задано, поэтому делаем заглушку:
	if (!video){
        return <div>Loading...</div>
    }
	
	## add css
    const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;

    return(
        <div>
            <div className="ui embed">
                <iframe title="Video Player" src={videoSrc} />
            </div>
            <div className="ui segment">
                <h4 className="ui header">{video.snippet.title}</h4>
                <p>{video.snippet.description}</p>
            </div>
        </div>
	);
	
27. Edit `src/App.js`
	## добавляем дефолтное значение строки поиска
	componentDidMount(){
        this.onTermSubmit('sun');
    }
	
	## В `onTermSubmit` определяем дефолтное видео как первое из выбранных
	    this.setState({
            videos: response.data.items,
            selectedVideo:response.data.items[0]
        });