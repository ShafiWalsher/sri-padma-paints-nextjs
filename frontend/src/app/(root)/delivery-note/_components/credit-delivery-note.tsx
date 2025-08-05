"use client";

import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Control,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import React, { useEffect, useMemo, useState } from "react";
import {
  CreditDeliveryNoteFormData,
  CreditDeliveryNoteSchema,
} from "@/schemas/delivery-note-schema";
import { productServices } from "@/services/product-service";
import { customerServices } from "@/services/customer-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  FormDatePicker,
  FormInput,
  FormSelect,
} from "@/components/form/form-utilities";
import Link from "next/link";
import { toast } from "sonner";
import { deliveryNotesServices } from "@/services/delivery-notes-service";

// Product option type
interface ProductOption {
  value: number;
  label: string;
  price: number;
  quantity: number;
}

// Customer option type
type CustomerOption = {
  value: number;
  label: string;
  mobile: string;
  old_balance: number;
};

type FormProps = { formClassName?: string };

// ParticularRow Component
const ParticularRow: React.FC<{
  index: number;
  productOptions: ProductOption[];
  remove: (index: number) => void;
  isRemovable: boolean;
  control: Control<CreditDeliveryNoteFormData>;
  setValue: UseFormSetValue<CreditDeliveryNoteFormData>;
  getValues: UseFormGetValues<CreditDeliveryNoteFormData>;
}> = ({ index, productOptions, remove, isRemovable, control, setValue }) => {
  const watcheditem_id = useWatch({
    control,
    name: `particulars.${index}.item_id`,
  });
  const watchedQty = useWatch({
    control,
    name: `particulars.${index}.quantity`,
  });
  const watchedColorPrice = useWatch({
    control,
    name: `particulars.${index}.color_price`,
  });

  useEffect(() => {
    if (!watcheditem_id) {
      // Clear dependent fields when nothing selected
      setValue(`particulars.${index}.item_name`, "");
      setValue(`particulars.${index}.price`, 0);
      setValue(`particulars.${index}.total`, 0);
      return;
    }

    const selected = productOptions.find((p) => p.value === watcheditem_id);
    if (!selected) return;

    setValue(`particulars.${index}.item_name`, selected.label);
    setValue(`particulars.${index}.price`, selected.price);

    // Set quantity only if it's currently zero or invalid
    const qty = watchedQty && Number(watchedQty) > 0 ? Number(watchedQty) : 1;
    if (qty !== Number(watchedQty)) {
      setValue(`particulars.${index}.quantity`, 1);
    }

    // Set Total (including color_price)
    const color = Number(watchedColorPrice) || 0;
    const lineTotal = (selected.price + color) * qty;
    setValue(`particulars.${index}.total`, lineTotal, {
      shouldDirty: true,
    });
  }, [
    watcheditem_id,
    watchedQty,
    watchedColorPrice,
    productOptions,
    index,
    setValue,
  ]);

  return (
    <div className="border border-gray-400 p-2 rounded space-y-2">
      <div className="grid grid-cols-7 gap-2">
        <div className="space-y-1 col-span-2">
          <FormSelect
            control={control}
            name={`particulars.${index}.item_id`}
            label="Product"
            variant="searchable"
            placeholder="Select product..."
            options={productOptions}
          />
        </div>
        <FormInput
          control={control}
          name={`particulars.${index}.quantity`}
          label="Quantity"
          type="number"
          placeholder="Quantity"
        />
        <FormInput
          control={control}
          name={`particulars.${index}.price`}
          label="Price"
          type="number"
          placeholder="Price"
          readOnly
        />
        <FormInput
          control={control}
          name={`particulars.${index}.color_code`}
          label="Color Code"
          placeholder="Color Code"
        />
        <FormInput
          control={control}
          name={`particulars.${index}.color_price`}
          label="Color Price"
          type="number"
          placeholder="Color Price"
        />
        <FormInput
          control={control}
          name={`particulars.${index}.total`}
          label="Total"
          type="number"
          placeholder="Total"
          readOnly
        />
      </div>
      {isRemovable && (
        <p
          onClick={() => remove(index)}
          className="cursor-pointer hover:underline text-sm flex space-x-1 text-red-600/90 w-fit"
          role="button"
          aria-label="Remove item"
        >
          <CircleMinus className="h-5 w-5" />
          <span>Remove Item</span>
        </p>
      )}
    </div>
  );
};

