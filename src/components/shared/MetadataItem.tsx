export const MetadataItem: React.FC<{ icon: React.ReactNode; label: string; value: string | null }> = ({ icon, label, value }) => {
    if (!value) return null
    return (
      <div className="flex items-center space-x-2 py-1">
        <div className="flex-shrink-0">
             {icon}
        </div>
        <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{label}:</span>
        <span className="text-sm text-gray-900 overflow-ellipsis overflow-hidden break-words">{value}</span>
      </div>
    )
  }