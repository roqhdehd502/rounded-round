import { useState, useEffect } from 'react';

import { Image } from 'primereact/image';
import { Button } from 'primereact/button';

import { productService } from '../../service/ProductService';

import { CarouselCommon } from '../../commons/primereact/CarouselCommon';


export const NewAlbum = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
      setProducts(productService().slice(0,9));
  }, []);

  const productTemplate = (product) => {
      return (
          <div className="carousel-item">
              <div className="carousel-item-content">
                  <div className="mb-3">
                      <img 
                        src={product.image}
                        onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} 
                        alt={product.name} 
                        className="carousel-image" 
                        width="250"
                      />
                  </div>
                  <div>
                      <h4 className="mb-1">{product.name}</h4>
                      <span className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}>{product.inventoryStatus}</span>
                      <div className="car-buttons mt-5">
                          <Button icon="pi pi-search" className="p-button p-button-rounded mr-2" />
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <>
        <div className="carousel-container">
          <div className="card">
              <CarouselCommon 
                value={products} 
                itemTemplate={productTemplate} 
                header={<h3 className="ml-4">최신 앨범</h3>} 
              />
          </div>
        </div>
    </>
  );
}  