"use client";

import {
  FormDatePicker,
  FormInput,
  FormSelect,
} from "@/components/form/form-utilities";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  DeliveryNoteFormData,
  DeliveryNoteSchema,
} from "@/schemas/delivery-note-schema";
import { customerAccountServices } from "@/services/customer-account-service";
import { customerServices } from "@/services/customer-service";
import { deliveryNotesServices } from "@/services/delivery-notes-service";
import { productServices } from "@/services/product-service";
import { Customer, CustomerAccount } from "@/types/customer";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

interface DeliveryNoteFormProps {
  type: "credit" | "cash";
}

// Define interfaces
interface ProductOption {
  value: number;
  label: string;
  item_name: string;
  price: number;
  quantity: number;
}

interface CustomerOption {
  value: number;
  label: string;
  mobile: string;
}

interface AccountOption {
  value: number;
  label: string;
}

export default function DeliveryNoteForm({ type }: DeliveryNoteFormProps) {
  const router = useRouter();
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  const form = useForm<DeliveryNoteFormData>({
    resolver: zodResolver(DeliveryNoteSchema),
    defaultValues: {
      type: type,
      cust_id: null,
      account_id: null,
      name: "",
      mobile: "",
      date: new Date().toISOString().split("T")[0],
      items: [
        {
          item_id: null,
          item_name: "",
          quantity: 1,
          price: 0,
          color_code: "",
          color_price: 0,
          total: 0,
        },
      ],
      subtotal: 0,
      discount_percent: 5,
      discount_amount: 0,
      total_amount: 0,
    },
    mode: "onBlur",
  });

  const {
    control,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;

  const watchedCustomerId = useWatch({ control, name: "cust_id" });
  const watchedItems = useWatch({ control, name: "items" });
  const watchedDiscountPercent = useWatch({
    control,
    name: "discount_percent",
  });

  // Fetch Customers and Products
  useEffect(() => {
    const loadCustomers = async () => {
      const customers = await customerServices.getCustomers();
      const options = customers.map((customer: Customer) => ({
        value: parseInt(customer.id),
        label: `${customer.name}`,
        mobile: `${customer.mobile}`,
      }));
      setCustomerOptions(options);
    };

    const loadProducts = async () => {
      const products = await productServices.getProducts();
      const options = products.map((product: Product) => ({
        value: product.id,
        label: `${product.product_name}`,
        item_name: `${product.product_name}`,
        price: parseFloat(product.item_price),
        quantity: parseInt(product.quantity),
      }));
      setProductOptions(options);
    };

    loadCustomers();
    loadProducts();
  }, []);

  // Fetch Customer Account for credit DN
  useEffect(() => {
    if (type === "credit" && watchedCustomerId) {
      const loadAccounts = async () => {
        const accounts = await customerAccountServices.getAccounts(
          watchedCustomerId.toString()
        );

        const options = accounts.map((account: CustomerAccount) => ({
          value: parseInt(account.id),
          label: account.account_name,
        }));
        setAccountOptions(options);

        const defaultAccount = accounts.find(
          (acc: CustomerAccount) => acc.is_default === 1
        );
        if (defaultAccount) {
          setValue("account_id", parseInt(defaultAccount.id));
        } else {
          setValue("account_id", null);
        }
      };
      loadAccounts();

      const setMobileName = async () => {
        // If you already have customers list loaded in state
        const selectedCustomer = customerOptions.find(
          (cust) => cust.value === watchedCustomerId
        );
        setValue("mobile", selectedCustomer?.mobile);
        setValue("name", selectedCustomer?.label ?? "", { shouldDirty: true });
      };

      setMobileName();
    }
  }, [watchedCustomerId, customerOptions, type, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    watchedItems.forEach((item, index) => {
      if (!item?.item_id) return;

      const selectedProduct = productOptions.find(
        (prod) => prod.value === item.item_id
      );
      if (!selectedProduct) return;

      // Only update price if it's different
      if (item.price !== selectedProduct.price) {
        setValue(`items.${index}.price`, selectedProduct.price, {
          shouldDirty: true,
        });
        setValue(`items.${index}.item_name`, selectedProduct.item_name, {
          shouldDirty: true,
        });
      }

      // Calculate new total
      const qty = item.quantity || 1;
      const newTotal = (
        qty * selectedProduct.price +
        (item.color_price || 0)
      ).toFixed(2);

      if (item.total.toFixed(2) !== newTotal) {
        setValue(`items.${index}.total`, parseFloat(newTotal), {
          shouldDirty: true,
        });
      }
    });
  }, [watchedItems, productOptions, setValue]);

  // Calculations
  const calculations = useMemo(() => {
    const subtotal =
      watchedItems?.reduce((sum, item) => sum + (Number(item.total) || 0), 0) ??
      0;

    const discountAmount = (subtotal * (watchedDiscountPercent || 5)) / 100;

    const totalAmount = subtotal - discountAmount;

    // Return numbers with 2 decimal precision
    return {
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
    };
  }, [watchedItems, watchedDiscountPercent]);

  useEffect(() => {
    setValue("subtotal", calculations.subtotal);
    setValue("discount_amount", calculations.discountAmount);
    setValue("total_amount", calculations.totalAmount);
  }, [calculations, setValue]);

  async function onSubmit(values: DeliveryNoteFormData) {
    await deliveryNotesServices.createDeliveryNote(values);
    reset();
    router.push("/delivery-note");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation errors:", errors);
        })}
        className="space-y-8"
      >
        {type === "credit" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormSelect
                control={control}
                name="cust_id"
                label="Customer"
                variant="searchable"
                placeholder="Search and select customer"
                options={customerOptions}
                searchPlaceholder="Search customers..."
                emptyMessage="No customers found"
              />
              <FormInput type="hidden" control={control} name="name" />
            </div>

            <FormSelect
              control={control}
              name="account_id"
              label="Customer Account"
              variant="searchable"
              placeholder="Select customer account"
              options={accountOptions}
              searchPlaceholder="Search accounts..."
              emptyMessage="No accounts found"
              disabled={!!(accountOptions.length < 1)}
            />
          </div>
        ) : (
          <FormInput
            control={control}
            name="name"
            label="Customer Name"
            placeholder="Enter customer name"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="mobile"
            label="Mobile Number"
            placeholder="Enter mobile number"
          />
          <FormDatePicker
            control={control}
            name="date"
            label="Date"
            placeholder="Select a date"
            dateFormat="yyyy-MM-dd"
            dateDisplayFormat="dd-MM-yyyy"
            returnFormat="string"
            readOnly={true}
          />
        </div>

        {/* Particulars ROW */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Items</label>
          {fields.map((field, index) => (
            <section
              key={field.id}
              className="border border-gray-400 rounded-md p-2 flex gap-4"
            >
              <div className="grid grid-cols-7 gap-2">
                <div className="space-y-1 col-span-2">
                  <FormSelect
                    control={control}
                    name={`items.${index}.item_id`}
                    label="Product"
                    variant="searchable"
                    placeholder="Select product..."
                    options={productOptions}
                    searchPlaceholder="Search products..."
                    emptyMessage="No products found"
                  />
                  <FormInput
                    control={control}
                    name={`items.${index}.item_name`}
                    type="hidden"
                  />
                </div>
                <FormInput
                  control={control}
                  name={`items.${index}.quantity`}
                  label="Quantity"
                  type="number"
                  placeholder="Quantity"
                />
                <FormInput
                  control={control}
                  name={`items.${index}.price`}
                  label="Price"
                  type="number"
                  placeholder="Price"
                  readOnly
                />
                <FormInput
                  control={control}
                  name={`items.${index}.color_code`}
                  label="Color Code"
                  placeholder="Color Code"
                />
                <FormInput
                  control={control}
                  name={`items.${index}.color_price`}
                  label="Color Price"
                  type="number"
                  placeholder="Color Price"
                />

                <FormInput
                  control={control}
                  name={`items.${index}.total`}
                  label="Total"
                  type="number"
                  placeholder="Total"
                  readOnly
                />
              </div>

              {index !== 0 ? (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-600 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-sm self-center align-middle transition-colors duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              ) : (
                <>
                  <div className="p-2 w-5"></div>
                </>
              )}
            </section>
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
                  quantity: 1,
                  color_code: "",
                  color_price: 0,
                  total: 0,
                })
              }
              className="text-sm flex items-center space-x-1"
            >
              <span>Add Item</span>
              <CirclePlus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* TOTALS */}
        <hr className="h-[1px] bg-black/40 mt-10 mb-4" />

        <div className="flex flex-col items-end space-y-2">
          <div className="w-1/3 space-y-2">
            <FormInput
              control={control}
              name="subtotal"
              label="Subtotal"
              type="number"
              readOnly
              inputClassName="bg-gray-50 font-semibold"
            />
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                control={control}
                name="discount_percent"
                label="Discount %"
                type="number"
                placeholder="Enter discount"
              />
              <FormInput
                control={control}
                name="discount_amount"
                label="Discount Amount"
                type="number"
                readOnly
              />
            </div>
            <FormInput
              control={control}
              name="total_amount"
              label="Total Amount"
              type="number"
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-end mt-10 gap-2">
          <Button
            type="button"
            className="secondary-button"
            onClick={() => router.push("/delivery-note")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="primary-button"
          >
            {isSubmitting ? "Submitting..." : "Create Delivery Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
