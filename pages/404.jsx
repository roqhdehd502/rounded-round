import Link from "next/Link";

import { Button } from 'primereact/button';


NotFound.layout = "L3";
export default function NotFound() {
    return (
      <>
          <div className="h-screen">
              <h1>페이지를 찾을 수 없습니다!</h1>
              <Link href="/">
                  <Button label='홈 페이지' />
              </Link>
          </div>
      </>
    );
}    