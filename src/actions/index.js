import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder'; //for chapter 14

//for chapter 13 - start
export const selectItem = (item) =>{
    return{ //Return an action
        type: 'ITEM_SELECTED',
        payload: item
    };
};
//for chapter 13 - end

//for chapter 14 - start

/* solution #1 - memoize
export const fetchUser = (id) => dispatch =>{
    _fetchUser(id, dispatch);
}

const _fetchUser = _.memoize(async(id, dispatch) => {
    const responce = await jsonPlaceholder.get(`/users/${id}`);
    dispatch ( { type: 'FETCH_USER', payload: responce.data} )
});
 solution #1 - end */
// solution #2 - fetchPostsAndUsers()
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
    await dispatch(fetchPosts());
    //console.log("fetchPostsAndUsers: ", getState().posts);
	_.chain(getState().posts)
		.map('userId')
		.uniq()
		.forEach(id => dispatch(fetchUser(id)))
		.value();
};	

export const fetchPosts = () => async dispatch =>{
    const responce = await jsonPlaceholder.get('/posts');
    dispatch( {type: 'FETCH_POSTS', payload: responce.data } )
};

/* solution #2 - end */

export const fetchUser = id => async dispatch => {
    const responce = await jsonPlaceholder.get(`/users/${id}`);
    dispatch ( { type: 'FETCH_USER', payload: responce.data} )
};

//for chapter 14 - end
