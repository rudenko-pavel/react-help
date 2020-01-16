import React, { Component } from 'react';       // import nessesary libraries
import './scss/ItemsList.scss';                 // import css 
import { connect } from 'react-redux';

import { selectItem } from '../actions';        // `selectItem` - функция из `src/actions/index.js`

class ItemsList extends Component{
    renderList(){
        return this.props.items.map((item, index)=>{
            return(
                <div className="item" key={index}>
                    <div className="content right floated">
                        <button 
                            className="ui primary button"
                            onClick={() => this.props.selectItem(item)}    
                        >
                            Select
                        </button>
                    </div>
                    <div className="left floated content">{item.title}</div>
                </div>
            );
        });
    }

    render(){
        console.log("SongList->render(): ",this.props);
        return( //название разное для разных приложений
            <div className="ui divided list">
                {this.renderList()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("ItemsList->mapStateToProps: ",state);
    return {items: state.items};
}

export default connect(mapStateToProps, {selectItem : selectItem})(ItemsList);