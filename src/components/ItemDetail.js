import React, { Component } from 'react';
import { connect } from 'react-redux';
import './scss/ItemDetail.scss';
const ItemDetail=({item}) =>{
    if (!item){ return  <div>Select an Item...</div>}
    return(
        <div>
            <h3>Details for:</h3>
            <p>Title: {item.title}</p>
            <p>Duration: {item.duration}</p>
        </div>
    );
}

const mapStateToProps = (state) => {
    //console.log("ItemDetail->mapStateToProps: ",state);
    return {item: state.selectedItem};
}
export default connect(mapStateToProps)(ItemDetail);