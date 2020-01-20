import { combineReducers } from 'redux';
import postsReducer from './postsReducer';
import usersReducer from './usersReducer';

//for chapter 13 -start
const itemsReducer = () =>{
    return [
        { title: 'No Scrubs', duration: '4:05'},
        { title: 'Macarena', duration: '2:30'},
        { title: 'All Star', duration: '3:15'}
    ]
};

const selectedItemReducer = (selectedItem=null, action) => {
    if( action.type ==='ITEM_SELECTED'){
        return action.payload;
    }
    return selectedItem;
};
//for chapter 13 - end

export default combineReducers({
    items:          itemsReducer,                   //for chapter 13
    selectedItem:   selectedItemReducer,            //for chapter 13
    posts:          postsReducer,                   //for chapter 14
	users:          usersReducer                    //for chapter 14
});