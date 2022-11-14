import { albumData } from '../data/AlbumData';
import { songData } from '../data/SongData';
import { cartData } from '../data/CartData';
import { contentsData } from '../data/ContentsData';
import { communityData } from '../data/CommunityData';


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

export const getCarts = () => {
    return cartData;
}

export const getContents = () => {
    return contentsData;
}

export const getCommunityData = () => {
    return communityData;
}