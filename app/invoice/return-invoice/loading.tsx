import Loader from 'components/Shared/Loader';

export default function Loading() {
  return (
    <div className="flex h-56 w-full scale-[0.5] items-center justify-center">
      <Loader />
    </div>
  );
}
