import { combineReducers } from 'redux';

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

export default combineReducers({
    items: itemsReducer,
    selectedItem: selectedItemReducer
});