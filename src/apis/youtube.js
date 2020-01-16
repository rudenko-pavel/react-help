import axios from 'axios';

const KEY = 'AIzaSyAstb3K0wRxG-15_bfjoaHpDPNTvuQ093c';

export default axios.create({
    baseURL:'https://www.googleapis.com/youtube/v3',
    params:{
        part: 'snippet', 
        type: 'video',
        maxResults: 5,
        key: `${KEY}`
    }
});