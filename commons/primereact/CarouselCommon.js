import { Carousel } from 'primereact/carousel';


export const CarouselCommon = (props) => {
    return (
        <>
            <div className="carousel-container">
              <div className="card surface-0 border-round-2xl">
                  <Carousel value={props.value} numVisible={props.numVisible} numScroll={props.numScroll} className="custom-carousel" circular 
                    autoplayInterval={5000} itemTemplate={props.itemTemplate} header={props.header} />
              </div>
            </div>
        </>
    );
}  