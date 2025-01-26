// CompactLoadingListviewCard.tsx
const CompactLoadingListviewCard = () => {
  return (
    <div className="flex items-center gap-4 p-3 animate-pulse">
      <div className="w-12 h-12 bg-[#2d4061] rounded" />
      <div className="flex flex-col flex-grow gap-2">
        <div className="h-4 bg-[#2d4061] rounded w-3/4" />
        <div className="h-3 bg-[#2d4061] rounded w-1/2" />
      </div>
    </div>
  );
};

export default CompactLoadingListviewCard;
