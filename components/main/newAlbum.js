import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';

import Link from "next/Link";

import { getAlbums } from '../../service';

import { CarouselCommon } from '../../commons/primereact/CarouselCommon';

//import * as albumsInfoActions from '../../store/modules/albumsInfo';


export const NewAlbum = () => {
    //const dispatch = useDispatch();

    //const albums = useSelector(({ albumsInfo }) => albumsInfo.albums);
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        setAlbums(getAlbums());
        //dispatch(albumsInfoActions.getAlbums());
    }, [albums]);

    const rightNewAlbumsTemplate = (albumObj) => {
        return (
            <Link 
              href={{
                pathname: `/album/${albumObj.id}`,
                query: { aId: albumObj.id },
              }}
              as={`/album/${albumObj.id}`}
            >
                <div className="carousel-item border-round-2xl image-link">
                    <div 
                      className="h-24rem flex align-items-end flex-wrap carousel-item-content" 
                      style={{backgroundImage: `url(${albumObj.thumbnail}), url('https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: 'auto'}}
                    >
                        <div className="bg-black-alpha-60 text-white w-full border-round-bottom-2xl">
                            <h4 className="mb-0">{albumObj.artistName}</h4><br/>
                            <h3 className="mt-0">{albumObj.albumName}</h3>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <>
            <div className="carousel-container">
                <div className="card surface-0 p-5 border-round-2xl">
                    <h2 className="ml-4">최신 앨범</h2>
                    <div className="grid">
                        <div className="col ml-7 py-4">
                            <div className="grid border-round-2xl">
                                {albums.slice(0,9).map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <Link 
                                              href={{
                                                pathname: `/album/${item.id}`,
                                                query: { aId: item.id },
                                              }}
                                              as={`/album/${item.id}`}
                                            >
                                                <div 
                                                  className="col-4 h-8rem w-8rem image-link"
                                                  style={{backgroundImage: `url(${item.thumbnail}), url('https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: 'auto'}}
                                                >
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="col">
                            <CarouselCommon 
                              value={albums.slice(6,9)} 
                              numVisible={1}
                              numScroll={1}
                              itemTemplate={rightNewAlbumsTemplate}  
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}  