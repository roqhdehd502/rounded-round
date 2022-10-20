import { NewAlbum } from '../components/Main/NewAlbum';
import { PopularContent } from '../components/Main/PopularContent';


Home.layout = "L1";
export default function Home() {

    return (
      <>
          <NewAlbum />
          <PopularContent />
      </>
    );
}    