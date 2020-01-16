import React from 'react';
import './VideoItem.scss';

const VideoItem = ({video, onVideoSelect}) => {
    return(
        <div onClick={ () => onVideoSelect(video) }  className="video-item item VideoItem">
            <div className="ui top left blue attached label">VideoItem</div>
            <img src={video.snippet.thumbnails.medium.url} className="ui image" alt="" />
            <div className="content">
                <span className="header">{video.snippet.title}</span>
            </div>
        </div>
    )    
}

export default VideoItem;