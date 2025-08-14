import axioInstance from "@/lib/axios";
import { customerAccountFormData } from "@/schemas/customer-account-schema";
import { CustomerAccount } from "@/types/customer";

async function createAccount(payload: customerAccountFormData) {
  const { data: response } = await axioInstance.post(
    "/customerAccounts/addAccount.php",
    payload
  );
  return response.data;
}

async function updateAccount(
  accountId: string,
  payload: customerAccountFormData
) {
  const { data: response } = await axioInstance.post(
    "/customerAccounts/updateAccount.php",
    {
      account_id: accountId,
      ...payload,
    }
  );
  return response.data;
}

async function updateDefaultAccount(
  customerId: string,
  newDefaultAccountId: string
) {
  const response = await axioInstance.post(
    "/customerAccounts/updateDefaultAccount.php",
    {
      customer_id: customerId,
      new_default_account_id: newDefaultAccountId,
    }
  );
  return response.data;
}

async function getAccount(accountId: string): Promise<CustomerAccount> {
  const { data: response } = await axioInstance.get(
    `/customerAccounts/getAccount.php?account_id=${accountId}`
  );
  return response.data;
}

async function getAccounts(customertId: string): Promise<CustomerAccount[]> {
  const { data: response } = await axioInstance.get(
    `/customerAccounts/getAccounts.php?customer_id=${customertId}`
  );
  return response.data;
}

export const customerAccountServices = {
  createAccount,
  getAccount,
  getAccounts,
  updateDefaultAccount,
  updateAccount,
};
