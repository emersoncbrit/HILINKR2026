export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[16rem]" role="status" aria-label="Carregando">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
