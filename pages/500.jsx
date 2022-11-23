import { useContext } from 'react';

import Link from "next/Link";
import Image from 'next/image';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import ProjectContext from '../context';


canNotFindTheCauseError.layout = "L3";
export default function canNotFindTheCauseError() {
    const { prefix } = useContext(ProjectContext);
    
    return (
      <>
          <div className="h-screen flex align-content-center align-items-center justify-content-center form-vertical-align-center">
              <div className="card surface-0 p-5 border-round-2xl">
                  <div className="flex justify-content-center flex-wrap scalein animation-duration-500 animation-iteration-1">
                      <Image className="pt-2" src={`${prefix}/img/error-image.png`} width={250} height={250} quality={70} />
                  </div>
                  <div className="flex justify-content-center flex-wrap mt-4">
                      <h1>원인을 알 수 없는 에러가 발생하였습니다!</h1>
                  </div>
                  <Divider />
                  <div className="flex justify-content-center flex-wrap mt-6">
                      <Link href={`/`}>
                          <Button className="p-button-outlined" label='홈 페이지로 돌아가기' />
                      </Link>
                  </div>
              </div>
          </div>
      </>
    );
}    