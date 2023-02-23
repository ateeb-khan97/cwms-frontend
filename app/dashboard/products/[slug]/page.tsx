import HandlerProductPage from 'components/Products/HandleProductPage';
export default function Page({ params }: any) {
  const isUpdate: boolean = params.slug.includes('update');
  return <HandlerProductPage isUpdate={isUpdate} />;
}
