export default function EmptyLayout({ children }) {

  return (
      <>
          <div className="content-width-padding ">
              { children }
          </div>
      </>
  );
}