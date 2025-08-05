"use client";

import { FormInput, FormSelect } from "@/components/form/form-utilities";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  UseFormSetValue,
  SubmitHandler,
} from "react-hook-form";
import { CirclePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { multiProductSchema, ProductFormData } from "@/schemas/product-schema";
import { vendorServices } from "@/services/vendor-service";
import axioInstance from "@/lib/axios";
import { productServices } from "@/services/product-service";

// Vendor option interface
interface VendorOption {
  value: string;
  label: string;
}

// Props for ProductRow component
interface ProductRowProps {
  index: number;
  control: Control<ProductFormData>;
  vendorOptions: VendorOption[];
  setValue: UseFormSetValue<ProductFormData>;
  remove?: () => void;
}

// Component for individual product row
const ProductRow: React.FC<ProductRowProps> = ({
  index,
  control,
  vendorOptions,
  setValue,
  remove,
}) => {
  const watchedVendorId = useWatch({
    control,
    name: `products.${index}.vendor_id` as const,
  });

  useEffect(() => {
    if (!watchedVendorId) {
      setValue(`products.${index}.vendor_id`, "", { shouldValidate: true });
      return;
    }
  }, [watchedVendorId, vendorOptions, index, setValue]);

  return (
    <div className="p-4 rounded-md space-y-4 bg-gray-50 border border-gray-400">
      <div className="h-full min-h-22 max-h-24 flex flex-row space-x-4 overflow-x-auto">
        <FormSelect
          control={control}
          name={`products.${index}.vendor_id`}
          label="Vendor"
          variant="searchable"
          placeholder="Select vendor..."
          options={vendorOptions}
          selectClassName="bg-white"
        />
        <FormInput
          control={control}
          name={`products.${index}.name`}
          label="Product Name"
          placeholder="Enter product name"
          inputClassName="bg-white"
        />
        <FormInput
          control={control}
          name={`products.${index}.color`}
          label="Color"
          placeholder="Enter color"
          inputClassName="bg-white"
        />
        <FormInput
          control={control}
          name={`products.${index}.package`}
          label="Package (optional)"
          placeholder="Enter package details"
          inputClassName="bg-white"
        />
        <FormInput
          control={control}
          name={`products.${index}.item_price`}
          label="Item Price"
          type="number"
          placeholder="Enter item price"
          inputClassName="bg-white"
        />
        <FormInput
          control={control}
          name={`products.${index}.quantity`}
          label="Quantity"
          type="number"
          placeholder="Enter quantity"
          inputClassName="bg-white"
        />
      </div>
      {remove && (
        <div className="flex justify-end">
          <Button size="sm" onClick={remove} className="secondary-button">
            <Trash2 size={16} />
            <span className="ml-1">Remove</span>
          </Button>
        </div>
      )}
    </div>
  );
};

// Main form component
export const NewProductForm: React.FC = () => {
  const router = useRouter();
  const [vendorOptions, setVendorOptions] = useState<VendorOption[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(multiProductSchema),
    defaultValues: {
      products: [
        {
          vendor_id: "",
          name: "",
          color: "",
          package: "",
          item_price: 0,
          quantity: 0,
        },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  // Fetch vendors (mocked for now)
  useEffect(() => {
    const loadVendors = async () => {
      const productData = await vendorServices.fetchVendors();
      const products = productData.map((item: any) => ({
        value: item.id,
        label: item.vendor_name,
      }));
      setVendorOptions(products);
    };
    loadVendors();
  }, []);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    await productServices.createProduct(data);
    form.reset();
    router.replace("/products");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <ProductRow
            key={field.id}
            index={index}
            control={control}
            vendorOptions={vendorOptions}
            setValue={setValue}
            remove={index > 0 ? () => remove(index) : undefined}
          />
        ))}
        <div className="flex justify-between items-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Products"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                vendor_id: "",
                name: "",
                color: "",
                package: "",
                item_price: 0,
                quantity: 0,
              })
            }
          >
            <CirclePlus className="h-5 w-5 mr-1" />
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
