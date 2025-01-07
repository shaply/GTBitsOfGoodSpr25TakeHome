/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import {
  BatchEditRequest,
  BatchEditType,
  CreateItemRequest,
  EditStatusRequest,
} from "@/lib/types/request";
import { RequestStatus } from "@/lib/types/request";

function isValidString(str: any, lower?: number, upper?: number): boolean {
  if (typeof str !== "string" || str.trim() == "") {
    return false;
  }
  if ((lower && str.length < lower) || (upper && str.length > upper)) {
    return false;
  }
  return true;
}

function isValidTime(time: any): Date | null {
  if (!time) {
    return null;
  }
  const date = new Date(time);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function isValidName(name: string): boolean {
  return isValidString(name, 3, 30);
}

function isValidItemRequested(item: string): boolean {
  return isValidString(item, 2, 100);
}

export function isValidStatus(status: any): boolean {
  return (
    isValidString(status) &&
    Object.values(RequestStatus).includes(status as RequestStatus)
  );
}

export function isValidBatchType(type: any): boolean {
  return (
    isValidString(type) &&
    Object.values(BatchEditType).includes(type as BatchEditType)
  );
}

export function isValidId(id: any): boolean {
  return typeof id === "number" && id > 0;
}

export function validateCreateItemRequest(
  request: any
): CreateItemRequest | null {
  if (!request.requestorName || !request.itemRequested) {
    return null;
  }
  if (
    !isValidName(request.requestorName) ||
    !isValidItemRequested(request.itemRequested)
  ) {
    return null;
  }
  const newCreateItemRequest: CreateItemRequest = {
    requestorName: request.requestorName,
    itemRequested: request.itemRequested,
  };
  return newCreateItemRequest;
}

export function validateEditStatusRequest(
  request: any
): EditStatusRequest | null {
  if (!request.id || !request.status) {
    return null;
  }
  if (!isValidId(request.id) || !isValidStatus(request.status)) {
    return null;
  }
  const newEditStatusRequest: EditStatusRequest = {
    id: request.id,
    status: request.status,
  };
  return newEditStatusRequest;
}

export function validateBatchEditRequest(request: any): BatchEditRequest | null{
  if (!isValidBatchType(request.type)) {
    return null;
  }
  if (request.type === BatchEditType.EDIT) {
    if (!isValidStatus(request.oldStatus) || !isValidStatus(request.newStatus)) {
      return null;
    }
  } else if (request.type === BatchEditType.DELETE) {
    
  }
  if (!isValidTime(request.beginDate) && !isValidTime(request.endDate)) {
    return null;
  }
  const newBatchEditRequest: BatchEditRequest = {
    type: request.type,
    beginDate: isValidTime(request.beginDate),
    endDate: isValidTime(request.endDate),
    oldStatus: request.oldStatus,
    newStatus: request.newStatus,
  };
  return newBatchEditRequest;
}