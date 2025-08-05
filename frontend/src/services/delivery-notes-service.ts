import axioInstance from "@/lib/axios";
import { CashDeliveryNoteFormData } from "@/schemas/delivery-note-schema";
import { DeliveryNote } from "@/types/delivery-note";

async function createDeliveryNote(payload: CashDeliveryNoteFormData) {
  const response = await axioInstance.post(
    "/deliveryNote/createDeliveryNote.php",
    payload
  );
  return response.data;
}

async function fetchDeliveryNotes(): Promise<DeliveryNote[]> {
  try {
    const response = await axioInstance.get<{
      success: boolean;
      data: DeliveryNote[];
    }>("/deliveryNote/getAllDeliveryNotes.php");
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to load delivery notes");
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch delivery notes");
  }
}

async function fetchDeliveryNote(id: string): Promise<DeliveryNote> {
  try {
    const response = await axioInstance.get<{
      success: boolean;
      data: DeliveryNote;
    }>(`/deliveryNote/getDeliveryNote.php?id=${id}`);

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
  fetchDeliveryNotes,
  fetchDeliveryNote,
};
