import { NewAlbum } from '../components/main/newAlbum';
import { Advertisement } from '../components/main/advertisement';
import { PopularContent } from '../components/main/popularContent';


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