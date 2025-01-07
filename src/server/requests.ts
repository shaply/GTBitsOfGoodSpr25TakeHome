/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import { DatabaseConnectionError } from "@/lib/errors/internalExceptions";
import {
  BatchEditType,
  ItemRequest,
  RequestStatus
} from "@/lib/types/request";
import paginate from "@/lib/utils/pagination";
import {
  isValidStatus,
  validateBatchEditRequest,
  validateCreateItemRequest,
  validateEditStatusRequest,
} from "@/lib/validation/requests";
import {
  generateId,
  uploadNewRequestToDatabase,
  getItemRequestsFromDatabase,
  editItemRequestById,
  deleteItemsByDate,
  editItemsByDate,
} from "@/server/db";

export async function getItemRequests(
  status: string | null,
  page: number
): Promise<ItemRequest[]> {
  const itemRequests = await getItemRequestsFromDatabase();  
  let filteredRequests = itemRequests;
  if (status && isValidStatus(status)) {
    filteredRequests = filteredRequests.filter((req) => req.status === status);
  }
  if (!page) {
    page = 1;
  }
  
  const paginatedRequests = paginate(
    filteredRequests,
    page,
    PAGINATION_PAGE_SIZE
  ).data;
  return paginatedRequests;
}

export async function createNewRequest(request: any): Promise<ItemRequest> {
  const validatedRequest = validateCreateItemRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("created item request");
  }
  const date = new Date();
  const newRequest: ItemRequest = {
    id: generateId(),
    requestorName: validatedRequest.requestorName,
    itemRequested: validatedRequest.itemRequested,
    requestCreatedDate: date,
    lastEditedDate: date,
    status: RequestStatus.PENDING,
  };
  try {
    await uploadNewRequestToDatabase(newRequest);
  } catch (e) {
    console.log({"Error": e});
    throw new DatabaseConnectionError();
  }
  
  return newRequest;
}

export async function editStatusRequest(request: any): Promise<ItemRequest> {
  const validatedRequest = validateEditStatusRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("edit item request");
  }

  const editedItemRequest = await editItemRequestById(validatedRequest.id, validatedRequest.status);
    
  if (!editedItemRequest) {
    throw new InvalidInputError("edit item ID");
  }
  return editedItemRequest;
}

export async function batchEditRequest(request: any): Promise<ItemRequest[]> {
  const batchReq = validateBatchEditRequest(request);
  if (!batchReq) {
    throw new InvalidInputError("batch edit request");
  }

  const beginDate = batchReq.beginDate || new Date('2000-01-01T00:00:00Z');
  const endDate = batchReq.endDate || new Date();
  console.log(beginDate, endDate);
  let itemRequests: ItemRequest[] = [];
  switch (batchReq.type) {
    case BatchEditType.DELETE:
      // Delete requests
      itemRequests = await deleteItemsByDate(beginDate, endDate);
      break;
    case BatchEditType.EDIT:
      // Edit requests
      itemRequests = await editItemsByDate(beginDate, endDate, batchReq.oldStatus, batchReq.newStatus);
      break;
    default:
      throw new InvalidInputError("batch edit type");
  }
  return itemRequests;
}