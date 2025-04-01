const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Handles API responses and logs out on 401.
 */
const handleResponse = async (res: Response, logout: () => Promise<void>) => {
    if (res.status === 401) {
        await logout();
        throw { message: "Unauthorized request", status: 401 };
    }

    let responseData;
    try {
        responseData = await res.json();
    } catch (error) {
        throw { message: "Invalid JSON response", status: res.status };
    }

    if (!res.ok) {
        throw { message: responseData?.message || `Error: ${res.statusText}`, status: res.status };
    }

    return { ...responseData, status: res.status };
};

/**
 * Fetch all booking requests (sent and received).
 */
export const fetchRequests = async (logout: () => Promise<void>): Promise<any> => {
    try {
        const res = await fetch(`${BASE_URL}/booking`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        return await handleResponse(res, logout);
    } catch (error) {
        // console.error("Error fetching requests:", error);
        throw error;
    }
};

/**
 * Add a new booking request.
 * @param slot_id - The ID of the slot to book.
 * @param data - The form data to be sent in the request.
 */
export const addRequest = async (slot_id: string, logout: () => Promise<void>, data: object): Promise<any> => {
    try {
        console.log("slot is add request",slot_id)
        const res = await fetch(`${BASE_URL}/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ slot_id, ...data }),
        });

        return await handleResponse(res, logout);
    } catch (error) {
        // console.error("Error adding request:", error);
        throw error;
    }
};

/**
 * Delete a booking request.
 * @param request_id - The ID of the request to delete.
 * @param cancelledBy - Either "sender" or "receiver".
 */
export const deleteRequest = async (request_id: string, cancelledBy: "sender" | "receiver", logout: () => Promise<void>): Promise<any> => {
    try {
        const res = await fetch(`${BASE_URL}/booking`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ request_id, cancelledBy }),
        });

        return await handleResponse(res, logout);
    } catch (error) {
        // console.error("Error deleting request:", error);
        throw error;
    }
};

/**
 * Accept a booking request.
 * @param request_id - The ID of the request to accept.
 */
export const acceptRequest = async (request_id: string, logout: () => Promise<void>): Promise<any> => {
    try {
        const res = await fetch(`${BASE_URL}/booking/accept`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ request_id }),
        });

        return await handleResponse(res, logout);
    } catch (error) {
        // console.error("Error accepting request:", error);
        throw error;
    }
};
