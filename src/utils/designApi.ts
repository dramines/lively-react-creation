
import { DesignApiPayload } from "@/types/design";
import { toast } from "sonner";

export const sendDesignToApi = async (designData: DesignApiPayload): Promise<boolean> => {
  try {
    // Replace this URL with your actual API endpoint
    const response = await fetch('https://your-api-endpoint.com/designs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(designData)
    });

    if (!response.ok) {
      throw new Error('Failed to send design data');
    }

    toast.success("Design envoyé avec succès !");
    return true;
  } catch (error) {
    console.error('Error sending design:', error);
    toast.error("Erreur lors de l'envoi du design");
    return false;
  }
};
