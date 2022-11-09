import { albumData } from '../data/albumData';
import { songData } from '../data/songData';
import { cartData } from '../data/cartData';
import { contentsData } from '../data/contentsData';
import { communityData } from '../data/communityData';


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