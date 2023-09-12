export default function Loader({ className }: { className?: string }) {
  return <span className={`custom_loader ${className}`} />;
}
