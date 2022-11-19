import { Divider } from 'primereact/divider';


export const Footer = () => {
    return (
      <>
          <footer className="h-20rem mt-6 pt-7 text-lg text-white" style={{backgroundColor: '#7249BC'}}>
              <div className="card">
                  <div className="flex justify-content-center flex-wrap">
                      <div className="flex align-items-center justify-content-center m-2">
                          <h3 className="mr-3">Information</h3>
                          <p>
                              © 2022 Rounded Round<br />
                              Guro-gu, Seoul,<br />
                              natorque5552@gmail.com
                          </p>
                      </div>
                      <Divider layout="vertical" />
                      <div className="flex align-items-center justify-content-center m-2">
                          <h3 className="mr-3">License</h3>
                          <p>
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://ko.reactjs.org/" target="_blank" rel="noopener noreferrer">React</a><br />
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://ko.redux.js.org/" target="_blank" rel="noopener noreferrer">Redux</a><br />
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">Next.js</a><br />
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase</a><br />
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://www.primefaces.org/primereact/" target="_blank" rel="noopener noreferrer">Prime React</a><br />
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">Github Pages</a>
                          </p>
                      </div>
                      <Divider layout="vertical" />
                      <div className="flex align-items-center justify-content-center m-2">
                          <h3 className="mr-3">Visit Us</h3>
                          <p>
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://github.com/roqhdehd502" target="_blank" rel="noopener noreferrer">Github</a><br />
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://raadi.tistory.com/" target="_blank" rel="noopener noreferrer">Blog</a><br />
                              <i className="pi pi-external-link mr-2"></i><a className="no-underline text-white" href="https://precious-specialist-25c.notion.site/Profile-ba8d445bf4ee4a33b104b41019b88e1a" target="_blank" rel="noopener noreferrer">Notion</a><br />
                          </p>
                      </div>
                  </div>
              </div>
          </footer>
      </>
    );
}    