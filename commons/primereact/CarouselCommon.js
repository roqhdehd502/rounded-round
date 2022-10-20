import { Carousel } from 'primereact/carousel';


export const CarouselCommon = (props) => {

  const responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '600px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '480px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  return (
    <>
        <div className="carousel-container">
          <div className="card">
              <Carousel value={props.value} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} className="custom-carousel" circular 
                autoplayInterval={5000} itemTemplate={props.itemTemplate} header={props.header} />
          </div>
        </div>
    </>
  );
}  