import HandleManufacturersPage from 'components/Manufacturers/HandleManufacturersPage';
export default function Page({ params }: any) {
  const isUpdate: boolean = params.slug.includes('update');
  return <HandleManufacturersPage isUpdate={isUpdate} />;
}
