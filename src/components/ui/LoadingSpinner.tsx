export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-muted animate-spin border-t-primary"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20"></div>
                </div>
            </div>
        </div>
    );
}
