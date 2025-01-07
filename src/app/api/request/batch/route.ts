import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InputException } from "@/lib/errors/inputExceptions";
import { ResponseType } from "@/lib/types/apiResponse";
import { batchEditRequest } from "@/server/requests";


export async function PATCH(request: Request) {
    try {
        const req = await request.json();
        const editedRequest = await batchEditRequest(req);
        return new Response(JSON.stringify(editedRequest), {
        status: 200,
        headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error(e);
        if (e instanceof InputException) {
            return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
        }
        return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }
}