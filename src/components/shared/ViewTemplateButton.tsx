import { Button } from "@/components/ui/button"
import { Template } from '@govtechsg/decentralized-renderer-react-components';


export const ViewTemplateButton: React.FC<{ template: Template, selectedTemplateID: Template['id'], setSelectedTemplate: React.Dispatch<React.SetStateAction<Template['id']>> }> = ({ template, selectedTemplateID, setSelectedTemplate }) => (
    <>
        <Button
        variant={selectedTemplateID === template.id ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setSelectedTemplate(template.id)}
        className={`w- px-3 h-7 text-xs font-medium transition-colors duration-200 ${
            selectedTemplateID === template.id 
            ? "bg-gray-400 text-primary-foreground"
            : "text-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
        >
        {template.label}
        </Button>
    </>
  );