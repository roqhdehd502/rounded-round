import { NewAlbum } from '../components/Main/NewAlbum';
import { PopularContent } from '../components/Main/PopularContent';


Home.layout = "L1";
export default function Home() {

    return (
      <>
          <NewAlbum />
          <div className="mt-4 mb-4"></div>
          <div className="card surface-0 p-5 border-round-2xl">
              <div className="flex flex-wrap">
                  <img className="w-12 border-round-2xl" src="https://img.hiphople.com/files/cdn/sloppy2_b.jpg" />
              </div>
          </div>
          <div className="mt-4 mb-4"></div>
          <PopularContent />
      </>
    );
}    