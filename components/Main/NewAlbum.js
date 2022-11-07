import { useState, useEffect } from 'react';

import { Button } from 'primereact/button';

import { getAlbums } from '../../service';

import { CarouselCommon } from '../../commons/primereact/CarouselCommon';


export const NewAlbum = () => {
  const [leftNewAlbums, setLeftNewAlbums] = useState([]);
  const [rightNewAlbums, setRightNewAlbums] = useState([]);

  useEffect(() => {
      setLeftNewAlbums(getAlbums().slice(0,9));
      setRightNewAlbums(getAlbums().slice(6,9));
  }, []);

  const rightNewAlbumsTemplate = (albums) => {
      return (
          <div className="carousel-item border-round-2xl">
              <div 
                className="h-24rem flex align-items-end flex-wrap carousel-item-content" 
                style={{backgroundImage: `url(${albums.thumbnail}), url('https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: 'auto'}}
              >
                  <div className="bg-black-alpha-60 text-white w-full border-round-bottom-2xl">
                      <h4 className="mb-0">{albums.artistName}</h4><br/>
                      <h3 className="mt-0">{albums.albumName}</h3>
                  </div>
              </div>
          </div>
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
                            {leftNewAlbums.map((item) => {
                                return (
                                  <div 
                                    key={item.id} 
                                    className="col-4 h-8rem w-8rem"
                                    style={{backgroundImage: `url(${item.thumbnail}), url('https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: 'auto'}}
                                  >
                                  </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col">
                        <CarouselCommon 
                          value={rightNewAlbums} 
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