import { albumData } from '../data/albumData';
import { cartData } from '../data/cartData';
import { contentsData } from '../data/contentsData';
import { songData } from '../data/songData';
import { communityData } from '../data/communityData';



export const getAlbums = () => {
    return albumData;
}

export const getCarts = () => {
    return cartData;
}

export const getContents = () => {
    return contentsData;
}

export const getSongs = () => {
    return songData;
}

export const getCommunityData = () => {
    return communityData;
}