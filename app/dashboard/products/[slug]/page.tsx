import HandlerProductPage from 'components/Products/HandleProductPage';
export default function Page({ params }: any) {
  const isUpdate: boolean = params.slug.includes('update');
  return <>Hello</>;
  // return <HandlerProductPage isUpdate={isUpdate} />;
}
