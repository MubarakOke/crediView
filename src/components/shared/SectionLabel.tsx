import { Badge } from "@/components/ui/badge"

export const SectionLabel: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
    <Badge className={`mt-3 ${color}`}>{children}</Badge>
  )