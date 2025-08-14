"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  CreditCard,
  Star,
  Plus,
  ReceiptText,
  Send,
  Phone,
  MapPin,
  CalendarClock,
} from "lucide-react";
import { customerServices } from "@/services/customer-service";
import clsx from "clsx";
import BackButton from "@/components/shared/back-button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useConfirmDialog } from "@/contexts/confirm-dialog-context";
import { customerAccountServices } from "@/services/customer-account-service";

export default function CustomerViewPage() {
  const router = useRouter();
  const confirm = useConfirmDialog();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const customerId = searchParams.get("id");

  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const { data } = useQuery({
    enabled: !!customerId,
    queryKey: ["customer", customerId],
    queryFn: () => customerServices.getCustomerDetails(customerId as string),
  });

  const customer = data?.customer;
  const accounts = data?.accounts ?? [];
  if (!customer) return null;

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton overridePath="/customers" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              View Customer Details
            </h1>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-200 mt-4 mb-8" />

      <main className="space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Details */}
          <Card className="lg:col-span-3 h-fit p-0 rounded-lg border-[1px] border-border/20 shadow-none gap-0">
            <CardHeader className="!gap-0 bg-gray-100 rounded-t-lg border-b-[1px] border-border/20">
              <CardTitle className="py-2 text-lg font-medium">
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-muted shadow-sm">
                    <Image
                      src="https://avatar.iran.liara.run/public"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2>{customer.name}</h2>
                    <div className="flex items-center gap-6">
                      <p className="flex gap-1 items-center">
                        <Phone size={16} className="text-gray-500" />
                        {customer.mobile}
                      </p>
                      <p className="flex gap-1 items-center">
                        <MapPin size={16} className="text-gray-500" />
                        {customer.address}
                      </p>
                      <p className="flex gap-1 items-center">
                        <CalendarClock size={16} className="text-gray-500" />
                        {new Date(customer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    onClick={() => {
                      router.push(`/customers/edit?id=${customer.id}`);
                    }}
                    className="secondary-button"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Banknote className="h-8 w-8 text-orange-600" />}
            title="Total Balance"
            value={`₹${data.total_balance}`}
            subtitle="Across all accounts"
            gradient="from-orange-50 to-white"
          />
          <StatCard
            icon={<CreditCard className="h-8 w-8 text-blue-600" />}
            title="Accounts"
            value={data.accounts_count}
            subtitle="Active accounts"
            gradient="from-blue-50 to-white"
          />
          <StatCard
            icon={<Star className="h-8 w-8 text-amber-500" />}
            title="Default Account"
            value={data.default_account.account_name}
            subtitle="Primary account"
            gradient="from-amber-50 to-white"
          />
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="h-fit p-0 rounded-lg border-[1px] border-border/20 shadow-none gap-0">
            <CardHeader className="!gap-0 bg-gray-100 rounded-t-lg border-b-[1px] border-border/20">
              <CardTitle className="py-2 text-lg font-medium">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-2">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                onClick={() => {
                  router.push(`/customers/new-account?cust_id=${customerId}`);
                }}
              >
                <Plus className="h-4 w-4" /> Add New Account
              </Button>
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <ReceiptText className="h-4 w-4" /> View Transactions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Send Statement
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 p-0 rounded-lg border-[1px] border-border/20 shadow-none gap-0">
            <CardHeader className="!gap-0 bg-gray-100 rounded-t-lg border-b-[1px] border-border/20">
              <CardTitle className="py-2 text-lg font-medium">
                Accounts Details
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-2">
              {accounts.map((acc: any) => (
                <div
                  key={acc.id}
                  className={clsx(
                    "p-4 rounded-lg border transition-all duration-200 flex justify-between items-start",
                    acc.is_default
                      ? "border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {acc.account_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {acc.is_default
                          ? "Default Account"
                          : "Standard Account"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(acc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="space-x-4">
                        {!acc.is_default && (
                          <button
                            onClick={async () => {
                              try {
                                await confirm({
                                  title: "Default Account?",
                                  description: `Are you sure you want to make account default ${acc.id}?`,
                                  confirmText: "Yes",
                                });
                              } catch {
                                return;
                              }
                              await customerAccountServices.updateDefaultAccount(
                                customerId!,
                                acc.id
                              );
                              queryClient.invalidateQueries({
                                queryKey: ["customer"],
                              });
                              router.refresh();
                            }}
                            className="text-sm text-primary font-medium hover:underline"
                          >
                            Make this default
                          </button>
                        )}
                        <Link
                          href={`/customers/edit-account?id=${acc.id}`}
                          className="text-sm text-blue-600 font-medium hover:underline"
                        >
                          Edit account
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Balance</p>
                    <p className="text-sm font-semibold">₹{acc.balance}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Card
      className={`p-4 bg-gradient-to-b ${gradient} border border-gray-200 rounded-xl shadow-sm `}
    >
      <CardContent className="flex items-center gap-3 p-0">
        <div className="p-2 rounded-full bg-white shadow-sm">{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
