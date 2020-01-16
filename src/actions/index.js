export const selectItem = (item) =>{
    return{ //Return an action
        type: 'ITEM_SELECTED',
        payload: item
    };
};