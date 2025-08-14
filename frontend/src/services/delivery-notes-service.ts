import axioInstance from "@/lib/axios";
import { DeliveryNoteFormData } from "@/schemas/delivery-note-schema";
import { DeliveryNote } from "@/types/delivery-note";

async function createDeliveryNote(payload: DeliveryNoteFormData) {
  const response = await axioInstance.post(
    "/deliveryNotes/createDeliveryNote.php",
    payload
  );
  return response.data;
}

async function getDeliveryNotes(): Promise<DeliveryNote[]> {
  const { data: response } = await axioInstance.get(
    "/deliveryNotes/getAllDeliveryNotes.php"
  );
  return response.data;
}

async function fetchDeliveryNote(id: string): Promise<DeliveryNote> {
  try {
    const response = await axioInstance.get<{
      success: boolean;
      data: DeliveryNote;
    }>(`/deliveryNotes/getDeliveryNote.php?id=${id}`);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error("Failed to load delivery note");
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch delivery note");
  }
}

// Export all auth-related functions
export const deliveryNotesServices = {
  createDeliveryNote,
  getDeliveryNotes,
  fetchDeliveryNote,
};
