export const SubjectItem: React.FC<{ label: string; value: any }> = ({ label, value }) => {
    return (
      <div className="py-1">
        <div className="text-sm font-medium text-gray-500 whitespace-nowrap">{label}:</div>
        <div className="text-sm text-gray-900 overflow-ellipsis overflow-hidden break-words ml-2">
          {value}
        </div>
      </div>
    )
  }