import { Button } from 'primereact/button';


songDetail.layout = "L1";
export default function songDetail() {


    return (
        <>
            <div className="ml-3">
                <h1 className="mt-0">곡 정보</h1>
                <div className="card ">
                    <div className="grid">
                        <div className="col-4 md:col-4 sm:col-12">
                            <img className="w-auto max-w-20rem" src="https://img.hiphople.com/files/attach/images/11972418/421/045/023/3902e6934b1f1b284bad5ff406442beb.png" />
                        </div>
                        <div className="col-8 md:col-8 sm:col-12">
                            <div className="grid">
                                <div className="col-12">
                                    <h3 className="mb-0">Die Hard</h3>
                                </div>
                                <div className="col-12">
                                    <h3 className="mt-0">Kendrick Lamar</h3>
                                </div>
                                <div className="col-2">
                                    <label>앨범</label>
                                </div>
                                <div className="col-10">
                                    <label>Mr. Morale {'&'} The Big Steppers</label>
                                </div>
                                <div className="col-2">
                                    <label>장르</label>
                                </div>
                                <div className="col-10">
                                    <label>Hip-Hop</label>
                                </div>
                                <div className="col-2">
                                    <label>작사</label>
                                </div>
                                <div className="col-10">
                                    <label>Kendrick Lamar</label>
                                </div>
                                <div className="col-2">
                                    <label>작곡</label>
                                </div>
                                <div className="col-10">
                                    <label>SounwaveDJ, DahiBaby </label>
                                </div>
                                <div className="col-2">
                                    <label>편곡</label>
                                </div>
                                <div className="col-10">
                                    <label>Baby Keem, J.Lbs</label>
                                </div>
                                <div className="col-12">
                                    <h3><i className="mr-2 pi pi-heart"></i>965</h3>
                                    <Button 
                                      icon="pi pi-plus" 
                                      label="담기" 
                                      className="p-button-rounded p-button-outlined mr-3"
                                    />
                                    <Button 
                                      icon="pi pi-download" 
                                      label="다운" 
                                      className="p-button-rounded p-button-outlined"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}  