
interface GalleryProps {
    images: string[];
    loading: boolean;
  }
  
  export const Gallery: React.FC<GalleryProps> = ({ images, loading }) => {
    return (
      <div className="columns-2 md:columns-3 gap-2 md:gap-4 space-y-2 md:space-y-4">
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-40 w-full bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </>
        )}
  
        {!loading && images?.length === 0 && (
          <div className="pb-8 w-full items-center">
            <span className="block text-sm text-center font-semibold text-gray-500">
              No photos to show
            </span>
          </div>
        )}
  
        {!loading &&
          images?.map((src, index) => (
            <img
              key={index}
              className="w-full rounded-lg break-inside-avoid"
              src={src}
              alt={`Image ${index + 1}`}
            />
          ))}
      </div>
    );
  };