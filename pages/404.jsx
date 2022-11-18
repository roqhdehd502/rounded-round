import { useContext } from 'react';

import Link from "next/Link";

import { Button } from 'primereact/button';

import ProjectContext from '../context';


NotFound.layout = "L3";
export default function NotFound() {
    const { prefix } = useContext(ProjectContext);
    
    return (
      <>
          <div className="h-screen">
              <h1>페이지를 찾을 수 없습니다!</h1>
              <Link href={`/`}>
                  <Button label='홈 페이지' />
              </Link>
          </div>
      </>
    );
}    