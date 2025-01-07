export enum RequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

export enum BatchEditType {
  DELETE = "delete",
  EDIT = "edit",
}

export interface ItemRequest {
  id: number;
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: Date;
  lastEditedDate: Date | null;
  status: RequestStatus;
}

export interface CreateItemRequest {
  requestorName: string;
  itemRequested: string;
}

export interface EditStatusRequest {
  id: number;
  status: RequestStatus;
}

export interface BatchEditRequest {
  type: BatchEditType;
  beginDate: Date | null;
  endDate: Date | null;
  oldStatus: RequestStatus;
  newStatus: RequestStatus;
}