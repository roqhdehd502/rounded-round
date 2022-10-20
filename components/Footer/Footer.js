import { Button } from 'primereact/button';

export const Footer = () => {

    return (
      <>
          <footer className="h-6rem mt-6 ml-3 mr-3 text-lg">
              <div className="card">
                  <div className="flex justify-content-between flex-wrap">
                      <div className="flex align-items-center justify-content-center m-2">
                          RoundedRound 1.0.0 by Minwoo Na
                      </div>
                      <div className="flex align-items-center justify-content-center m-2">
                          <Button className="p-button-rounded" icon="pi pi-github" />
                      </div>
                  </div>
              </div>
          </footer>
      </>
    );
}    