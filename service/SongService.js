import {
  songData,
} from '../data/songData';


export class SongService {

  getCustomersLarge() {
    return songData;
  }

  getCustomers(params) {
    const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
    return fetch('https://www.primefaces.org/data/customers?' + queryParams).then(res => res.json())
  }
}