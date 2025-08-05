import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/shared/back-button";
import { NewVendorForm } from "../_components/new-vendor-form";

const NewVendorPage = () => {
  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton />
        <h2 className=" text-black/70">Create New Vendor</h2>
      </div>
      <Card className="w-full md:w-1/2 !h-fit border-[1px] border-border/20 shadow-none p-0 overflow-hidden gap-2">
        <CardHeader className="bg-gray-50 p-0 border-b-[1px] border-border/40 gap-0">
          <CardTitle className="text-xl m-0 p-2 px-4">Vendor Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <NewVendorForm />
        </CardContent>
      </Card>
    </>
  );
};

export default NewVendorPage;
