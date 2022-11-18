import { useContext } from 'react';

import Link from "next/Link";

import { Button } from 'primereact/button';

import ProjectContext from '../context';


CanNotFindTheCauseError.layout = "L3";
export default function CanNotFindTheCauseError() {
    const { prefix } = useContext(ProjectContext);
    
    return (
      <>
          <div className="h-screen">
              <h1>원인을 알 수 없는 에러가 발생하였습니다!</h1>
              <Link href={`/`}>
                  <Button label='홈 페이지' />
              </Link>
          </div>
      </>
    );
}    