export const CreditDeliveryNote: React.FC<FormProps> = ({
  formClassName = "",
}) => {
  const router = useRouter();
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);

  // Initialize form with explicit type
  const form = useForm<CreditDeliveryNoteFormData>({
    resolver: zodResolver(CreditDeliveryNoteSchema),
    defaultValues: {
      cust_id: null,
      name: "",
      mobile: "",
      date: "",
      particulars: [
        {
          item_id: null,
          item_name: "",
          price: 0,
          quantity: 0,
          color_code: "",
          color_price: 0,
          total: 0,
        },
      ],
      grand_total: 0,
      paid: 0,
      old_balance: 0,
      balance: 0,
    },
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "particulars",
  });

  // Fetch products and customers
  useEffect(() => {
    async function loadData() {
      try {
        const [productData, customerData] = await Promise.all([
          productServices.fetchProducts(),
          customerServices.fetchCustomers(),
        ]);

        setProductOptions(
          productData.map((item: any) => ({
            value: item.id,
            label: item.name,
            price: parseFloat(item.item_price),
            quantity: item.quantity,
          }))
        );

        setCustomerOptions(
          customerData.map((item: any) => ({
            value: Number(item.id), // 👈 Convert to number
            label: item.name,
            mobile: item.mobile || "",
            old_balance: parseFloat(item.balance) || 0,
          }))
        );
      } catch (err: any) {
        toast.error("Error fetching data: " + (err.message || err));
      }
    }

    loadData();
  }, []);

  // Handle customer selection changes
  const watchedcust_id = useWatch({ control, name: "cust_id" });

  const selectedCustomer = useMemo(() => {
    if (!watchedcust_id) return null;
    return customerOptions.find((c) => c.value === watchedcust_id) ?? null;
  }, [watchedcust_id, customerOptions]);

  useEffect(() => {
    if (!selectedCustomer) {
      setValue("name", "", { shouldValidate: true });
      setValue("mobile", "", { shouldValidate: true });
      setValue("old_balance", 0, { shouldValidate: true });
    } else {
      setValue("cust_id", selectedCustomer.value, {
        shouldValidate: true,
      });
      setValue("name", selectedCustomer.label, { shouldValidate: true });
      setValue("mobile", selectedCustomer.mobile, { shouldValidate: true });
      setValue("old_balance", selectedCustomer.old_balance, {
        shouldValidate: true,
      });
    }
  }, [selectedCustomer, setValue]);

  // Compute grand total and balance
  const watchedParticulars = useWatch({ control, name: "particulars" });
  const paid = useWatch({ control, name: "paid" });
  const old_balance = useWatch({ control, name: "old_balance" });

  const calculatedGrandTotal = useMemo(() => {
    return (
      watchedParticulars?.reduce((sum, p) => sum + (Number(p.total) || 0), 0) ??
      0
    );
  }, [watchedParticulars]);

  const calculatedBalance = useMemo(() => {
    return Number(old_balance || 0) + calculatedGrandTotal - Number(paid || 0);
  }, [old_balance, calculatedGrandTotal, paid]);

  useEffect(() => {
    setValue("grand_total", calculatedGrandTotal, { shouldValidate: true });
    setValue("balance", calculatedBalance, { shouldValidate: true });
  }, [calculatedGrandTotal, calculatedBalance, setValue]);

  // Form submission
  const onSubmit: SubmitHandler<CreditDeliveryNoteFormData> = async (data) => {
    await deliveryNotesServices.createDeliveryNote(data);
    router.replace("/delivery-note");
    router.refresh();
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("space-y-4", formClassName)}
      >
        <FormSelect
          control={control}
          name="cust_id"
          label="Customer"
          variant="searchable"
          placeholder="Select customer..."
          options={customerOptions}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="mobile"
            label="Mobile"
            placeholder="Enter mobile number"
            readOnly
          />
          <FormDatePicker
            control={control}
            name="date"
            label="Date"
            placeholder="Select a date"
            dateFormat="yyyy-MM-dd"
            dateDisplayFormat="dd-MM-yyyy"
            returnFormat="string"
          />
          <FormInput
            control={control}
            name="old_balance"
            label="Old Balance"
            type="hidden"
            placeholder="Old Balance"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Particulars</label>
          {fields.map((field, index) => (
            <ParticularRow
              key={field.id}
              index={index}
              productOptions={productOptions}
              remove={remove}
              isRemovable={index !== 0}
              control={control}
              setValue={setValue}
              getValues={getValues}
            />
          ))}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  item_id: null,
                  item_name: "",
                  price: 0,
                  quantity: 0,
                  color_code: "",
                  color_price: 0,
                  total: 0,
                })
              }
              className="text-sm flex items-center space-x-1"
              aria-label="Add item"
            >
              <span>Add Item</span>
              <CirclePlus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <hr className="h-[1px] bg-black/40 mt-10 mb-4" />
        <div className="flex flex-col items-end space-y-2">
          <div className="w-1/3 space-y-2">
            <FormInput
              control={control}
              name="grand_total"
              label="Grand Total"
              type="number"
              readOnly
            />
          </div>
        </div>
        <div className="flex justify-end mt-10 gap-2">
          <Link href="/delivery-note" className="secondary-button">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button"
          >
            {isSubmitting ? "Submitting..." : "Create Delivery Note"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
