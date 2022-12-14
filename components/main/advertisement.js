import { useState, useEffect } from 'react';

import Image from 'next/image';

import { getAdvertisement } from '../../service';

import { LoadingComponent } from '../../components/commons/loadingComponent';


export const Advertisement = () => {
    const [advertisement, setAdvertisement] = useState(null);

    useEffect(() => {
        setAdvertisement(getAdvertisement());
    }, [advertisement ? advertisement.id : null]);

    return (
        <>
            {advertisement ? (
                <>
                    <div className="card surface-0 p-5 border-round-2xl">
                        <div className="flex flex-wrap">
                            <Image className="w-12 border-round-2xl" alt="ad" src={advertisement.thumbnail} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={1150} height={150} quality={100} />
                        </div>
                    </div> 
                </>
            ) : (
                <>
                    <LoadingComponent />
                </>
            )}
        </>
    );
}  