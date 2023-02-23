// types
type PropType = {
  isActive: boolean;
};
//
export default function Sidebar({ isActive }: PropType) {
  const classString: string = isActive ? 'w-[300px]' : 'w-[0px]';
  return (
    <>
      <div className={`overflow-hidden transition-all ${classString}`}>
        <header className="h-[80px] border">header</header>
        <main className="h-[calc(100vh_-_160px)]">Sidebar</main>
        <footer className="h-[80px] border">footer</footer>
      </div>
    </>
  );
}
