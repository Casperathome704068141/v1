export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
}
