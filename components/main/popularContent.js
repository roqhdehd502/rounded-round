import { useState, useEffect } from 'react';

import { getContents } from '../../service';

import { CarouselCommon } from '../../commons/primereact/CarouselCommon';


export const PopularContent = () => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
      setContents(getContents().slice(0,9));
  }, []);

  const contentsTemplate = (content) => {
      return (
          <div className="carousel-item border-round-2xl">
              <div 
                className="h-30rem flex align-items-end flex-wrap carousel-item-content" 
                style={{backgroundImage: `url(${content.thumbnail}), url('https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: 'auto'}}
              >
                  <div className="bg-black-alpha-60 text-white w-full py-2 border-round-bottom-2xl">
                      <h4>{content.title}</h4>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <>
        <div className="carousel-container">
            <div className="card surface-0 p-5 border-round-2xl">
                <CarouselCommon 
                  value={contents} 
                  numVisible={3}
                  numScroll={3}
                  itemTemplate={contentsTemplate} 
                  header={<h2 className="ml-4">인기있는 콘텐츠</h2>} 
                />
            </div>
        </div>
    </>
  );
}  