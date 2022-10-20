import { NavigationBar } from '../components/Header/NavigationBar';
import { Footer } from '../components/Footer/Footer';


export default function DefaultLayout({ children }) {

  return (
      <>
          <NavigationBar />
          <div className="h-6rem"></div>
          <div className="content-width-padding ">
              { children }
          </div>
          <Footer />
      </>
  );
}