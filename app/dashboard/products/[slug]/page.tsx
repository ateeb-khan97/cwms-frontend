// // import HandlerProductPage from 'components/Products/HandleProductPage';
// export default function Page({ params }: any) {
//   // const isUpdate: boolean = params.slug.includes('update');
//   return <>{params}</>;
//   // return <HandlerProductPage isUpdate={isUpdate} />;

import HandlerProductPage from 'components/Products/HandleProductPage';
//
export default function Page({ params }: any) {
  const isUpdate: boolean = params.slug.includes('update');
  return (
    <>
      <HandlerProductPage isUpdate={isUpdate} />
    </>
  );
}
