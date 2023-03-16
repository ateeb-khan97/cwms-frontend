import HandleCategoriesPage from 'components/Categories/HandleCategoriesPage';
export default function Page({ params }: any) {
  const isUpdate: boolean = params.slug.includes('update');
  return <HandleCategoriesPage isUpdate={isUpdate} />;
}
