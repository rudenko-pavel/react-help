import React from 'react';              // import nessesary libraries
import './scss/App.scss';               // import css 

import ItemsList from './ItemsList';    // import comonents
import ItemDetail from './ItemDetail';

import SearchBar from './11/SearchBar';
import youtube from '../apis/youtube';
import VideoList from './11/VideoList';
import VideoDetail from './11/VideoDetail';

import PostList from './14/PostList';

class App extends React.Component{
    state= { videos: [], selectedVideo: null };

    componentDidMount(){
        this.onTermSubmit('sun');                       //for chapter 11. default value
    }

    onTermSubmit = async (term) => {                    //for chapter 11
        const response = await youtube.get('/search', {
            params:{
                q: term
            }
        });
        //console.log(response);
        this.setState({
            videos: response.data.items,
            selectedVideo:response.data.items[0]
        });
    };

    onVideoSelect = (video) =>{                         //for chapter 11
        this.setState({ selectedVideo: video });
       // console.log("onVideoSelect: ", video)
    };

    render(){
        return(                             // return always <div> ... </div>
            <div className="ui container grid main-wrapper ">
                <div className="ui top left red attached label">App</div>
                <div className="ui row">
                    <div className="column sixteen wide">
                        <h3>chapter 13: Integrating React with Redux</h3>
                    </div>
                    <div className="column eight wide ItemsList">
                        <div className="ui top left blue attached label">ItemsList</div>
                        <ItemsList />
                    </div>
                    <div className="column eight wide ItemDetail">
                        <div className="ui top left orange attached label">ItemDetail</div>
                        <ItemDetail />
                    </div>
                </div>


                <div className="ui row">
                    <div className="column sixteen wide">
                        <hr/>
                        <h3>chapter 11: Let's Test Your React Mastery!</h3>
                        <h4>Without Redux!!!</h4>
                    </div>
                    <div className="column sixteen wide SearchBar">
                        <div className="ui top left blue attached label">SearchBar</div>
                        <SearchBar onFormSubmit = {this.onTermSubmit} />
                    </div>
                    <div className="column eight wide VideoDetail">
                        <div className="ui top left blue attached label">VideoDetail</div>
                        <VideoDetail video={this.state.selectedVideo} />
                    </div>
                    <div className="column eight wide VideoList">
                        <div className="ui top left green attached label">VideoList</div>
                        <VideoList 
                            onVideoSelect = {this.onVideoSelect} 
                            videos={this.state.videos}
                        />
                    </div>
                </div>


                <div className="ui row">
                    <div className="column sixteen wide">
                        <hr/>
                        <h3>chapter 14: Async Actions with Redux Thunk</h3>
                    </div>
                    <div className="column sixteen wide PostList">
                        <div className="ui top left orange attached label">PostList</div>
                        <PostList />
                    </div>

                </div>



            </div>
        )
    }
};

export default App;