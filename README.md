# react

## learn from www.udemy.com 

## chapter 13: Integrating React with Redux
	- Repository: react-songs
	
	Описание:
		- Список песен с детальным описанием выбранной песни
		- Данные хранятся локально в `itemsReducer` (`src/reducers/index.js`)
		- `ItemList` - список песен, которые в данном проекте хранятся в `itemsReducer` (`src/reducers/index.js`)
		- `ItemDetail` - детальное описание элемента`ItemDetail Component` (`src/component/ItemDetail.js`)


## chapter 11: Let's Test Your React Mastery!
	- Repository: react-youtube
	
	Описание:
		- строка поиска. После нажатия на ENTER, выдается 5 видео с youtube по заданному поиску
		- используется API youtube
		- при выборе видео из списка - появляется само видео, доступное для просмотра
		- `SearchBar` - строка поиска. `SearchBar Component` (`src/component/11/SearchBar.js`)
		- `VideoList` - список элементов`VideoList Component` (`src/component/11/VideoList.js`)
		- `VideoItem` - краткое описание элемента`VideoItem Component` (`src/component/11/VideoItem.js`)
		- `VideoDetail` - детальное описание элемента`VideoDetail Component` (`src/component/11/VideoDetail.js`)
		
		YOUTUBE API: AIzaSyAstb3K0wRxG-15_bfjoaHpDPNTvuQ093c


## chapter 14: Async Actions with Redux Thunk
	- Repository: react-blog

	Описание:
		- список постов, полученных из внешнего ресурса (http://jsonplaceholder.typicode.com/)
		- данные берутся из двух JSON:
			- 1: [{title:"Nice blog", body: "bla -bla-bla", userId:1}]	// http://jsonplaceholder.typicode.com/posts
			- 2: [{id:1, name:"Sam", ...},{id:2, name:"Mike", ...}]		// http://jsonplaceholder.typicode.com/users
		- `PostList` - список постов
		- `UserHeader` - имя автора