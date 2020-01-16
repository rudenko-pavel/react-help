import React from 'react';
import './SearchBar.scss';

class SearchBar extends React.Component{
    state = { term:'' };

    onInputChange = (event) => {
        this.setState({ term: event.target.value });
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        
        this.props.onFormSubmit(this.state.term);
    }

    render(){
        return (
            <div className="search-bar ui segment">
                <div className="search-bar ui segment">
                    <form className="ui form" onSubmit={this.onFormSubmit}>
                        <div className="field">
                            <label>Video Search</label>
                            <input type="text"
                                value={this.state.term} 
                                onChange={this.onInputChange}
                            />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default SearchBar;