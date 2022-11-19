import { NewAlbum } from '../components/main/NewAlbum';
import { Advertisement } from '../components/main/Advertisement';
import { PopularContent } from '../components/main/PopularContent';


Home.layout = "L1";
export default function Home() {
    return (
      <>
          <NewAlbum />
          <div className="mt-4 mb-4"></div>
          <Advertisement />   
          <div className="mt-4 mb-4"></div>
          <PopularContent />
      </>
    );
}    