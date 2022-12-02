import { ProgressSpinner } from 'primereact/progressspinner';


export const LoadingComponent = () => {
    return (
        <div className="card surface-0 p-5 border-round-2xl">
            <div className="flex align-content-center justify-content-center min-h-screen">
                <div className="flex align-items-center justify-content-center">
                    <ProgressSpinner />
                </div>
            </div>
        </div>
    );
}