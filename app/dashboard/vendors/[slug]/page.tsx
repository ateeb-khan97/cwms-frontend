import HandleVendorsPage from 'components/Vendors/HandleVendorsPage';
export default function Page({ params }: any) {
  const isUpdate: boolean = params.slug.includes('update');
  return <HandleVendorsPage isUpdate={isUpdate} />;
}
