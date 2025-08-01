import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewCustomerForm } from "../_components/new-customer-form";

const Page = () => {
  return (
    <>
      <Card className="w-full md:w-1/2 !h-fit border-[1px] border-border/20 shadow-none p-0 overflow-hidden">
        <CardHeader className="bg-gray-50 p-0 border-b-[1px] border-border/40 gap-0">
          <CardTitle className="text-xl m-0 p-2 px-4">
            Create New Customer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <NewCustomerForm />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
