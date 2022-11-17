import { albumData } from '../data/AlbumData';
import { buyHistoryData } from '../data/BuyHistoryData';
import { songData } from '../data/SongData';
import { contentsData } from '../data/ContentsData';


export const getAlbums = () => {
    return albumData;
}

export const getAlbum = (stringTypeId) => {
    const id = stringTypeId * 1; 
    const res = albumData.filter(d => d.id === id);

    return res[0];
}

export const getSongsInAlbum = (stringTypeId) => {
    const id = stringTypeId * 1;
    const res = songData.filter(d => d.albumId === id);

    return res;  
}

export const getSongs = () => {
    return songData;
}

export const getSong = (stringTypeId) => {
    const id = stringTypeId * 1; 
    const res = songData.filter(d => d.id === id);

    return res[0];
}

export const getBuyHistories = () => {
    return buyHistoryData;
}

export const getContents = () => {
    return contentsData;
}