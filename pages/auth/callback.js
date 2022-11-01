import { useRouter } from 'next/router';


callback.layout = "L2";
export default function callback() {
    const router = useRouter();
    //router.push('/');
    window.location.href = "/";

    return (
        <>
            <div>
                <i className="pi pi-spin pi-spinner" style={{'fontSize': '2em'}}></i>
            </div>
        </>
    );
}